from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.watch_history import WatchHistory
from app.schemas.history import HistoryCreate, HistoryOut
from app.models.user import User

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=list[HistoryOut])
async def list_history(
    user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(WatchHistory).where(WatchHistory.user_id == user.id))
    return [
        HistoryOut(
            movie_id=h.movie_id,
            progress_seconds=h.progress_seconds,
            completed=h.completed,
        )
        for h in result.scalars()
    ]


@router.post("", response_model=HistoryOut)
async def upsert_history(
    payload: HistoryCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(WatchHistory).where(
            WatchHistory.user_id == user.id, WatchHistory.movie_id == payload.movie_id
        )
    )
    history = result.scalar_one_or_none()
    if history:
        history.progress_seconds = payload.progress_seconds
        history.completed = payload.completed
    else:
        history = WatchHistory(
            user_id=user.id,
            movie_id=payload.movie_id,
            progress_seconds=payload.progress_seconds,
            completed=payload.completed,
        )
        db.add(history)
    await db.commit()
    return HistoryOut(
        movie_id=history.movie_id,
        progress_seconds=history.progress_seconds,
        completed=history.completed,
    )
