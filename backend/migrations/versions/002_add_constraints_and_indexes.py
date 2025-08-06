"""Add constraints and indexes for better data integrity and performance

Revision ID: 002
Revises: 001
Create Date: 2024-08-06 16:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'  # Update this to match your previous migration
branch_labels = None
depends_on = None


def upgrade():
    """Add constraints, indexes, and improve schema."""
    
    # Note: created_at and updated_at columns already exist from migration 001
    # So we skip adding them and just add the constraints and indexes
    
    # Add constraints to users table
    op.create_check_constraint('username_min_length', 'users', 'length(username) >= 3')
    op.create_check_constraint('username_max_length', 'users', 'length(username) <= 50')
    op.create_check_constraint('email_format', 'users', "email LIKE '%@%.%'")
    
    # Add constraints to cats table (created_at and updated_at already exist)
    op.create_check_constraint('cat_name_min_length', 'cats', 'length(name) >= 1')
    op.create_check_constraint('cat_name_max_length', 'cats', 'length(name) <= 100')
    op.create_check_constraint('target_weight_positive', 'cats', 'target_weight > 0')
    op.create_check_constraint('target_weight_max', 'cats', 'target_weight <= 50')
    
    # Add composite index for cats
    op.create_index('idx_cat_user_name', 'cats', ['user_id', 'name'])
    
    # Add index to date column in weight_records (created_at already exists)
    op.create_index('idx_weight_records_date', 'weight_records', ['date'])
    
    # Add constraints to weight_records table
    op.create_check_constraint('user_weight_positive', 'weight_records', 'user_weight > 0')
    op.create_check_constraint('combined_weight_positive', 'weight_records', 'combined_weight > 0')
    op.create_check_constraint('cat_weight_positive', 'weight_records', 'cat_weight > 0')
    op.create_check_constraint('user_weight_max', 'weight_records', 'user_weight <= 1000')
    op.create_check_constraint('combined_weight_max', 'weight_records', 'combined_weight <= 1000')
    op.create_check_constraint('combined_weight_greater', 'weight_records', 'combined_weight > user_weight')
    op.create_check_constraint('date_not_future', 'weight_records', 'date <= CURRENT_DATE')
    
    # Add composite indexes for weight_records
    op.create_index('idx_weight_cat_date', 'weight_records', ['cat_id', 'date'])
    op.create_index('idx_weight_date_desc', 'weight_records', [sa.text('date DESC')])
    
    # Update foreign key constraints to CASCADE (they already exist from migration 001)
    op.drop_constraint('weight_records_cat_id_fkey', 'weight_records', type_='foreignkey')
    op.create_foreign_key('weight_records_cat_id_fkey', 'weight_records', 'cats', ['cat_id'], ['id'], ondelete='CASCADE')
    
    op.drop_constraint('cats_user_id_fkey', 'cats', type_='foreignkey')
    op.create_foreign_key('cats_user_id_fkey', 'cats', 'users', ['user_id'], ['id'], ondelete='CASCADE')


def downgrade():
    """Remove constraints, indexes, and revert schema changes."""
    
    # Remove foreign key constraints
    op.drop_constraint('cats_user_id_fkey', 'cats', type_='foreignkey')
    op.create_foreign_key('cats_user_id_fkey', 'cats', 'users', ['user_id'], ['id'])
    
    op.drop_constraint('weight_records_cat_id_fkey', 'weight_records', type_='foreignkey')
    op.create_foreign_key('weight_records_cat_id_fkey', 'weight_records', 'cats', ['cat_id'], ['id'])
    
    # Remove indexes
    op.drop_index('idx_weight_date_desc', 'weight_records')
    op.drop_index('idx_weight_cat_date', 'weight_records')
    op.drop_index('idx_weight_records_date', 'weight_records')
    op.drop_index('idx_cat_user_name', 'cats')
    
    # Remove constraints from weight_records
    op.drop_constraint('date_not_future', 'weight_records', type_='check')
    op.drop_constraint('combined_weight_greater', 'weight_records', type_='check')
    op.drop_constraint('combined_weight_max', 'weight_records', type_='check')
    op.drop_constraint('user_weight_max', 'weight_records', type_='check')
    op.drop_constraint('cat_weight_positive', 'weight_records', type_='check')
    op.drop_constraint('combined_weight_positive', 'weight_records', type_='check')
    op.drop_constraint('user_weight_positive', 'weight_records', type_='check')
    
    # Remove constraints from cats
    op.drop_constraint('target_weight_max', 'cats', type_='check')
    op.drop_constraint('target_weight_positive', 'cats', type_='check')
    op.drop_constraint('cat_name_max_length', 'cats', type_='check')
    op.drop_constraint('cat_name_min_length', 'cats', type_='check')
    
    # Remove constraints from users
    op.drop_constraint('email_format', 'users', type_='check')
    op.drop_constraint('username_max_length', 'users', type_='check')
    op.drop_constraint('username_min_length', 'users', type_='check')
    
    # Note: We don't remove created_at/updated_at columns as they were created in migration 001
