#!/usr/bin/env python3
"""
Simple script to fix critical linting issues using autopep8 and manual fixes.
"""
import os
import subprocess

# Fix critical issues in auth.py
with open("app/auth.py", "r") as f:
    content = f.read()

# Fix unused exception variable and undefined name 'e'
content = content.replace("except SQLAlchemyError as e:", "except SQLAlchemyError:")
content = content.replace(
    "logger.error(f\"Error authenticating user: {str(e)}\")",
    "logger.error(\"Error authenticating user\")"
)
content = content.replace(
    "logger.error(f\"Error creating access token: {str(e)}\")",
    "logger.error(\"Error creating access token\")"
)

# Fix long line in auth.py
content = content.replace(
    "async def get_current_active_user(current_user: models.User = Depends(get_current_user)) -> models.User:",
    "async def get_current_active_user(\n    current_user: models.User = Depends(get_current_user)\n) -> models.User:"
)

with open("app/auth.py", "w") as f:
    f.write(content)

# Fix unused import in main.py
with open("app/main.py", "r") as f:
    content = f.read()

# Remove unused Response import
if ", Response" in content:
    content = content.replace(", Response", "")
elif "Response, " in content:
    content = content.replace("Response, ", "")

with open("app/main.py", "w") as f:
    f.write(content)

# Fix long lines in conftest.py
with open("conftest.py", "r") as f:
    content = f.read()

content = content.replace(
    'pytest.filterwarnings("ignore:.*:DeprecationWarning"',
    'pytest.filterwarnings(\n    "ignore:.*:DeprecationWarning"'
)

with open("conftest.py", "w") as f:
    f.write(content)

# Run autopep8 on core files
files = [
    "app/auth.py",
    "app/main.py",
    "app/schemas.py",
    "app/crud.py",
    "app/config.py",
    "app/database.py",
    "app/models.py",
    "app/plots.py",
    "conftest.py",
    "autopep_fix.py"  # Fix this script too
]

for file in files:
    if os.path.exists(file):
        subprocess.run(["autopep8", "--in-place", "--aggressive", file])

print("Linting fixes applied!")
