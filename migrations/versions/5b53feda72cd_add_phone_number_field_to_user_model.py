"""Add phone number field to user model

Revision ID: 5b53feda72cd
Revises: 2ab82d566107
Create Date: 2017-08-08 16:23:13.837415

"""

# revision identifiers, used by Alembic.
revision = '5b53feda72cd'
down_revision = '2ab82d566107'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('phone', sa.String(length=15), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'phone')
    ### end Alembic commands ###
