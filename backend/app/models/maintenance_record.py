from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base

class MaintenanceRecord(Base):
    __tablename__ = "maintenance_records"
    
    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(Integer, ForeignKey("equipment.id"), nullable=False)
    maintenance_type = Column(String(50), nullable=False)  # preventive, corrective, emergency
    description = Column(Text, nullable=False)
    performed_by = Column(String(100))  # 执行人员
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True))
    duration_hours = Column(Float)  # 维护时长（小时）
    cost = Column(Float)  # 维护成本
    parts_replaced = Column(Text)  # 更换的零件
    findings = Column(Text)  # 发现的问题
    recommendations = Column(Text)  # 建议
    status = Column(String(20), default="completed")  # scheduled, in_progress, completed, cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关联关系
    equipment = relationship("Equipment", back_populates="maintenance_records") 