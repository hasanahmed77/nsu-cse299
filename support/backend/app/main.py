import os
import re
from fastapi import FastAPI
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
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
compiled_origin_regex = re.compile(origin_regex) if origin_regex else None

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


def _is_allowed_origin(origin: str | None) -> bool:
    if not origin:
        return False
    normalized = origin.rstrip("/")
    if normalized in origins:
        return True
    if compiled_origin_regex and compiled_origin_regex.match(normalized):
        return True
    return False


@app.middleware("http")
async def cors_fallback_middleware(request: Request, call_next):
    origin = request.headers.get("origin")
    allowed = _is_allowed_origin(origin)

    if request.method == "OPTIONS" and allowed:
        preflight = Response(status_code=200)
        preflight.headers["Access-Control-Allow-Origin"] = origin.rstrip("/")
        preflight.headers["Vary"] = "Origin"
        preflight.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,PATCH,DELETE,OPTIONS"
        preflight.headers["Access-Control-Allow-Headers"] = request.headers.get(
            "access-control-request-headers", "*"
        )
        if allow_credentials:
            preflight.headers["Access-Control-Allow-Credentials"] = "true"
        return preflight

    try:
        response = await call_next(request)
    except Exception:
        response = JSONResponse(status_code=500, content={"detail": "Internal Server Error"})

    if allowed and origin:
        response.headers["Access-Control-Allow-Origin"] = origin.rstrip("/")
        response.headers["Vary"] = "Origin"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,PATCH,DELETE,OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = request.headers.get(
            "access-control-request-headers", "*"
        )
        if allow_credentials:
            response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

app.include_router(auth.router, prefix=settings.api_v1_prefix)
app.include_router(movies.router, prefix=settings.api_v1_prefix)
app.include_router(history.router, prefix=settings.api_v1_prefix)

if os.path.isdir("media"):
    app.mount("/media", StaticFiles(directory="media"), name="media")


@app.get("/health")
async def health():
    return {"ok": True}
