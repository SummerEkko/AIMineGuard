import os
from typing import Any, Dict, Optional, List, Union
from pydantic_settings import BaseSettings
from pydantic import validator, PostgresDsn, AnyHttpUrl

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # 数据库配置
    DATABASE_URL: Optional[str] = None
    SQLALCHEMY_DATABASE_URI: Optional[PostgresDsn] = None
    
    @validator("SQLALCHEMY_DATABASE_URI", pre=True, always=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if v is not None:
            return v
        if values.get("DATABASE_URL"):
            return values["DATABASE_URL"]
        return None

    # CORS配置
    BACKEND_CORS_ORIGINS: List[Union[str, AnyHttpUrl]] = ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"]

    # 项目信息
    PROJECT_NAME: str = "AI Mine Guard"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "AI-based dangerous action recognition alarm system for coal mining"

    DEBUG: bool = False

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings() 