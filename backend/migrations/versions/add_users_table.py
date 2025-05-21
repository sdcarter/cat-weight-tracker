"""add users table

Revision ID: add_users_table
Revises: initial_migration
Create Date: 2023-05-20 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer, Boolean
from passlib.context import CryptContext

# revision identifiers, used by Alembic.
revision = 'add_users_table'
down_revision = 'initial_migration'
branch_labels = None
depends_on = None

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)


def upgrade():
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    
    # Add user_id column to cats table
    op.add_column('cats', sa.Column('user_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_cats_user_id', 'cats', 'users', ['user_id'], ['id'])
    
    # Create a default user
    users_table = table(
        'users',
        column('id', Integer),
        column('username', String),
        column('email', String),
        column('hashed_password', String),
        column('is_active', Boolean)
    )
    
    op.bulk_insert(
        users_table,
        [
            {
                'id': 1,
                'username': 'demo',
                'email': 'demo@example.com',
                'hashed_password': get_password_hash('password'),
                'is_active': True
            }
        ]
    )
    
    # Associate existing cats with the default user
    op.execute("UPDATE cats SET user_id = 1 WHERE user_id IS NULL")
    
    # Make user_id non-nullable after updating existing records
    op.alter_column('cats', 'user_id', nullable=False)


def downgrade():
    # Remove foreign key constraint
    op.drop_constraint('fk_cats_user_id', 'cats', type_='foreignkey')
    
    # Remove user_id column from cats
    op.drop_column('cats', 'user_id')
    
    # Drop users table
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')