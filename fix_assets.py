from backend.app.database import get_connection


def update_database():
    """Add section relationship to maintenance requests."""

    with get_connection() as connection:
        columns = connection.execute(
            """
            PRAGMA table_info(maintenance_requests)
            """
        ).fetchall()

        column_names = [column["name"] for column in columns]

        if "section_id" not in column_names:
            connection.execute(
                """
                ALTER TABLE maintenance_requests
                ADD COLUMN section_id INTEGER
                """
            )
            print("section_id column added successfully.")
        else:
            print("section_id column already exists.")


if __name__ == "__main__":
    update_database()
