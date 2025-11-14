import os

WORKSPACE_DIR = "workspace"

if not os.path.exists(WORKSPACE_DIR):
    os.makedirs(WORKSPACE_DIR)

def list_files():
    files = []
    for root, dirs, filenames in os.walk(WORKSPACE_DIR):
        for name in filenames:
            rel_dir = os.path.relpath(root, WORKSPACE_DIR)
            if rel_dir == ".":
                rel_dir = ""
            rel_file = os.path.join(rel_dir, name).replace("\\", "/")
            files.append(rel_file)
    return files

def read_file(path):
    full_path = os.path.join(WORKSPACE_DIR, path)
    if not os.path.exists(full_path):
        raise FileNotFoundError(f"File {path} does not exist.")
    with open(full_path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    full_path = os.path.join(WORKSPACE_DIR, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)

def create_file(path):
    full_path = os.path.join(WORKSPACE_DIR, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w') as f:
        pass

def delete_file(path):
    full_path = os.path.join(WORKSPACE_DIR, path)
    if os.path.exists(full_path):
        os.remove(full_path)
