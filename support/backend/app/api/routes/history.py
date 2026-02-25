from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.movie import Movie
from app.models.watch_history import WatchHistory
from app.schemas.history import HistoryCreate, HistoryOut
from app.models.user import User

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=list[HistoryOut])
async def list_history(
    user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(WatchHistory, Movie.title)
        .join(Movie, Movie.id == WatchHistory.movie_id)
        .where(WatchHistory.user_id == user.id)
        .order_by(WatchHistory.updated_at.desc())
    )
    return [
        HistoryOut(
            movie_id=h.movie_id,
            movie_title=title,
            progress_seconds=h.progress_seconds,
            completed=h.completed,
        )
        for h, title in result.all()
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
    title_result = await db.execute(select(Movie.title).where(Movie.id == history.movie_id))
    movie_title = title_result.scalar_one_or_none()
    return HistoryOut(
        movie_id=history.movie_id,
        movie_title=movie_title,
        progress_seconds=history.progress_seconds,
        completed=history.completed,
    )
