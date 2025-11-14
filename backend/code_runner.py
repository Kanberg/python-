import subprocess
import tempfile
import os
import sys

def run_python_code(code: str) -> dict:
    with tempfile.TemporaryDirectory() as tmpdirname:
        temp_file = os.path.join(tmpdirname, "main.py")
        with open(temp_file, 'w', encoding='utf-8') as f:
            f.write(code)

        try:
            result = subprocess.run(
                [sys.executable, temp_file],
                cwd=tmpdirname,
                capture_output=True,
                text=True,
                timeout=15
            )
            output = result.stdout
            error = result.stderr
        except subprocess.TimeoutExpired:
            output = ""
            error = "Timeout: Code took too long to execute."
        except Exception as e:
            output = ""
            error = f"Error: {str(e)}"

    return {"output": output, "error": error}
