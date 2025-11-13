from typing import Any
from datetime import datetime, timezone

def ensure_datetime(value: Any) -> datetime:
    """Safely convert Firestore timestamps or strings to Python datetime."""
    if isinstance(value, datetime):
        return value
    if hasattr(value, "to_pydatetime"):  # Firestore Timestamp
        return value.to_pydatetime()
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value)
        except ValueError:
            return datetime.fromisoformat(value.replace("Z", "+00:00"))
    raise TypeError(f"Unsupported datetime format: {type(value)}")
