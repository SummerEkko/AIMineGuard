from pydantic import BaseModel
from typing import Optional

class MonitoringPointBase(BaseModel):
    name: str
    location: Optional[str] = None
    camera_id: Optional[str] = None
    is_active: bool = True

class MonitoringPointCreate(MonitoringPointBase):
    mine_id: int

class MonitoringPointUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    camera_id: Optional[str] = None
    is_active: Optional[bool] = None

class MonitoringPoint(MonitoringPointBase):
    id: int
    mine_id: int
    created_at: str

    class Config:
        from_attributes = True 