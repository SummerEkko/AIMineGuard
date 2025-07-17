from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base

class Equipment(Base):
    __tablename__ = "equipment"
    
    id = Column(Integer, primary_key=True, index=True)
    mine_id = Column(Integer, ForeignKey("mines.id"), nullable=False)
    name = Column(String(100), nullable=False)
    equipment_type = Column(String(50), nullable=False)  # 设备类型
    model = Column(String(100))  # 设备型号
    serial_number = Column(String(100), unique=True)  # 序列号
    manufacturer = Column(String(100))  # 制造商
    installation_date = Column(DateTime(timezone=True))  # 安装日期
    last_maintenance_date = Column(DateTime(timezone=True))  # 最后维护日期
    next_maintenance_date = Column(DateTime(timezone=True))  # 下次维护日期
    status = Column(String(20), default="operational")  # operational, maintenance, offline, retired
    location = Column(String(200))  # 设备位置
    specifications = Column(Text)  # 设备规格
    operating_hours = Column(Float, default=0)  # 运行小时数
    efficiency_rating = Column(Float)  # 效率评级
    power_consumption = Column(Float)  # 功耗 (kW)
    temperature_threshold = Column(Float)  # 温度阈值
    vibration_threshold = Column(Float)  # 振动阈值
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # 关联关系
    mine = relationship("Mine", back_populates="equipment")
    maintenance_records = relationship("MaintenanceRecord", back_populates="equipment") 