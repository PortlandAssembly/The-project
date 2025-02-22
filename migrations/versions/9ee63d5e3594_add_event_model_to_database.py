"""Add Event model to database

Revision ID: 9ee63d5e3594
Revises: 8ee732cfaa38
Create Date: 2017-08-23 18:18:01.757599

"""

# revision identifiers, used by Alembic.
revision = '9ee63d5e3594'
down_revision = '8ee732cfaa38'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.create_table('event',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=255), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('verified', sa.Boolean(), nullable=True),
    sa.Column('active', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('event')
    ### end Alembic commands ###
