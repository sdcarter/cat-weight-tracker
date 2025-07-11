#!/usr/bin/env python3

# Fix auth.py issues
with open("app/auth.py", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # Fix unused exception variable
    if "except SQLAlchemyError as e:" in line:
        new_lines.append("    except SQLAlchemyError:\n")
    # Fix undefined name 'e'
    elif "logger.error(f\"Error authenticating user: {str(e)}\")" in line:
        new_lines.append("        logger.error(\"Error authenticating user\")\n")
    elif "logger.error(f\"Error creating access token: {str(e)}\")" in line:
        new_lines.append("        logger.error(\"Error creating access token\")\n")
    else:
        new_lines.append(line)

with open("app/auth.py", "w") as f:
    f.writelines(new_lines)
print("Fixed auth.py")

# Fix main.py issues
with open("app/main.py", "r") as f:
    content = f.read()

# Remove unused Response import
if ", Response" in content:
    content = content.replace(", Response", "")
elif "Response, " in content:
    content = content.replace("Response, ", "")

with open("app/main.py", "w") as f:
    f.write(content)
print("Fixed main.py")

print("Critical linting issues fixed!")