import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api.routes import auth, movies, history

app = FastAPI(title=settings.project_name)

raw_origins = (settings.cors_origins or "").strip()
origins: list[str] = []
if raw_origins:
    origins = [o.strip() for o in raw_origins.split(",")]

# normalize and drop empties
origins = [o.rstrip("/") for o in origins if o]

raw_origin_regex = os.getenv("CORS_ORIGIN_REGEX", "").strip()
origin_regex = raw_origin_regex or r"^https://[a-zA-Z0-9-]+\.vercel\.app$"

allow_credentials = True
if "*" in origins:
    # Wildcard cannot be used with credentials
    allow_credentials = False
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=origin_regex,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.api_v1_prefix)
app.include_router(movies.router, prefix=settings.api_v1_prefix)
app.include_router(history.router, prefix=settings.api_v1_prefix)

if os.path.isdir("media"):
    app.mount("/media", StaticFiles(directory="media"), name="media")


@app.get("/health")
async def health():
    return {"ok": True}
