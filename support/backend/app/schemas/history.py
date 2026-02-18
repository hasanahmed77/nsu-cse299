from pydantic import BaseModel


class HistoryCreate(BaseModel):
    movie_id: int
    progress_seconds: int
    completed: bool = False


class HistoryOut(BaseModel):
    movie_id: int
    progress_seconds: int
    completed: bool

    class Config:
        from_attributes = True
