from typing import Optional, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, func, or_
from app.models.environment_data import EnvironmentData
from app.models.monitoring_point import MonitoringPoint
from app.schemas.environment_data import EnvironmentDataCreate, EnvironmentDataUpdate

def get_environment_data(db: Session, data_id: int) -> Optional[EnvironmentData]:
    """根据ID获取环境数据"""
    return db.query(EnvironmentData).filter(EnvironmentData.id == data_id).first()

def get_environment_data_by_monitoring_point(
    db: Session, 
    monitoring_point_id: int, 
    skip: int = 0, 
    limit: int = 100
) -> List[EnvironmentData]:
    """获取指定监控点的环境数据"""
    return db.query(EnvironmentData).filter(
        EnvironmentData.monitoring_point_id == monitoring_point_id
    ).order_by(EnvironmentData.recorded_at.desc()).offset(skip).limit(limit).all()

def get_latest_environment_data(db: Session, monitoring_point_id: int) -> Optional[EnvironmentData]:
    """获取指定监控点的最新环境数据"""
    return db.query(EnvironmentData).filter(
        EnvironmentData.monitoring_point_id == monitoring_point_id
    ).order_by(EnvironmentData.recorded_at.desc()).first()

def get_environment_data_by_mine(
    db: Session, 
    mine_id: int, 
    skip: int = 0, 
    limit: int = 100
) -> List[EnvironmentData]:
    """获取指定煤矿的环境数据"""
    return db.query(EnvironmentData).join(MonitoringPoint).filter(
        MonitoringPoint.mine_id == mine_id
    ).order_by(EnvironmentData.recorded_at.desc()).offset(skip).limit(limit).all()

def get_environment_data_by_time_range(
    db: Session, 
    monitoring_point_id: int, 
    start_time: datetime, 
    end_time: datetime
) -> List[EnvironmentData]:
    """获取指定时间范围内的环境数据"""
    return db.query(EnvironmentData).filter(
        and_(
            EnvironmentData.monitoring_point_id == monitoring_point_id,
            EnvironmentData.recorded_at >= start_time,
            EnvironmentData.recorded_at <= end_time
        )
    ).order_by(EnvironmentData.recorded_at.asc()).all()

def create_environment_data(db: Session, data: EnvironmentDataCreate) -> EnvironmentData:
    """创建新的环境数据"""
    db_data = EnvironmentData(**data.dict())
    db.add(db_data)
    db.commit()
    db.refresh(db_data)
    return db_data

def update_environment_data(db: Session, data_id: int, data_update: EnvironmentDataUpdate) -> Optional[EnvironmentData]:
    """更新环境数据"""
    db_data = get_environment_data(db, data_id)
    if not db_data:
        return None
    
    update_data = data_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_data, field, value)
    
    db.commit()
    db.refresh(db_data)
    return db_data

def delete_environment_data(db: Session, data_id: int) -> bool:
    """删除环境数据"""
    db_data = get_environment_data(db, data_id)
    if not db_data:
        return False
    
    db.delete(db_data)
    db.commit()
    return True

def get_environment_data_statistics(
    db: Session, 
    monitoring_point_id: int, 
    hours: int = 24
) -> dict:
    """获取环境数据统计信息"""
    start_time = datetime.utcnow() - timedelta(hours=hours)
    
    # 获取指定时间范围内的数据
    data_list = get_environment_data_by_time_range(db, monitoring_point_id, start_time, datetime.utcnow())
    
    if not data_list:
        return {}
    
    # 计算统计数据
    stats = {
        "count": len(data_list),
        "time_range": {
            "start": start_time,
            "end": datetime.utcnow()
        }
    }
    
    # 计算各字段的统计信息
    fields = [
        "methane_concentration", "carbon_monoxide", "carbon_dioxide", 
        "oxygen_concentration", "hydrogen_sulfide", "temperature", 
        "humidity", "pressure", "air_flow", "dust_concentration"
    ]
    
    for field in fields:
        values = [getattr(data, field) for data in data_list if getattr(data, field) is not None]
        if values:
            stats[field] = {
                "min": min(values),
                "max": max(values),
                "avg": sum(values) / len(values),
                "count": len(values)
            }
    
    return stats

def get_environment_alerts(db: Session, monitoring_point_id: int) -> List[EnvironmentData]:
    """获取环境异常数据（超过阈值的）"""
    # 这里可以根据具体的阈值来判断异常
    # 例如：甲烷浓度超过1%，温度超过40度等
    return db.query(EnvironmentData).filter(
        and_(
            EnvironmentData.monitoring_point_id == monitoring_point_id,
            or_(
                EnvironmentData.methane_concentration > 1.0,  # 甲烷浓度超过1%
                EnvironmentData.temperature > 40.0,  # 温度超过40度
                EnvironmentData.oxygen_concentration < 19.5,  # 氧气浓度低于19.5%
                EnvironmentData.carbon_monoxide > 50.0  # 一氧化碳超过50ppm
            )
        )
    ).order_by(EnvironmentData.recorded_at.desc()).all()

def get_environment_data_trends(
    db: Session, 
    monitoring_point_id: int, 
    field: str, 
    hours: int = 24
) -> List[dict]:
    """获取环境数据趋势"""
    start_time = datetime.utcnow() - timedelta(hours=hours)
    
    data_list = get_environment_data_by_time_range(db, monitoring_point_id, start_time, datetime.utcnow())
    
    trends = []
    for data in data_list:
        value = getattr(data, field)
        if value is not None:
            trends.append({
                "timestamp": data.recorded_at,
                "value": value
            })
    
    return trends

class CRUDEnvironmentData:
    get_environment_data = staticmethod(get_environment_data)
    get_environment_data_by_monitoring_point = staticmethod(get_environment_data_by_monitoring_point)
    get_latest_environment_data = staticmethod(get_latest_environment_data)
    get_environment_data_by_mine = staticmethod(get_environment_data_by_mine)
    get_environment_data_by_time_range = staticmethod(get_environment_data_by_time_range)
    create_environment_data = staticmethod(create_environment_data)
    update_environment_data = staticmethod(update_environment_data)
    delete_environment_data = staticmethod(delete_environment_data)
    get_environment_data_statistics = staticmethod(get_environment_data_statistics)
    get_environment_alerts = staticmethod(get_environment_alerts)
    get_environment_data_trends = staticmethod(get_environment_data_trends)

crud_environment_data = CRUDEnvironmentData() 