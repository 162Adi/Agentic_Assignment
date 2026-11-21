from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS
from app.database.db import init_db
from app.api.router_health import router as health_router
from app.api.router_labs import router as labs_router
from app.api.router_executions import router as executions_router
from app.api.router_tools import router as tools_router
from app.api.router_skills import router as skills_router
from app.api.router_memory import router as memory_router
from app.api.router_evaluations import router as evaluations_router
from app.api.router_architecture import router as architecture_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database on startup
    await init_db()
    yield

app = FastAPI(
    title="Agentic AI Command Center API",
    description="Backend orchestration, process management, and telemetry for the 14 Agentic AI Labs",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routers under /api prefix
app.include_router(health_router, prefix="/api")
app.include_router(labs_router, prefix="/api")
app.include_router(executions_router, prefix="/api")
app.include_router(tools_router, prefix="/api")
app.include_router(skills_router, prefix="/api")
app.include_router(memory_router, prefix="/api")
app.include_router(evaluations_router, prefix="/api")
app.include_router(architecture_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "name": "Agentic AI Command Center",
        "tagline": "Explore. Orchestrate. Execute. Observe.",
        "status": "online",
        "docs_url": "/docs",
        "api_prefix": "/api"
    }
