#!/usr/bin/env python3

# This script directly fixes specific linting issues

# Fix auth.py issues
with open("app/auth.py", "r") as f:
    content = f.read()

# Fix unused exception variables
content = content.replace("except Exception as e:", "except Exception:")
content = content.replace("raise HTTPException(status_code=401, detail=str(e))",
                         "raise HTTPException(status_code=401, detail='Could not validate credentials')")

# Fix long lines
content = content.replace(
    "def create_access_token(data: dict, expires_delta: timedelta = None) -> str:",
    "def create_access_token(\n    data: dict, expires_delta: timedelta = None\n) -> str:"
)
content = content.replace(
    "def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:",
    "def get_current_user(\n    token: str = Depends(oauth2_scheme), \n    db: Session = Depends(get_db)\n) -> User:"
)

with open("app/auth.py", "w") as f:
    f.write(content)

# Fix main.py issues
with open("app/main.py", "r") as f:
    content = f.read()

# Fix import issues
lines = content.split("\n")
new_lines = []
seen_imports = set()

for line in lines:
    if "from typing import" in line:
        if "List" not in seen_imports and "Dict" not in seen_imports:
            new_lines.append("from typing import List, Dict")
            seen_imports.add("List")
            seen_imports.add("Dict")
    elif "from fastapi import Response" in line:
        continue  # Skip this line
    elif "from .database import get_db" in line and "get_db" in seen_imports:
        continue  # Skip duplicate import
    else:
        if "get_db" in line and "from .database import get_db" in line:
            seen_imports.add("get_db")
        new_lines.append(line)

with open("app/main.py", "w") as f:
    f.write("\n".join(new_lines))

# Fix schemas.py issues
with open("app/schemas.py", "r") as f:
    content = f.read()

# Remove unused imports
content = content.replace("from typing import Union, List, Optional", "from typing import List, Optional")
content = content.replace("from pydantic import BaseModel, Field", "from pydantic import BaseModel")

with open("app/schemas.py", "w") as f:
    f.write(content)

# Fix conftest.py issues
with open("conftest.py", "r") as f:
    content = f.read()

# Fix indentation
content = content.replace('filterwarnings("ignore', 'pytest.filterwarnings("ignore')
content = content.replace('"ignore:.*:DeprecationWarning"', '        "ignore:.*:DeprecationWarning"')

with open("conftest.py", "w") as f:
    f.write(content)

print("All linting issues fixed directly!")