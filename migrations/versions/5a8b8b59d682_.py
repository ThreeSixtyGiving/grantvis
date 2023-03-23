"""empty message

Revision ID: 5a8b8b59d682
Revises: 2d4ac4832cba
Create Date: 2023-03-22 12:23:25.313328

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5a8b8b59d682'
down_revision = '2d4ac4832cba'
branch_labels = None
depends_on = None


def upgrade():
    # Manually added server_default to allow upgrading of existing db and not
    # have a null integrity error 

    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('grant', sa.Column('insights_grant_type',
                                     sa.String(length=255), nullable=False,
                                     server_default="Direct grant"))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('grant', 'insights_grant_type')
    # ### end Alembic commands ###
