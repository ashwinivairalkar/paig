import os

# Function to normalize file paths
def normalize_path(path):
    if path:
        return os.path.normpath(path).replace('\\', '/')  # Convert to YAML-friendly format
    return path
