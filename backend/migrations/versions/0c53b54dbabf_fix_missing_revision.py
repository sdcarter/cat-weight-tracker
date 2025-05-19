"""fix_missing_revision

Revision ID: 0c53b54dbabf
Revises: 7e9a6ee5cab7
Create Date: 2025-05-19 14:00:08.029734

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0c53b54dbabf'
down_revision = '7e9a6ee5cab7'
branch_labels = None
depends_on = None


def upgrade():
    # No schema changes needed
    pass


def downgrade():
    # No schema changes needed
    pass