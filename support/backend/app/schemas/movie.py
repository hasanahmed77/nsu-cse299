from pydantic import BaseModel, Field


class SubtitleOut(BaseModel):
    language: str
    label: str
    url: str

    class Config:
        from_attributes = True


class MovieBase(BaseModel):
    title: str
    description: str
    year: int | None = None
    duration_minutes: int | None = None
    maturity_rating: str | None = None
    poster_url: str | None = None
    backdrop_url: str | None = None


class MovieOut(MovieBase):
    id: int
    hls_master_url: str
    genres: list[str] = Field(default_factory=list)
    subtitles: list[SubtitleOut] = Field(default_factory=list)

    class Config:
        from_attributes = True
