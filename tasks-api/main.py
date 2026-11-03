import os
import socket
from contextlib import asynccontextmanager

import psycopg
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel


# Built from environment variables, so the same image works everywhere
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://app:secret@db:5432/tasks"
)


def get_conn():
    return psycopg.connect(DATABASE_URL)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create the table once when the app starts
    with get_conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                done BOOLEAN NOT NULL DEFAULT FALSE
            )
            """
        )

    yield


app = FastAPI(title="Tasks API", lifespan=lifespan)


class TaskIn(BaseModel):
    title: str


@app.get("/health")
def health():
    try:
        with get_conn() as conn:
            conn.execute("SELECT 1")

        return {"status": "ok", "database": "up"}

    except psycopg.OperationalError:
        raise HTTPException(
            status_code=503,
            detail="database unavailable"
        )


@app.get("/")
def root():
    return {
        "app": "tasks-api",
        "container": socket.gethostname()
    }


@app.get("/tasks")
def list_tasks():
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT id, title, done FROM tasks ORDER BY id"
        ).fetchall()

    return [
        {"id": r[0], "title": r[1], "done": r[2]}
        for r in rows
    ]


@app.post("/tasks", status_code=201)
def create_task(task: TaskIn):
    with get_conn() as conn:
        row = conn.execute(
            """
            INSERT INTO tasks (title)
            VALUES (%s)
            RETURNING id, title, done
            """,
            (task.title,),
        ).fetchone()

    return {
        "id": row[0],
        "title": row[1],
        "done": row[2]
    }