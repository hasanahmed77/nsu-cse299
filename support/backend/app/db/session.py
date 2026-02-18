import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.pool import NullPool
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

connect_args = {}
if "sslmode=" not in settings.database_url:
    # Supabase requires SSL in production
    connect_args["ssl"] = "require"

# Serverless environments should not keep open pools
use_null_pool = os.getenv("VERCEL") == "1" or os.getenv("VERCEL_ENV") is not None
engine = create_async_engine(
    settings.database_url,
    pool_pre_ping=True,
    connect_args=connect_args,
    poolclass=NullPool if use_null_pool else None,
)
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
