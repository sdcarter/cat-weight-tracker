"""merge migrations

Revision ID: merge_migrations
Revises: add_users_table
Create Date: 2023-05-20 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'merge_migrations'
down_revision = None
branch_labels = None
depends_on = ['add_users_table']


def upgrade():
    pass


def downgrade():
    pass