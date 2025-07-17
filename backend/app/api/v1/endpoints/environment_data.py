from typing import List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.environment_data import EnvironmentData
from app.models.monitoring_point import MonitoringPoint
from app.schemas.environment_data import EnvironmentData as EnvironmentDataSchema, EnvironmentDataCreate, EnvironmentDataUpdate
from app.crud import environment_data as crud_environment_data
from app.core.deps import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[EnvironmentDataSchema])
def get_environment_data(
    skip: int = 0,
    limit: int = 100,
    monitoring_point_id: Optional[int] = None,
    mine_id: Optional[int] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取环境数据列表"""
    if monitoring_point_id:
        data = crud_environment_data.get_environment_data_by_monitoring_point(
            db, monitoring_point_id, skip, limit
        )
    elif mine_id:
        data = crud_environment_data.get_environment_data_by_mine(db, mine_id, skip, limit)
    elif start_time and end_time:
        if monitoring_point_id:
            data = crud_environment_data.get_environment_data_by_time_range(
                db, monitoring_point_id, start_time, end_time
            )
        else:
            raise HTTPException(status_code=400, detail="monitoring_point_id is required for time range queries")
    else:
        raise HTTPException(status_code=400, detail="Please provide monitoring_point_id, mine_id, or time range")
    
    return data

@router.get("/latest/{monitoring_point_id}", response_model=EnvironmentDataSchema)
def get_latest_environment_data(
    monitoring_point_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取指定监控点的最新环境数据"""
    data = crud_environment_data.get_latest_environment_data(db, monitoring_point_id)
    if not data:
        raise HTTPException(status_code=404, detail="No environment data found")
    return data

@router.post("/", response_model=EnvironmentDataSchema)
def create_environment_data(
    data: EnvironmentDataCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """创建新的环境数据"""
    # 检查监控点是否存在
    monitoring_point = db.query(MonitoringPoint).filter(MonitoringPoint.id == data.monitoring_point_id).first()
    if not monitoring_point:
        raise HTTPException(status_code=404, detail="Monitoring point not found")
    
    return crud_environment_data.create_environment_data(db, data)

@router.get("/{data_id}", response_model=EnvironmentDataSchema)
def get_environment_data_by_id(
    data_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """根据ID获取环境数据"""
    data = crud_environment_data.get_environment_data(db, data_id)
    if not data:
        raise HTTPException(status_code=404, detail="Environment data not found")
    return data

@router.put("/{data_id}", response_model=EnvironmentDataSchema)
def update_environment_data(
    data_id: int,
    data_update: EnvironmentDataUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """更新环境数据"""
    data = crud_environment_data.update_environment_data(db, data_id, data_update)
    if not data:
        raise HTTPException(status_code=404, detail="Environment data not found")
    return data

@router.delete("/{data_id}")
def delete_environment_data(
    data_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """删除环境数据"""
    success = crud_environment_data.delete_environment_data(db, data_id)
    if not success:
        raise HTTPException(status_code=404, detail="Environment data not found")
    return {"message": "Environment data deleted successfully"}

@router.get("/statistics/{monitoring_point_id}")
def get_environment_statistics(
    monitoring_point_id: int,
    hours: int = Query(24, ge=1, le=168),  # 1小时到7天
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取环境数据统计信息"""
    # 检查监控点是否存在
    monitoring_point = db.query(MonitoringPoint).filter(MonitoringPoint.id == monitoring_point_id).first()
    if not monitoring_point:
        raise HTTPException(status_code=404, detail="Monitoring point not found")
    
    stats = crud_environment_data.get_environment_data_statistics(db, monitoring_point_id, hours)
    return stats

@router.get("/alerts/{monitoring_point_id}", response_model=List[EnvironmentDataSchema])
def get_environment_alerts(
    monitoring_point_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取环境异常数据"""
    # 检查监控点是否存在
    monitoring_point = db.query(MonitoringPoint).filter(MonitoringPoint.id == monitoring_point_id).first()
    if not monitoring_point:
        raise HTTPException(status_code=404, detail="Monitoring point not found")
    
    alerts = crud_environment_data.get_environment_alerts(db, monitoring_point_id)
    return alerts

@router.get("/trends/{monitoring_point_id}")
def get_environment_trends(
    monitoring_point_id: int,
    field: str = Query(..., description="Field name to get trends for"),
    hours: int = Query(24, ge=1, le=168),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取环境数据趋势"""
    # 检查监控点是否存在
    monitoring_point = db.query(MonitoringPoint).filter(MonitoringPoint.id == monitoring_point_id).first()
    if not monitoring_point:
        raise HTTPException(status_code=404, detail="Monitoring point not found")
    
    # 检查字段是否有效
    valid_fields = [
        "methane_concentration", "carbon_monoxide", "carbon_dioxide", 
        "oxygen_concentration", "hydrogen_sulfide", "temperature", 
        "humidity", "pressure", "air_flow", "dust_concentration"
    ]
    if field not in valid_fields:
        raise HTTPException(status_code=400, detail=f"Invalid field. Must be one of: {valid_fields}")
    
    trends = crud_environment_data.get_environment_data_trends(db, monitoring_point_id, field, hours)
    return {
        "monitoring_point_id": monitoring_point_id,
        "field": field,
        "hours": hours,
        "data_points": len(trends),
        "trends": trends
    }

@router.get("/summary/mine/{mine_id}")
def get_mine_environment_summary(
    mine_id: int,
    hours: int = Query(24, ge=1, le=168),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取煤矿环境数据汇总"""
    # 获取煤矿的所有监控点
    monitoring_points = db.query(MonitoringPoint).filter(MonitoringPoint.mine_id == mine_id).all()
    if not monitoring_points:
        raise HTTPException(status_code=404, detail="No monitoring points found for this mine")
    
    summary = {
        "mine_id": mine_id,
        "monitoring_points_count": len(monitoring_points),
        "time_range_hours": hours,
        "monitoring_points": []
    }
    
    for point in monitoring_points:
        stats = crud_environment_data.get_environment_data_statistics(db, point.id, hours)
        summary["monitoring_points"].append({
            "monitoring_point_id": point.id,
            "name": point.name,
            "location": point.location,
            "statistics": stats
        })
    
    return summary 