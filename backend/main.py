from fastapi import FastAPI, WebSocket, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict, Optional
import subprocess
import tempfile
import os
import uuid
import json
import asyncio
from auth import get_current_user, create_access_token, hash_password
from models import User, SessionLocal, engine
from ai_assistant import get_ai_response
from file_manager import list_files, read_file, write_file, create_file, delete_file

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Монтируем статические файлы фронтенда
app.mount("/static", StaticFiles(directory="frontend/dist"), name="static")

class ExecuteRequest(BaseModel):
    code: str
    filename: str = "main.py"

class AIRequest(BaseModel):
    message: str

class FileRequest(BaseModel):
    path: str
    content: Optional[str] = None

@app.get("/")
async def read_root():
    return {"message": "Python Editor Backend is running!"}

@app.get("/files")
async def get_files():
    return {"files": list_files()}

@app.post("/files")
async def handle_file(req: FileRequest):
    if req.content is not None:
        write_file(req.path, req.content)
        return {"message": f"File {req.path} saved"}
    else:
        content = read_file(req.path)
        return {"content": content}

@app.delete("/files")
async def remove_file(req: FileRequest):
    delete_file(req.path)
    return {"message": f"File {req.path} deleted"}

@app.post("/execute")
async def execute_code(req: ExecuteRequest):
    code = req.code
    filename = req.filename

    with tempfile.TemporaryDirectory() as tmpdirname:
        temp_file = os.path.join(tmpdirname, filename)
        with open(temp_file, 'w', encoding='utf-8') as f:
            f.write(code)

        # Запускаем код
        try:
            result = subprocess.run(
                ["python", temp_file],
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

@app.post("/ai/chat")
async def ai_chat(req: AIRequest):
    response = await get_ai_response(req.message)
    return {"response": response}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Echo: {data}")
    except:
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
