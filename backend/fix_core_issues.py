#!/usr/bin/env python3

# Fix auth.py issues
with open("app/auth.py", "r") as f:
    content = f.read()

# Fix unused exception variable
content = content.replace("except Exception as e:", "except Exception:")

# Fix undefined name 'e'
content = content.replace("detail=str(e)", "detail='Could not validate credentials'")

# Fix long lines
content = content.replace(
    "def create_access_token(data: dict, expires_delta: timedelta = None) -> str:",
    "def create_access_token(\n    data: dict, \n    expires_delta: timedelta = None\n) -> str:"
)
content = content.replace(
    "def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:",
    "def get_current_user(\n    token: str = Depends(oauth2_scheme), \n    db: Session = Depends(get_db)\n) -> User:"
)

with open("app/auth.py", "w") as f:
    f.write(content)
print("Fixed auth.py")

# Fix main.py issues
with open("app/main.py", "r") as f:
    content = f.read()

# Remove unused Response import
content = content.replace("from fastapi import FastAPI, Depends, HTTPException, Response", 
                         "from fastapi import FastAPI, Depends, HTTPException")

with open("app/main.py", "w") as f:
    f.write(content)
print("Fixed main.py")

# Fix schemas.py issues
with open("app/schemas.py", "r") as f:
    content = f.read()

# Add missing ConfigDict import
if "from pydantic import BaseModel, Field" in content:
    content = content.replace("from pydantic import BaseModel, Field", 
                             "from pydantic import BaseModel, Field, ConfigDict")
elif "from pydantic import BaseModel" in content:
    content = content.replace("from pydantic import BaseModel", 
                             "from pydantic import BaseModel, ConfigDict")

with open("app/schemas.py", "w") as f:
    f.write(content)
print("Fixed schemas.py")

# Fix conftest.py issues
with open("conftest.py", "r") as f:
    content = f.read()

# Fix indentation and long line
content = content.replace(
    'filterwarnings("ignore:.*:DeprecationWarning"',
    'pytest.filterwarnings(\n        "ignore:.*:DeprecationWarning"'
)

with open("conftest.py", "w") as f:
    f.write(content)
print("Fixed conftest.py")

print("Core linting issues fixed!")