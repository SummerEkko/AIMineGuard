from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base

class Mine(Base):
    __tablename__ = "mines"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    location = Column(String(200))
    depth = Column(Float)  # 井深（米）
    status = Column(String(20), default="active")  # active, inactive, maintenance
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关联关系
    monitoring_points = relationship("MonitoringPoint", back_populates="mine")
    equipment = relationship("Equipment", back_populates="mine") 