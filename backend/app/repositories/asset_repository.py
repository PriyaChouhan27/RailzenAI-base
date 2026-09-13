
from backend.app.database import get_connection


def get_all_assets():
    """Return all railway assets from the database."""

    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT
                assets.id,
                assets.asset_type,
                assets.name,
                sections.name AS section,
                assets.status,
                assets.criticality
            FROM assets
            LEFT JOIN sections
                ON assets.section_id = sections.id
            ORDER BY assets.id
            """
        ).fetchall()

    return [dict(row) for row in rows]


def get_asset_by_id(asset_id: str):
    """Return an asset by its ID."""

    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT
                assets.id,
                assets.asset_type,
                assets.name,
                sections.name AS section,
                assets.status,
                assets.criticality
            FROM assets
            LEFT JOIN sections
                ON assets.section_id = sections.id
            WHERE assets.id = ?
            """,
            (asset_id,),
        ).fetchone()

    return dict(row) if row else None


def create_asset(
    asset_id: str,
    asset_type: str,
    name: str,
    section_id: int | None,
    status: str,
    criticality: int = 3,
):
    """Create an asset and return the stored record."""

    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO assets (
                id,
                asset_type,
                name,
                section_id,
                status,
                criticality
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                asset_id,
                asset_type,
                name,
                section_id,
                status,
                criticality,
            ),
        )

        row = connection.execute(
            """
            SELECT
                assets.id,
                assets.asset_type,
                assets.name,
                sections.name AS section,
                assets.status,
                assets.criticality
            FROM assets
            LEFT JOIN sections
                ON assets.section_id = sections.id
            WHERE assets.id = ?
            """,
            (asset_id,),
        ).fetchone()

    return dict(row)

