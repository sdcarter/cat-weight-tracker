#!/bin/bash
set -e

# Run autopep8 to fix most issues automatically
echo "Running autopep8 to fix formatting issues..."
autopep8 --in-place --aggressive --aggressive --max-line-length=100 ./app/*.py ./tests/*.py ./*.py

# Run isort to fix import order
echo "Running isort to fix import order..."
isort ./app/*.py ./tests/*.py ./*.py

# Fix undefined filterwarnings in conftest.py
echo "Fixing filterwarnings in conftest.py..."
sed -i.bak '13s/filterwarnings/pytest.filterwarnings/g' ./conftest.py
sed -i.bak '14s/filterwarnings/pytest.filterwarnings/g' ./conftest.py
sed -i.bak '15s/filterwarnings/pytest.filterwarnings/g' ./conftest.py
rm -f ./conftest.py.bak

# Fix unused imports
echo "Fixing unused imports..."

# Fix auth.py
sed -i.bak '/from sqlalchemy.sql.expression import bindparam/d' ./app/auth.py
sed -i.bak 's/except Exception as e:/except Exception:/g' ./app/auth.py

# Fix crud.py
sed -i.bak '/import html/d' ./app/crud.py
sed -i.bak '/from sqlalchemy import text/d' ./app/crud.py
sed -i.bak '/from sqlalchemy.sql.expression import bindparam/d' ./app/crud.py
sed -i.bak '/from sqlalchemy import and_/d' ./app/crud.py

# Fix main.py
sed -i.bak '/from typing import Any/d' ./app/main.py
sed -i.bak '/from fastapi import Response/d' ./app/main.py
sed -i.bak '/from .database import engine/d' ./app/main.py
sed -i.bak 's/client_ip = request.client.host/#client_ip = request.client.host/g' ./app/main.py

# Fix schemas.py
sed -i.bak '/from typing import Union/d' ./app/schemas.py
sed -i.bak '/from pydantic import Field/d' ./app/schemas.py

# Fix test files
sed -i.bak '/import pytest/d' ./tests/test_cats.py
sed -i.bak '/from fastapi.testclient import TestClient/d' ./tests/test_cats.py
sed -i.bak '/import pytest/d' ./tests/test_weights.py
sed -i.bak '/from fastapi.testclient import TestClient/d' ./tests/test_weights.py

# Fix long lines
echo "Fixing long lines..."
sed -i.bak 's/def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:/def get_current_active_user(\n    current_user: User = Depends(get_current_user)\n) -> User:/g' ./app/auth.py
sed -i.bak 's/def get_current_active_admin(current_user: User = Depends(get_current_active_user)) -> User:/def get_current_active_admin(\n    current_user: User = Depends(get_current_active_user)\n) -> User:/g' ./app/auth.py

# Clean up backup files
rm -f ./app/*.bak ./tests/*.bak ./*.bak

# Run flake8 again to check remaining issues
echo "Checking for remaining issues..."
flake8 ./app/*.py ./tests/*.py ./*.py

echo "Linting fixes complete!"