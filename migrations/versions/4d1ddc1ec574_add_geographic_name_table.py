"""add geographic name table

Revision ID: 4d1ddc1ec574
Revises: 36d2a94e6894
Create Date: 2020-11-09 13:45:37.277092

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4d1ddc1ec574'
down_revision = '36d2a94e6894'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('geo_name',
    sa.Column('id', sa.String(length=255), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('type_', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_geo_name_name'), 'geo_name', ['name'], unique=False)
    op.create_index(op.f('ix_geo_name_type_'), 'geo_name', ['type_'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_geo_name_type_'), table_name='geo_name')
    op.drop_index(op.f('ix_geo_name_name'), table_name='geo_name')
    op.drop_table('geo_name')
    # ### end Alembic commands ###