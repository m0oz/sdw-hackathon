import json
import os
import tempfile
from pathlib import Path

DB_PATH = Path(__file__).parent / "data.json"


def load(default=None):
    if not DB_PATH.exists():
        return default if default is not None else {}
    return json.loads(DB_PATH.read_text(encoding="utf-8"))


def save(data):
    # atomic write so a crash never corrupts the file
    fd, tmp = tempfile.mkstemp(dir=DB_PATH.parent, suffix=".tmp")
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    os.replace(tmp, DB_PATH)
