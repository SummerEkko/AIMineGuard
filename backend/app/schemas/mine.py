from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# 煤矿相关schemas
class MineBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    location: Optional[str] = Field(None, max_length=200)
    depth: Optional[float] = Field(None, ge=0)
    status: str = Field("active", max_length=20)

class MineCreate(MineBase):
    pass

class MineUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    location: Optional[str] = Field(None, max_length=200)
    depth: Optional[float] = Field(None, ge=0)
    status: Optional[str] = Field(None, max_length=20)

class Mine(MineBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# 监控点相关schemas
class MonitoringPointBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    location: Optional[str] = Field(None, max_length=200)
    camera_id: Optional[str] = Field(None, max_length=50)
    is_active: bool = True

class MonitoringPointCreate(MonitoringPointBase):
    mine_id: int

class MonitoringPointUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    location: Optional[str] = Field(None, max_length=200)
    camera_id: Optional[str] = Field(None, max_length=50)
    is_active: Optional[bool] = None

class MonitoringPoint(MonitoringPointBase):
    id: int
    mine_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# 包含关联数据的schemas
class MineWithMonitoringPoints(Mine):
    monitoring_points: List[MonitoringPoint] = []

class MineWithPoints(Mine):
    monitoring_points: List[MonitoringPoint] = []

class MonitoringPointWithMine(MonitoringPoint):
    mine: Mine 