from typing import List
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.database.database import get_db
from app.models.alert import Alert, AlertStatus, AlertSeverity
from app.models.monitoring_point import MonitoringPoint
from app.schemas.alert import Alert as AlertSchema, AlertCreate, AlertUpdate, AlertWithDetails, AlertSummary
from app.core.deps import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[AlertWithDetails])
def get_alerts(
    skip: int = 0,
    limit: int = 100,
    status: AlertStatus = None,
    severity: AlertSeverity = None,
    mine_id: int = None,
    start_date: datetime = None,
    end_date: datetime = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取报警列表"""
    query = db.query(Alert)
    
    # 添加过滤条件
    if status:
        query = query.filter(Alert.status == status)
    if severity:
        query = query.filter(Alert.severity == severity)
    if mine_id:
        query = query.join(MonitoringPoint).filter(MonitoringPoint.mine_id == mine_id)
    if start_date:
        query = query.filter(Alert.detected_at >= start_date)
    if end_date:
        query = query.filter(Alert.detected_at <= end_date)
    
    alerts = query.offset(skip).limit(limit).all()
    return alerts

@router.post("/", response_model=AlertSchema)
def create_alert(
    alert: AlertCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """创建报警"""
    # 检查监控点是否存在
    monitoring_point = db.query(MonitoringPoint).filter(MonitoringPoint.id == alert.monitoring_point_id).first()
    if monitoring_point is None:
        raise HTTPException(status_code=404, detail="Monitoring point not found")
    
    db_alert = Alert(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

@router.get("/{alert_id}", response_model=AlertWithDetails)
def get_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取报警详情"""
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.put("/{alert_id}", response_model=AlertSchema)
def update_alert(
    alert_id: int,
    alert_update: AlertUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """更新报警状态"""
    db_alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if db_alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    update_data = alert_update.dict(exclude_unset=True)
    
    # 处理状态变更的时间戳
    if "status" in update_data:
        if update_data["status"] == AlertStatus.ACKNOWLEDGED and db_alert.status == AlertStatus.ACTIVE:
            update_data["acknowledged_at"] = datetime.utcnow()
            update_data["acknowledged_by"] = current_user.id
        elif update_data["status"] == AlertStatus.RESOLVED:
            update_data["resolved_at"] = datetime.utcnow()
            update_data["resolved_by"] = current_user.id
    
    for field, value in update_data.items():
        setattr(db_alert, field, value)
    
    db.commit()
    db.refresh(db_alert)
    return db_alert

@router.get("/summary/overview", response_model=AlertSummary)
def get_alert_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取报警统计概览"""
    # 总报警数
    total_alerts = db.query(Alert).count()
    
    # 活跃报警数
    active_alerts = db.query(Alert).filter(Alert.status == AlertStatus.ACTIVE).count()
    
    # 紧急报警数
    critical_alerts = db.query(Alert).filter(
        and_(Alert.severity == AlertSeverity.CRITICAL, Alert.status == AlertStatus.ACTIVE)
    ).count()
    
    # 按严重程度统计
    alerts_by_severity = {}
    for severity in AlertSeverity:
        count = db.query(Alert).filter(Alert.severity == severity).count()
        alerts_by_severity[severity.value] = count
    
    # 最近报警（最近24小时）
    recent_alerts = db.query(Alert).filter(
        Alert.detected_at >= datetime.utcnow() - timedelta(hours=24)
    ).order_by(Alert.detected_at.desc()).limit(10).all()
    
    return AlertSummary(
        total_alerts=total_alerts,
        active_alerts=active_alerts,
        critical_alerts=critical_alerts,
        alerts_by_severity=alerts_by_severity,
        recent_alerts=recent_alerts
    )

@router.post("/{alert_id}/acknowledge")
def acknowledge_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """确认报警"""
    db_alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if db_alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    if db_alert.status != AlertStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Alert is not active")
    
    db_alert.status = AlertStatus.ACKNOWLEDGED
    db_alert.acknowledged_at = datetime.utcnow()
    db_alert.acknowledged_by = current_user.id
    
    db.commit()
    return {"message": "Alert acknowledged successfully"}

@router.post("/{alert_id}/resolve")
def resolve_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """解决报警"""
    db_alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if db_alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    if db_alert.status == AlertStatus.RESOLVED:
        raise HTTPException(status_code=400, detail="Alert is already resolved")
    
    db_alert.status = AlertStatus.RESOLVED
    db_alert.resolved_at = datetime.utcnow()
    db_alert.resolved_by = current_user.id
    
    db.commit()
    return {"message": "Alert resolved successfully"} 