import os
from urllib.parse import urlparse, parse_qsl, urlunparse, urlencode
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.pool import NullPool
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

connect_args = {}
db_url = settings.database_url

# asyncpg doesn't accept sslmode in the URL; use connect_args instead
if "sslmode=" in db_url:
    parsed = urlparse(db_url)
    query = [(k, v) for k, v in parse_qsl(parsed.query) if k.lower() != "sslmode"]
    db_url = urlunparse(parsed._replace(query=urlencode(query)))

# Supabase requires SSL in production
connect_args["ssl"] = "require"

# Serverless environments should not keep open pools
use_null_pool = os.getenv("VERCEL") == "1" or os.getenv("VERCEL_ENV") is not None
engine = create_async_engine(
    db_url,
    pool_pre_ping=True,
    connect_args=connect_args,
    poolclass=NullPool if use_null_pool else None,
)
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
