import os
import ssl
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.pool import NullPool
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

connect_args = {}
is_serverless = os.getenv("VERCEL") == "1" or os.getenv("VERCEL_ENV") is not None
db_url = settings.database_pool_url if (is_serverless and settings.database_pool_url) else settings.database_url

# Normalize DB URL for SQLAlchemy asyncpg.
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)
elif db_url.startswith("postgresql://") and "+asyncpg" not in db_url:
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

parsed = urlparse(db_url)
filtered_query = []
for key, value in parse_qsl(parsed.query):
    # These keys can break asyncpg when passed through SQLAlchemy.
    if key.lower() in {"sslmode", "family"}:
        continue
    filtered_query.append((key, value))
db_url = urlunparse(parsed._replace(query=urlencode(filtered_query)))

# Supabase requires SSL, but local Python trust stores may fail certificate chain verification.
# Keep SSL enabled and allow verification toggle via env.
ssl_verify = os.getenv("DB_SSL_VERIFY", "false").strip().lower() in {"1", "true", "yes"}
ssl_context = ssl.create_default_context()
if not ssl_verify:
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
connect_args["ssl"] = ssl_context

# Serverless environments should not keep open pools
use_null_pool = is_serverless
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
