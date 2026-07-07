# FinAL API — Hugging Face Space (Docker runtime, CPU)
FROM python:3.11-slim

WORKDIR /app

COPY requirements-space.txt .
RUN pip install --no-cache-dir -r requirements-space.txt

COPY app.py model.pth ./

# writable caches for HF Spaces' non-root user; BERT sentiment model
# (~670MB) downloads here on first boot
ENV HOME=/tmp \
    HF_HOME=/tmp/hf \
    TORCH_HOME=/tmp/torch

EXPOSE 7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
