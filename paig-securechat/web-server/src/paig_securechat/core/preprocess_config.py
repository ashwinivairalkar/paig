import os

def normalize_path(path: str) -> str:
    """Convert file paths to be OS-compatible by correcting slashes."""
    if path:
        return os.path.normpath(path).replace("\\", "/")  # Convert to YAML-friendly format
    return path
