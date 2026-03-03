from datetime import datetime
from difflib import SequenceMatcher
import re

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


def _normalize_text(value: str | None) -> str:
    if not value:
        return ""
    return re.sub(r"[^a-z0-9\s]+", " ", value.lower()).strip()


def _movie_search_score(movie: Movie, query: str, query_tokens: list[str]) -> float:
    title = _normalize_text(movie.title)
    description = _normalize_text(movie.description)
    if not title:
        return 0.0

    score = 0.0

    if title == query:
        score += 100.0
    elif title.startswith(query):
        score += 90.0
    elif query in title:
        score += 75.0

    if description and query in description:
        score += 25.0

    token_hits_title = sum(1 for token in query_tokens if token in title)
    token_hits_desc = sum(1 for token in query_tokens if token in description)
    score += token_hits_title * 8.0
    score += token_hits_desc * 2.5

    score += SequenceMatcher(None, query, title).ratio() * 45.0
    if description:
        score += SequenceMatcher(None, query, description[:220]).ratio() * 10.0

    return score


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
    q = (query or "").strip()

    if q:
        normalized_query = _normalize_text(q)
        query_tokens = [t for t in normalized_query.split() if t]
        offset = max(page - 1, 0) * limit
        candidate_count = max(180, offset + limit * 8)

        candidates_result = await db.execute(
            select(Movie).order_by(Movie.created_at.desc()).limit(candidate_count)
        )
        candidates = candidates_result.scalars().all()

        ranked = []
        for movie in candidates:
            score = _movie_search_score(movie, normalized_query, query_tokens)
            if score > 20.0:
                ranked.append((score, movie))

        ranked.sort(
            key=lambda item: (
                -item[0],
                -(item[1].created_at.timestamp() if item[1].created_at else 0),
            )
        )
        movies = [movie for _, movie in ranked[offset : offset + limit]]
    else:
        stmt = select(Movie).order_by(Movie.created_at.desc()).offset((page - 1) * limit).limit(limit)
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
