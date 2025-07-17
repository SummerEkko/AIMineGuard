from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class EquipmentBase(BaseModel):
    mine_id: int
    name: str = Field(..., min_length=1, max_length=100)
    equipment_type: str = Field(..., min_length=1, max_length=50)
    model: Optional[str] = Field(None, max_length=100)
    serial_number: Optional[str] = Field(None, max_length=100)
    manufacturer: Optional[str] = Field(None, max_length=100)
    installation_date: Optional[datetime] = None
    last_maintenance_date: Optional[datetime] = None
    next_maintenance_date: Optional[datetime] = None
    status: str = Field("operational", max_length=20)
    location: Optional[str] = Field(None, max_length=200)
    specifications: Optional[str] = None
    operating_hours: float = Field(0, ge=0)
    efficiency_rating: Optional[float] = Field(None, ge=0, le=100)
    power_consumption: Optional[float] = Field(None, ge=0)
    temperature_threshold: Optional[float] = Field(None, ge=0)
    vibration_threshold: Optional[float] = Field(None, ge=0)

class EquipmentCreate(EquipmentBase):
    pass

class EquipmentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    equipment_type: Optional[str] = Field(None, min_length=1, max_length=50)
    model: Optional[str] = Field(None, max_length=100)
    serial_number: Optional[str] = Field(None, max_length=100)
    manufacturer: Optional[str] = Field(None, max_length=100)
    installation_date: Optional[datetime] = None
    last_maintenance_date: Optional[datetime] = None
    next_maintenance_date: Optional[datetime] = None
    status: Optional[str] = Field(None, max_length=20)
    location: Optional[str] = Field(None, max_length=200)
    specifications: Optional[str] = None
    operating_hours: Optional[float] = Field(None, ge=0)
    efficiency_rating: Optional[float] = Field(None, ge=0, le=100)
    power_consumption: Optional[float] = Field(None, ge=0)
    temperature_threshold: Optional[float] = Field(None, ge=0)
    vibration_threshold: Optional[float] = Field(None, ge=0)

class Equipment(EquipmentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class EquipmentStatistics(BaseModel):
    total_equipment: int
    operational_equipment: int
    maintenance_equipment: int
    offline_equipment: int
    operational_rate: float
    average_efficiency: float
    total_operating_hours: float 