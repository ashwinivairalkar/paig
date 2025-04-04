"""Added admin audit tables

Revision ID: dd5bdf787fa1
Revises: f32841395145
Create Date: 2025-03-13 12:46:38.278494

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import core.db_models.utils


# revision identifiers, used by Alembic.
revision: str = 'dd5bdf787fa1'
down_revision: Union[str, None] = 'f32841395145'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('admin_audits',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('acted_by_user_id', sa.Integer(), nullable=True),
    sa.Column('acted_by_user_name', sa.String(length=255), nullable=True),
    sa.Column('action', sa.String(length=255), nullable=True),
    sa.Column('log_id', sa.String(length=255), nullable=True),
    sa.Column('log_time', sa.Double(), nullable=False),
    sa.Column('object_id', sa.Integer(), nullable=True),
    sa.Column('object_name', sa.String(length=255), nullable=True),
    sa.Column('object_type', sa.String(length=255), nullable=True),
    sa.Column('object_state', sa.JSON(), nullable=True),
    sa.Column('object_state_previous', sa.JSON(), nullable=True),
    sa.Column('transaction_id', sa.String(length=255), nullable=True),
    sa.Column('transaction_sequence_number', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_admin_audits_acted_by_user_id'), 'admin_audits', ['acted_by_user_id'], unique=False)
    op.create_index(op.f('ix_admin_audits_acted_by_user_name'), 'admin_audits', ['acted_by_user_name'], unique=False)
    op.create_index(op.f('ix_admin_audits_id'), 'admin_audits', ['id'], unique=False)
    op.create_index(op.f('ix_admin_audits_log_id'), 'admin_audits', ['log_id'], unique=False)
    op.create_index(op.f('ix_admin_audits_log_time'), 'admin_audits', ['log_time'], unique=False)
    op.create_index(op.f('ix_admin_audits_transaction_id'), 'admin_audits', ['transaction_id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_admin_audits_transaction_id'), table_name='admin_audits')
    op.drop_index(op.f('ix_admin_audits_log_time'), table_name='admin_audits')
    op.drop_index(op.f('ix_admin_audits_log_id'), table_name='admin_audits')
    op.drop_index(op.f('ix_admin_audits_id'), table_name='admin_audits')
    op.drop_index(op.f('ix_admin_audits_acted_by_user_name'), table_name='admin_audits')
    op.drop_index(op.f('ix_admin_audits_acted_by_user_id'), table_name='admin_audits')
    op.drop_table('admin_audits')
    # ### end Alembic commands ###
