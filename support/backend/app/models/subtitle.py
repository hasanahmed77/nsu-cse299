from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Subtitle(Base):
    __tablename__ = "subtitles"

    id: Mapped[int] = mapped_column(primary_key=True)
    movie_id: Mapped[int] = mapped_column(ForeignKey("movies.id"), index=True)
    language: Mapped[str] = mapped_column(String(10))
    label: Mapped[str] = mapped_column(String(50))
    url: Mapped[str] = mapped_column(String(1000))
