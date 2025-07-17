from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base

class EnvironmentData(Base):
    __tablename__ = "environment_data"
    
    id = Column(Integer, primary_key=True, index=True)
    monitoring_point_id = Column(Integer, ForeignKey("monitoring_points.id"), nullable=False)
    
    # 环境参数
    methane_concentration = Column(Float)  # 甲烷浓度（%）
    carbon_monoxide = Column(Float)  # 一氧化碳浓度（ppm）
    temperature = Column(Float)  # 温度（摄氏度）
    humidity = Column(Float)  # 湿度（%）
    pressure = Column(Float)  # 气压（Pa）
    oxygen_level = Column(Float)  # 氧气浓度（%）
    
    # 时间戳
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关联关系
    monitoring_point = relationship("MonitoringPoint", back_populates="environment_data") 