from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base
import enum

class AlertStatus(str, enum.Enum):
    ACTIVE = "active"
    ACKNOWLEDGED = "acknowledged"
    RESOLVED = "resolved"
    FALSE_ALARM = "false_alarm"

class AlertSeverity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AlertType(str, enum.Enum):
    DANGEROUS_ACTION = "dangerous_action"
    EQUIPMENT_FAILURE = "equipment_failure"
    ENVIRONMENTAL_HAZARD = "environmental_hazard"
    SAFETY_VIOLATION = "safety_violation"
    SYSTEM_ERROR = "system_error"

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    monitoring_point_id = Column(Integer, ForeignKey("monitoring_points.id"), nullable=False)
    alert_type = Column(Enum(AlertType), nullable=False)
    severity = Column(Enum(AlertSeverity), nullable=False)
    status = Column(Enum(AlertStatus), default=AlertStatus.ACTIVE)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    detected_at = Column(DateTime(timezone=True), server_default=func.now())
    acknowledged_at = Column(DateTime(timezone=True))
    acknowledged_by = Column(Integer, ForeignKey("users.id"))
    resolved_at = Column(DateTime(timezone=True))
    resolved_by = Column(Integer, ForeignKey("users.id"))
    confidence_score = Column(Float)  # AI检测置信度
    image_url = Column(String(500))  # 报警图片URL
    video_url = Column(String(500))  # 报警视频URL
    location_details = Column(String(200))  # 具体位置信息
    equipment_id = Column(String(100))  # 相关设备ID
    notes = Column(Text)  # 处理备注
    
    # 关联关系
    monitoring_point = relationship("MonitoringPoint", back_populates="alerts")
    acknowledged_by_user = relationship("User", foreign_keys=[acknowledged_by], back_populates="acknowledged_alerts")
    resolved_by_user = relationship("User", foreign_keys=[resolved_by], back_populates="resolved_alerts") 