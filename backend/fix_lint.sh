#!/bin/bash
set -e

# Run autopep8 to fix most issues automatically
echo "Running autopep8 to fix formatting issues..."
autopep8 --in-place --aggressive --aggressive --max-line-length=100 ./app/*.py ./tests/*.py ./*.py

# Run isort to fix import order
echo "Running isort to fix import order..."
isort ./app/*.py ./tests/*.py ./*.py

# Fix main.py imports and undefined names
echo "Fixing main.py imports and undefined names..."
# Add missing imports
sed -i.bak '1s/^/from typing import List, Dict\n/' ./app/main.py
sed -i.bak '5s/^/from .database import get_db\n/' ./app/main.py
# Fix comment style
sed -i.bak 's/#client_ip/# client_ip/g' ./app/main.py

# Fix auth.py issues
echo "Fixing auth.py issues..."
# Fix exception handling
sed -i.bak 's/except Exception as e:/try:\n        return verify_password(plain_password, hashed_password)\n    except Exception:/g' ./app/auth.py
sed -i.bak 's/except HTTPException as e:/except HTTPException:/g' ./app/auth.py
sed -i.bak 's/except JWTError as e:/except JWTError:/g' ./app/auth.py
# Fix long lines
sed -i.bak 's/def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:/def get_current_active_user(\n    current_user: User = Depends(get_current_user)\n) -> User:/g' ./app/auth.py
sed -i.bak 's/def get_current_active_admin(current_user: User = Depends(get_current_active_user)) -> User:/def get_current_active_admin(\n    current_user: User = Depends(get_current_active_user)\n) -> User:/g' ./app/auth.py

# Fix conftest.py filterwarnings
echo "Fixing filterwarnings in conftest.py..."
sed -i.bak 's/filterwarnings/pytest.filterwarnings/g' ./conftest.py

# Clean up backup files
rm -f ./app/*.bak ./tests/*.bak ./*.bak

# Run flake8 again to check remaining issues
echo "Checking for remaining issues..."
flake8 ./app/*.py ./tests/*.py ./*.py || true

echo "Linting fixes complete!"