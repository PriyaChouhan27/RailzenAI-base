from dataclasses import dataclass


@dataclass
class Asset:
    id: str
    asset_type: str
    name: str
    section: str
    status: str