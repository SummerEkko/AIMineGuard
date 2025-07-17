from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base

class EnvironmentData(Base):
    __tablename__ = "environment_data"
    
    id = Column(Integer, primary_key=True, index=True)
    monitoring_point_id = Column(Integer, ForeignKey("monitoring_points.id"), nullable=False)
    
    # 气体浓度
    methane_concentration = Column(Float)  # 甲烷浓度 (%)
    carbon_monoxide = Column(Float)  # 一氧化碳浓度 (ppm)
    carbon_dioxide = Column(Float)  # 二氧化碳浓度 (ppm)
    oxygen_concentration = Column(Float)  # 氧气浓度 (%)
    hydrogen_sulfide = Column(Float)  # 硫化氢浓度 (ppm)
    
    # 环境参数
    temperature = Column(Float)  # 温度 (°C)
    humidity = Column(Float)  # 湿度 (%)
    pressure = Column(Float)  # 气压 (hPa)
    air_flow = Column(Float)  # 风速 (m/s)
    dust_concentration = Column(Float)  # 粉尘浓度 (mg/m³)
    
    # 设备状态
    ventilation_status = Column(Boolean)  # 通风系统状态
    emergency_system_status = Column(Boolean)  # 应急系统状态
    
    # 时间戳
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 关联关系
    monitoring_point = relationship("MonitoringPoint", back_populates="environment_data") 