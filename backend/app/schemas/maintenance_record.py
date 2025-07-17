from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class MaintenanceRecordBase(BaseModel):
    equipment_id: int
    maintenance_type: str = Field(..., min_length=1, max_length=50)
    description: str = Field(..., min_length=1)
    performed_by: Optional[str] = Field(None, max_length=100)
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_hours: Optional[float] = Field(None, ge=0)
    cost: Optional[float] = Field(None, ge=0)
    parts_replaced: Optional[str] = None
    findings: Optional[str] = None
    recommendations: Optional[str] = None
    status: str = Field("completed", max_length=20)

class MaintenanceRecordCreate(MaintenanceRecordBase):
    pass

class MaintenanceRecordUpdate(BaseModel):
    maintenance_type: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = Field(None, min_length=1)
    performed_by: Optional[str] = Field(None, max_length=100)
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration_hours: Optional[float] = Field(None, ge=0)
    cost: Optional[float] = Field(None, ge=0)
    parts_replaced: Optional[str] = None
    findings: Optional[str] = None
    recommendations: Optional[str] = None
    status: Optional[str] = Field(None, max_length=20)

class MaintenanceRecord(MaintenanceRecordBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class MaintenanceStatistics(BaseModel):
    total_records: int
    completed_records: int
    in_progress_records: int
    scheduled_records: int
    completion_rate: float
    total_cost: float
    total_duration: float
    average_cost: float
    average_duration: float
    type_statistics: dict 