FROM python:3.11-slim

WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Add flake8 configuration
COPY .flake8 .

# No scripts to make executable

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4000"]