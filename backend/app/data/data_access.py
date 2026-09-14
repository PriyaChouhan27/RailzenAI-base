import json
from pathlib import Path


DATA_DIR = Path(__file__).parent


def _load_json(filename: str):
    file_path = DATA_DIR / filename

    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


def get_trains():
    return _load_json("trains.json")


def get_sections():
    return _load_json("sections.json")


def get_maintenance_requests():
    return _load_json("maintenance_requests.json")


def get_maintenance_blocks():
    return _load_json("maintenance_blocks.json")