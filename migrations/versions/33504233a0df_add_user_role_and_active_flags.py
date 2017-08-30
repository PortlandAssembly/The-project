"""Add user role and active flags

Revision ID: 33504233a0df
Revises: d2e661b6ac65
Create Date: 2017-08-29 19:45:47.083664

"""

# revision identifiers, used by Alembic.
revision = '33504233a0df'
down_revision = 'd2e661b6ac65'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('message', 'author',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.add_column('user', sa.Column('active', sa.Boolean(), nullable=True))
    op.add_column('user', sa.Column('role', sa.Enum('responder', 'verifier', 'admin', name='role'), nullable=True))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'role')
    op.drop_column('user', 'active')
    op.alter_column('message', 'author',
               existing_type=sa.INTEGER(),
               nullable=True)
    ### end Alembic commands ###