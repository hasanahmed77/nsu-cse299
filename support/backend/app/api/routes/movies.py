from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError

from app.db.session import get_db
from app.models.genre import Genre
from app.models.movie import Movie
from app.models.movie_genre import MovieGenre
from app.models.subtitle import Subtitle
from app.models.watch_history import WatchHistory
from app.schemas.movie import MovieOut, SubtitleOut
from app.services.recommendations import recommend_for_movie

router = APIRouter(prefix="/movies", tags=["movies"])


async def _hydrate_movie(db: AsyncSession, movie: Movie) -> MovieOut:
    genres: list[str] = []
    subtitles: list[SubtitleOut] = []
    try:
        genres_result = await db.execute(
            select(Genre.name).join(MovieGenre, MovieGenre.genre_id == Genre.id).where(
                MovieGenre.movie_id == movie.id
            )
        )
        genres = list(genres_result.scalars())
    except SQLAlchemyError:
        genres = []

    try:
        subtitles_result = await db.execute(select(Subtitle).where(Subtitle.movie_id == movie.id))
        subtitles = [SubtitleOut.model_validate(s) for s in subtitles_result.scalars()]
    except SQLAlchemyError:
        subtitles = []

    return MovieOut(
        id=movie.id,
        title=movie.title,
        description=movie.description,
        year=movie.year,
        duration_minutes=movie.duration_minutes,
        maturity_rating=movie.maturity_rating,
        poster_url=movie.poster_url,
        backdrop_url=movie.backdrop_url,
        hls_master_url=movie.hls_master_url,
        genres=genres,
        subtitles=subtitles,
    )


@router.get("", response_model=list[MovieOut])
async def list_movies(
    query: str | None = None, page: int = 1, limit: int = 24, db: AsyncSession = Depends(get_db)
):
    stmt = select(Movie)
    if query:
        stmt = stmt.where(Movie.title.ilike(f"%{query}%"))
    stmt = stmt.order_by(Movie.created_at.desc()).offset((page - 1) * limit).limit(limit)
    result = await db.execute(stmt)
    movies = result.scalars().all()
    return [await _hydrate_movie(db, m) for m in movies]


@router.get("/trending", response_model=list[MovieOut])
async def trending(db: AsyncSession = Depends(get_db)):
    try:
        stmt = (
            select(Movie)
            .join(WatchHistory, WatchHistory.movie_id == Movie.id)
            .group_by(Movie.id)
            .order_by(func.count(WatchHistory.id).desc(), Movie.created_at.desc())
            .limit(10)
        )
        result = await db.execute(stmt)
        movies = result.scalars().all()
    except SQLAlchemyError:
        # Fallback keeps homepage functional if watch_history isn't ready in deployed DB.
        fallback_stmt = select(Movie).order_by(Movie.created_at.desc()).limit(10)
        fallback_result = await db.execute(fallback_stmt)
        movies = fallback_result.scalars().all()
    return [await _hydrate_movie(db, m) for m in movies]


@router.get("/latest", response_model=list[MovieOut])
async def latest_releases(limit: int = 10, db: AsyncSession = Depends(get_db)):
    current_year = datetime.utcnow().year
    min_year = current_year - 1
    stmt = (
        select(Movie)
        .where(Movie.year.is_not(None), Movie.year >= min_year)
        .order_by(Movie.year.desc(), Movie.created_at.desc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    movies = result.scalars().all()
    return [await _hydrate_movie(db, m) for m in movies]


@router.get("/{movie_id}", response_model=MovieOut)
async def get_movie(movie_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Movie).where(Movie.id == movie_id))
    movie = result.scalar_one_or_none()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    return await _hydrate_movie(db, movie)


@router.get("/{movie_id}/recommendations", response_model=list[MovieOut])
async def movie_recommendations(movie_id: int, db: AsyncSession = Depends(get_db)):
    movies = await recommend_for_movie(db, movie_id)
    return [await _hydrate_movie(db, m) for m in movies]
