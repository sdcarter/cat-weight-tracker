"""initial schema

Revision ID: 001
Revises: 
Create Date: 2025-05-27 00:00:00.000000

"""
from alembic import op
from sqlalchemy import Column, Integer, String, Boolean, DateTime, text
from sqlalchemy.engine.reflection import Inspector


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create users table
    op.create_table('users',
        Column('id', Integer(), nullable=False),
        Column('username', String(50), nullable=False),
        Column('email', String(100), nullable=False),
        Column('hashed_password', String(255), nullable=False),
        Column('is_active', Boolean(), nullable=False, server_default='true'),
        Column('created_at', DateTime(), server_default=text('CURRENT_TIMESTAMP'), nullable=False),
        Column('updated_at', DateTime(), server_default=text('CURRENT_TIMESTAMP'), 
                  onupdate=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    
    # Create cats table
    op.create_table('cats',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(50), nullable=False),
        sa.Column('target_weight', sa.Float(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), 
                  onupdate=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint('target_weight > 0', name='check_positive_target_weight')
    )
    op.create_index(op.f('ix_cats_id'), 'cats', ['id'], unique=False)
    op.create_index(op.f('ix_cats_name'), 'cats', ['name'], unique=False)
    
    # Create weight_records table
    op.create_table('weight_records',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('user_weight', sa.Float(), nullable=False),
        sa.Column('combined_weight', sa.Float(), nullable=False),
        sa.Column('cat_weight', sa.Float(), nullable=False),
        sa.Column('cat_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.ForeignKeyConstraint(['cat_id'], ['cats.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint('user_weight > 0', name='check_positive_user_weight'),
        sa.CheckConstraint('combined_weight > user_weight', name='check_combined_weight_greater')
    )
    op.create_index(op.f('ix_weight_records_id'), 'weight_records', ['id'], unique=False)
    op.create_index(op.f('ix_weight_records_date'), 'weight_records', ['date'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_weight_records_id'), table_name='weight_records')
    op.drop_table('weight_records')
    op.drop_index(op.f('ix_cats_name'), table_name='cats')
    op.drop_index(op.f('ix_cats_id'), table_name='cats')
    op.drop_table('cats')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_table('users')