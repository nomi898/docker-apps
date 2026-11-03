FROM python:3.13-slim

# Don't write .pyc files; print logs immediately (no buffering)
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies first so this layer is cached
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy the code
COPY . .

# Create and switch to a normal user
RUN useradd --create-home appuser

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]