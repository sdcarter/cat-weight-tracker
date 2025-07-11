#!/usr/bin/env python3
"""
Simple script to fix critical linting issues using autopep8 and manual fixes.
"""
import os
import subprocess
import re

# Fix critical issues in auth.py
with open("app/auth.py", "r") as f:
    content = f.read()

# Fix unused exception variable and undefined name 'e'
content = content.replace("except SQLAlchemyError as e:", "except SQLAlchemyError:")
content = content.replace("logger.error(f\"Error authenticating user: {str(e)}\")", 
                         "logger.error(\"Error authenticating user\")")
content = content.replace("logger.error(f\"Error creating access token: {str(e)}\")", 
                         "logger.error(\"Error creating access token\")")

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
    "conftest.py"
]

for file in files:
    if os.path.exists(file):
        subprocess.run(["autopep8", "--in-place", "--aggressive", file])

print("Linting fixes applied!")