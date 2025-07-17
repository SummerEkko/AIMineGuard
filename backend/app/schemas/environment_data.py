from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class EnvironmentDataBase(BaseModel):
    monitoring_point_id: int
    methane_concentration: Optional[float] = Field(None, ge=0, le=100)
    carbon_monoxide: Optional[float] = Field(None, ge=0)
    carbon_dioxide: Optional[float] = Field(None, ge=0)
    oxygen_concentration: Optional[float] = Field(None, ge=0, le=100)
    hydrogen_sulfide: Optional[float] = Field(None, ge=0)
    temperature: Optional[float] = Field(None, ge=-50, le=100)
    humidity: Optional[float] = Field(None, ge=0, le=100)
    pressure: Optional[float] = Field(None, ge=0)
    air_flow: Optional[float] = Field(None, ge=0)
    dust_concentration: Optional[float] = Field(None, ge=0)
    ventilation_status: Optional[bool] = None
    emergency_system_status: Optional[bool] = None

class EnvironmentDataCreate(EnvironmentDataBase):
    pass

class EnvironmentDataUpdate(BaseModel):
    methane_concentration: Optional[float] = Field(None, ge=0, le=100)
    carbon_monoxide: Optional[float] = Field(None, ge=0)
    carbon_dioxide: Optional[float] = Field(None, ge=0)
    oxygen_concentration: Optional[float] = Field(None, ge=0, le=100)
    hydrogen_sulfide: Optional[float] = Field(None, ge=0)
    temperature: Optional[float] = Field(None, ge=-50, le=100)
    humidity: Optional[float] = Field(None, ge=0, le=100)
    pressure: Optional[float] = Field(None, ge=0)
    air_flow: Optional[float] = Field(None, ge=0)
    dust_concentration: Optional[float] = Field(None, ge=0)
    ventilation_status: Optional[bool] = None
    emergency_system_status: Optional[bool] = None

class EnvironmentData(EnvironmentDataBase):
    id: int
    recorded_at: datetime

    class Config:
        from_attributes = True

class EnvironmentStatistics(BaseModel):
    count: int
    time_range: dict
    methane_concentration: Optional[dict] = None
    carbon_monoxide: Optional[dict] = None
    carbon_dioxide: Optional[dict] = None
    oxygen_concentration: Optional[dict] = None
    hydrogen_sulfide: Optional[dict] = None
    temperature: Optional[dict] = None
    humidity: Optional[dict] = None
    pressure: Optional[dict] = None
    air_flow: Optional[dict] = None
    dust_concentration: Optional[dict] = None

class EnvironmentTrends(BaseModel):
    monitoring_point_id: int
    field: str
    hours: int
    data_points: int
    trends: list 