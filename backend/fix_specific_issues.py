#!/usr/bin/env python3
import re
import sys
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
    
    content = re.sub(
        r"except HTTPException as e:",
        "except HTTPException:",
        content
    )
    
    content = re.sub(
        r"except JWTError as e:",
        "except JWTError:",
        content
    )
    
    # Fix long lines
    content = re.sub(
        r"def get_current_active_user\(current_user: User = Depends\(get_current_user\)\) -> User:",
        "def get_current_active_user(\n    current_user: User = Depends(get_current_user)\n) -> User:",
        content
    )
    
    content = re.sub(
        r"def get_current_active_admin\(current_user: User = Depends\(get_current_active_user\)\) -> User:",
        "def get_current_active_admin(\n    current_user: User = Depends(get_current_active_user)\n) -> User:",
        content
    )
    
    path.write_text(content)
    print("Fixed auth.py")

def fix_conftest_py():
    """Fix issues in conftest.py"""
    path = Path("conftest.py")
    content = path.read_text()
    
    # Fix filterwarnings
    content = content.replace("filterwarnings", "pytest.filterwarnings")
    
    path.write_text(content)
    print("Fixed conftest.py")

if __name__ == "__main__":
    fix_main_py()
    fix_auth_py()
    fix_conftest_py()
    print("All specific issues fixed!")