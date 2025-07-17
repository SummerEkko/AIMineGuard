from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base

class MonitoringPoint(Base):
    __tablename__ = "monitoring_points"

    id = Column(Integer, primary_key=True, index=True)
    mine_id = Column(Integer, ForeignKey("mines.id"), nullable=False)
    name = Column(String(100), nullable=False)
    location = Column(String(200))
    camera_id = Column(String(50))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # 关系
    mine = relationship("Mine", back_populates="monitoring_points")
    environment_data = relationship("EnvironmentData", back_populates="monitoring_point")
    alerts = relationship("Alert", back_populates="monitoring_point") 