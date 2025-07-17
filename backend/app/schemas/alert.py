from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
from app.models.alert import AlertStatus, AlertSeverity, AlertType

class AlertBase(BaseModel):
    monitoring_point_id: int
    alert_type: AlertType
    severity: AlertSeverity
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    confidence_score: Optional[float] = Field(None, ge=0, le=1)
    image_url: Optional[str] = Field(None, max_length=500)
    video_url: Optional[str] = Field(None, max_length=500)
    location_details: Optional[str] = Field(None, max_length=200)
    equipment_id: Optional[str] = Field(None, max_length=100)
    notes: Optional[str] = None

class AlertCreate(AlertBase):
    pass

class AlertUpdate(BaseModel):
    status: Optional[AlertStatus] = None
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    notes: Optional[str] = None
    image_url: Optional[str] = Field(None, max_length=500)
    video_url: Optional[str] = Field(None, max_length=500)

class Alert(AlertBase):
    id: int
    status: AlertStatus
    detected_at: datetime
    acknowledged_at: Optional[datetime] = None
    acknowledged_by: Optional[int] = None
    resolved_at: Optional[datetime] = None
    resolved_by: Optional[int] = None

    class Config:
        from_attributes = True

class AlertWithDetails(Alert):
    monitoring_point: Optional[dict] = None
    acknowledged_by_user: Optional[dict] = None
    resolved_by_user: Optional[dict] = None

class AlertSummary(BaseModel):
    total_alerts: int
    active_alerts: int
    critical_alerts: int
    alerts_by_severity: Dict[str, int]
    recent_alerts: List[Alert]

    class Config:
        from_attributes = True 