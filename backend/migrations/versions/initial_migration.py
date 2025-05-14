"""Initial migration

Revision ID: 001
Revises: 
Create Date: 2023-11-15

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create cats table
    op.create_table('cats',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('target_weight', sa.Float(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_cats_id'), 'cats', ['id'], unique=False)
    op.create_index(op.f('ix_cats_name'), 'cats', ['name'], unique=False)
    
    # Create weight_records table
    op.create_table('weight_records',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('date', sa.Date(), nullable=True),
        sa.Column('user_weight', sa.Float(), nullable=True),
        sa.Column('combined_weight', sa.Float(), nullable=True),
        sa.Column('cat_weight', sa.Float(), nullable=True),
        sa.Column('cat_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['cat_id'], ['cats.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_weight_records_id'), 'weight_records', ['id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_weight_records_id'), table_name='weight_records')
    op.drop_table('weight_records')
    op.drop_index(op.f('ix_cats_name'), table_name='cats')
    op.drop_index(op.f('ix_cats_id'), table_name='cats')
    op.drop_table('cats')