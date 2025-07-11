#!/usr/bin/env python3
import re
from pathlib import Path


def fix_main_py():
    """Fix issues in main.py"""
    path = Path("app/main.py")
    content = path.read_text()

    # Add missing imports
    if "from typing import List, Dict" not in content:
        content = "from typing import List, Dict\n" + content

    if "from .database import get_db" not in content:
        content = content.replace(
            "from fastapi import FastAPI",
            "from fastapi import FastAPI\nfrom .database import get_db"
        )

    # Remove unused imports
    content = re.sub(r"from fastapi import .*Response.*\n", "", content)

    # Fix comment style
    content = content.replace("#client_ip", "# client_ip")

    path.write_text(content)
    print("Fixed main.py")


def fix_auth_py():
    """Fix issues in auth.py"""
    path = Path("app/auth.py")
    content = path.read_text()

    # Fix exception handling
    content = re.sub(
        r"except Exception as e:",
        "except Exception:",
        content
    )

    # Fix references to undefined 'e'
    content = re.sub(
        r"raise HTTPException\(.*status_code=401.*detail=str\(e\).*\)",
        "raise HTTPException(status_code=401, detail='Could not validate credentials')",
        content
    )

    # Fix long lines
    content = re.sub(
        r"def create_access_token\(data: dict, expires_delta: timedelta = None\) -> str:",
        "def create_access_token(\n    data: dict, expires_delta: timedelta = None\n) -> str:",
        content
    )

    content = re.sub(
        r"def get_current_user\(token: str = Depends\(oauth2_scheme\), db: Session = Depends\(get_db\)\) -> User:",
        "def get_current_user(\n    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)\n) -> User:",
        content
    )

    path.write_text(content)
    print("Fixed auth.py")


def fix_schemas_py():
    """Fix issues in schemas.py"""
    path = Path("app/schemas.py")
    content = path.read_text()

    # Remove unused imports
    content = re.sub(r"from typing import .*Union.*\n", "from typing import List, Optional\n", content)
    content = re.sub(r"from pydantic import .*Field.*\n", "from pydantic import BaseModel\n", content)

    path.write_text(content)
    print("Fixed schemas.py")


def fix_conftest_py():
    """Fix issues in conftest.py"""
    path = Path("conftest.py")
    content = path.read_text()

    # Fix filterwarnings
    content = content.replace("filterwarnings", "pytest.filterwarnings")

    # Fix indentation
    content = re.sub(
        r"\"ignore:.*:DeprecationWarning\"",
        '        "ignore:.*:DeprecationWarning"',
        content
    )

    path.write_text(content)
    print("Fixed conftest.py")


if __name__ == "__main__":
    fix_main_py()
    fix_auth_py()
    fix_schemas_py()
    fix_conftest_py()
    print("All specific issues fixed!")