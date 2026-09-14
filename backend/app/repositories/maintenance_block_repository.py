from backend.app.database import get_connection


def _format_maintenance_block(row):
    """Convert a database row into the existing API format."""

    block = dict(row)

    return {
        "id": block["id"],
        "section": block["section"],
        "startTime": block["start_time"],
        "endTime": block["end_time"],
        "blockType": block["block_type"],
        "status": block["status"],
    }


def get_all_maintenance_blocks():
    """Return all maintenance blocks from the database."""

    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT
                maintenance_blocks.id,
                sections.name AS section,
                maintenance_blocks.start_time,
                maintenance_blocks.end_time,
                maintenance_blocks.block_type,
                maintenance_blocks.status
            FROM maintenance_blocks
            LEFT JOIN sections
                ON maintenance_blocks.section_id = sections.id
            ORDER BY maintenance_blocks.start_time
            """
        ).fetchall()

    return [_format_maintenance_block(row) for row in rows]


def get_maintenance_block_by_id(block_id: str):
    """Return a maintenance block by ID."""

    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT
                maintenance_blocks.id,
                sections.name AS section,
                maintenance_blocks.start_time,
                maintenance_blocks.end_time,
                maintenance_blocks.block_type,
                maintenance_blocks.status
            FROM maintenance_blocks
            LEFT JOIN sections
                ON maintenance_blocks.section_id = sections.id
            WHERE maintenance_blocks.id = ?
            """,
            (block_id,),
        ).fetchone()

    return _format_maintenance_block(row) if row else None


def create_maintenance_block(
    block_id,
    section_id,
    start_time,
    end_time,
    block_type,
    status,
):
    """Create a new maintenance block."""

    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO maintenance_blocks (
                id,
                section_id,
                start_time,
                end_time,
                block_type,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                block_id,
                section_id,
                start_time,
                end_time,
                block_type,
                status,
            ),
        )

        row = connection.execute(
            """
            SELECT
                maintenance_blocks.id,
                sections.name AS section,
                maintenance_blocks.start_time,
                maintenance_blocks.end_time,
                maintenance_blocks.block_type,
                maintenance_blocks.status
            FROM maintenance_blocks
            LEFT JOIN sections
                ON maintenance_blocks.section_id = sections.id
            WHERE maintenance_blocks.id = ?
            """,
            (block_id,),
        ).fetchone()

    return _format_maintenance_block(row)