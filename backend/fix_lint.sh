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

# Run flake8 again to check remaining issues
echo "Checking for remaining issues..."
flake8 ./app/*.py ./tests/*.py ./*.py

echo "Linting fixes complete!"