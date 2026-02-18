from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.movie import Movie
from app.models.movie_genre import MovieGenre
from app.models.watch_history import WatchHistory


async def recommend_for_movie(db: AsyncSession, movie_id: int, limit: int = 12) -> list[Movie]:
    genre_ids_stmt = select(MovieGenre.genre_id).where(MovieGenre.movie_id == movie_id)
    popular_in_genres = (
        select(Movie)
        .join(MovieGenre, MovieGenre.movie_id == Movie.id)
        .where(MovieGenre.genre_id.in_(genre_ids_stmt))
        .group_by(Movie.id)
        .order_by(func.count(Movie.id).desc())
        .limit(limit)
    )
    result = await db.execute(popular_in_genres)
    return list(result.scalars())


async def recommend_for_user(db: AsyncSession, user_id: int, limit: int = 12) -> list[Movie]:
    recent_movie_ids = (
        select(WatchHistory.movie_id)
        .where(WatchHistory.user_id == user_id)
        .order_by(WatchHistory.updated_at.desc())
        .limit(20)
    )
    popular_stmt = (
        select(Movie)
        .where(Movie.id.notin_(recent_movie_ids))
        .limit(limit)
    )
    result = await db.execute(popular_stmt)
    return list(result.scalars())
