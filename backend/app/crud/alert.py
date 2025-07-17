from typing import Optional, List, Dict
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from app.models.alert import Alert, AlertStatus, AlertSeverity, AlertType
from app.models.monitoring_point import MonitoringPoint
from app.schemas.alert import AlertCreate, AlertUpdate

def get_alert(db: Session, alert_id: int) -> Optional[Alert]:
    """根据ID获取报警"""
    return db.query(Alert).filter(Alert.id == alert_id).first()

def get_alerts(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    status: AlertStatus = None,
    severity: AlertSeverity = None,
    mine_id: int = None,
    start_date: datetime = None,
    end_date: datetime = None
) -> List[Alert]:
    """获取报警列表，支持多种过滤条件"""
    query = db.query(Alert)
    
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
    
    return query.offset(skip).limit(limit).all()

def get_active_alerts(db: Session, mine_id: int = None) -> List[Alert]:
    """获取活跃报警"""
    query = db.query(Alert).filter(Alert.status == AlertStatus.ACTIVE)
    if mine_id:
        query = query.join(MonitoringPoint).filter(MonitoringPoint.mine_id == mine_id)
    return query.all()

def get_critical_alerts(db: Session, mine_id: int = None) -> List[Alert]:
    """获取紧急报警"""
    query = db.query(Alert).filter(
        and_(Alert.severity == AlertSeverity.CRITICAL, Alert.status == AlertStatus.ACTIVE)
    )
    if mine_id:
        query = query.join(MonitoringPoint).filter(MonitoringPoint.mine_id == mine_id)
    return query.all()

def create_alert(db: Session, alert: AlertCreate) -> Alert:
    """创建新报警"""
    db_alert = Alert(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

def update_alert(db: Session, alert_id: int, alert_update: AlertUpdate) -> Optional[Alert]:
    """更新报警信息"""
    db_alert = get_alert(db, alert_id)
    if not db_alert:
        return None
    
    update_data = alert_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_alert, field, value)
    
    db.commit()
    db.refresh(db_alert)
    return db_alert

def acknowledge_alert(db: Session, alert_id: int, user_id: int) -> Optional[Alert]:
    """确认报警"""
    db_alert = get_alert(db, alert_id)
    if not db_alert or db_alert.status != AlertStatus.ACTIVE:
        return None
    
    db_alert.status = AlertStatus.ACKNOWLEDGED
    db_alert.acknowledged_at = datetime.utcnow()
    db_alert.acknowledged_by = user_id
    
    db.commit()
    db.refresh(db_alert)
    return db_alert

def resolve_alert(db: Session, alert_id: int, user_id: int) -> Optional[Alert]:
    """解决报警"""
    db_alert = get_alert(db, alert_id)
    if not db_alert or db_alert.status == AlertStatus.RESOLVED:
        return None
    
    db_alert.status = AlertStatus.RESOLVED
    db_alert.resolved_at = datetime.utcnow()
    db_alert.resolved_by = user_id
    
    db.commit()
    db.refresh(db_alert)
    return db_alert

def get_alert_summary(db: Session, mine_id: int = None) -> Dict:
    """获取报警统计概览"""
    query = db.query(Alert)
    if mine_id:
        query = query.join(MonitoringPoint).filter(MonitoringPoint.mine_id == mine_id)
    
    total_alerts = query.count()
    active_alerts = query.filter(Alert.status == AlertStatus.ACTIVE).count()
    critical_alerts = query.filter(
        and_(Alert.severity == AlertSeverity.CRITICAL, Alert.status == AlertStatus.ACTIVE)
    ).count()
    
    # 按严重程度统计
    alerts_by_severity = {}
    for severity in AlertSeverity:
        count = query.filter(Alert.severity == severity).count()
        alerts_by_severity[severity.value] = count
    
    # 最近报警（最近24小时）
    recent_alerts = query.filter(
        Alert.detected_at >= datetime.utcnow() - timedelta(hours=24)
    ).order_by(Alert.detected_at.desc()).limit(10).all()
    
    return {
        "total_alerts": total_alerts,
        "active_alerts": active_alerts,
        "critical_alerts": critical_alerts,
        "alerts_by_severity": alerts_by_severity,
        "recent_alerts": recent_alerts
    }

def get_alerts_by_monitoring_point(db: Session, monitoring_point_id: int, skip: int = 0, limit: int = 100) -> List[Alert]:
    """获取指定监控点的报警"""
    return db.query(Alert).filter(
        Alert.monitoring_point_id == monitoring_point_id
    ).order_by(Alert.detected_at.desc()).offset(skip).limit(limit).all()

def get_alerts_by_type(db: Session, alert_type: AlertType, skip: int = 0, limit: int = 100) -> List[Alert]:
    """根据报警类型获取报警"""
    return db.query(Alert).filter(
        Alert.alert_type == alert_type
    ).order_by(Alert.detected_at.desc()).offset(skip).limit(limit).all()

def delete_alert(db: Session, alert_id: int) -> bool:
    """删除报警"""
    db_alert = get_alert(db, alert_id)
    if not db_alert:
        return False
    
    db.delete(db_alert)
    db.commit()
    return True

class CRUDAlert:
    get_alert = staticmethod(get_alert)
    get_alerts = staticmethod(get_alerts)
    get_active_alerts = staticmethod(get_active_alerts)
    get_critical_alerts = staticmethod(get_critical_alerts)
    create_alert = staticmethod(create_alert)
    update_alert = staticmethod(update_alert)
    acknowledge_alert = staticmethod(acknowledge_alert)
    resolve_alert = staticmethod(resolve_alert)
    get_alert_summary = staticmethod(get_alert_summary)
    get_alerts_by_monitoring_point = staticmethod(get_alerts_by_monitoring_point)
    get_alerts_by_type = staticmethod(get_alerts_by_type)
    delete_alert = staticmethod(delete_alert)

crud_alert = CRUDAlert() 