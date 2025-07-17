from typing import Optional, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from app.models.maintenance_record import MaintenanceRecord
from app.models.equipment import Equipment
from app.schemas.maintenance_record import MaintenanceRecordCreate, MaintenanceRecordUpdate

def get_maintenance_record(db: Session, record_id: int) -> Optional[MaintenanceRecord]:
    """根据ID获取维护记录"""
    return db.query(MaintenanceRecord).filter(MaintenanceRecord.id == record_id).first()

def get_maintenance_records_by_equipment(
    db: Session, 
    equipment_id: int, 
    skip: int = 0, 
    limit: int = 100
) -> List[MaintenanceRecord]:
    """获取指定设备的维护记录"""
    return db.query(MaintenanceRecord).filter(
        MaintenanceRecord.equipment_id == equipment_id
    ).order_by(MaintenanceRecord.start_time.desc()).offset(skip).limit(limit).all()

def get_maintenance_records_by_type(
    db: Session, 
    maintenance_type: str, 
    skip: int = 0, 
    limit: int = 100
) -> List[MaintenanceRecord]:
    """根据维护类型获取维护记录"""
    return db.query(MaintenanceRecord).filter(
        MaintenanceRecord.maintenance_type == maintenance_type
    ).order_by(MaintenanceRecord.start_time.desc()).offset(skip).limit(limit).all()

def get_maintenance_records_by_status(
    db: Session, 
    status: str, 
    skip: int = 0, 
    limit: int = 100
) -> List[MaintenanceRecord]:
    """根据状态获取维护记录"""
    return db.query(MaintenanceRecord).filter(
        MaintenanceRecord.status == status
    ).order_by(MaintenanceRecord.start_time.desc()).offset(skip).limit(limit).all()

def get_maintenance_records_by_performer(
    db: Session, 
    performed_by: str, 
    skip: int = 0, 
    limit: int = 100
) -> List[MaintenanceRecord]:
    """根据执行人员获取维护记录"""
    return db.query(MaintenanceRecord).filter(
        MaintenanceRecord.performed_by == performed_by
    ).order_by(MaintenanceRecord.start_time.desc()).offset(skip).limit(limit).all()

def get_maintenance_records_by_time_range(
    db: Session, 
    start_time: datetime, 
    end_time: datetime, 
    equipment_id: int = None
) -> List[MaintenanceRecord]:
    """获取指定时间范围内的维护记录"""
    query = db.query(MaintenanceRecord).filter(
        and_(
            MaintenanceRecord.start_time >= start_time,
            MaintenanceRecord.start_time <= end_time
        )
    )
    if equipment_id:
        query = query.filter(MaintenanceRecord.equipment_id == equipment_id)
    return query.order_by(MaintenanceRecord.start_time.desc()).all()

def create_maintenance_record(db: Session, record: MaintenanceRecordCreate) -> MaintenanceRecord:
    """创建新的维护记录"""
    db_record = MaintenanceRecord(**record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def update_maintenance_record(db: Session, record_id: int, record_update: MaintenanceRecordUpdate) -> Optional[MaintenanceRecord]:
    """更新维护记录"""
    db_record = get_maintenance_record(db, record_id)
    if not db_record:
        return None
    
    update_data = record_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_record, field, value)
    
    db.commit()
    db.refresh(db_record)
    return db_record

def delete_maintenance_record(db: Session, record_id: int) -> bool:
    """删除维护记录"""
    db_record = get_maintenance_record(db, record_id)
    if not db_record:
        return False
    
    db.delete(db_record)
    db.commit()
    return True

def get_maintenance_statistics(db: Session, equipment_id: int = None, days: int = 30) -> dict:
    """获取维护统计信息"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    query = db.query(MaintenanceRecord).filter(MaintenanceRecord.start_time >= start_date)
    if equipment_id:
        query = query.filter(MaintenanceRecord.equipment_id == equipment_id)
    
    records = query.all()
    
    if not records:
        return {}
    
    total_records = len(records)
    completed_records = len([r for r in records if r.status == "completed"])
    in_progress_records = len([r for r in records if r.status == "in_progress"])
    scheduled_records = len([r for r in records if r.status == "scheduled"])
    
    total_cost = sum([r.cost for r in records if r.cost is not None])
    total_duration = sum([r.duration_hours for r in records if r.duration_hours is not None])
    
    # 按类型统计
    type_stats = {}
    for record in records:
        record_type = record.maintenance_type
        if record_type not in type_stats:
            type_stats[record_type] = {"count": 0, "cost": 0, "duration": 0}
        type_stats[record_type]["count"] += 1
        if record.cost:
            type_stats[record_type]["cost"] += record.cost
        if record.duration_hours:
            type_stats[record_type]["duration"] += record.duration_hours
    
    return {
        "total_records": total_records,
        "completed_records": completed_records,
        "in_progress_records": in_progress_records,
        "scheduled_records": scheduled_records,
        "completion_rate": completed_records / total_records if total_records > 0 else 0,
        "total_cost": total_cost,
        "total_duration": total_duration,
        "average_cost": total_cost / total_records if total_records > 0 else 0,
        "average_duration": total_duration / total_records if total_records > 0 else 0,
        "type_statistics": type_stats
    }

def get_upcoming_maintenance(db: Session, days: int = 7) -> List[MaintenanceRecord]:
    """获取即将到来的维护"""
    end_date = datetime.utcnow() + timedelta(days=days)
    return db.query(MaintenanceRecord).filter(
        and_(
            MaintenanceRecord.start_time >= datetime.utcnow(),
            MaintenanceRecord.start_time <= end_date,
            MaintenanceRecord.status == "scheduled"
        )
    ).order_by(MaintenanceRecord.start_time.asc()).all()

def get_maintenance_records_by_equipment_type(
    db: Session, 
    equipment_type: str, 
    skip: int = 0, 
    limit: int = 100
) -> List[MaintenanceRecord]:
    """根据设备类型获取维护记录"""
    return db.query(MaintenanceRecord).join(Equipment).filter(
        Equipment.equipment_type == equipment_type
    ).order_by(MaintenanceRecord.start_time.desc()).offset(skip).limit(limit).all()

def get_maintenance_records_by_mine(
    db: Session, 
    mine_id: int, 
    skip: int = 0, 
    limit: int = 100
) -> List[MaintenanceRecord]:
    """获取指定煤矿的维护记录"""
    return db.query(MaintenanceRecord).join(Equipment).filter(
        Equipment.mine_id == mine_id
    ).order_by(MaintenanceRecord.start_time.desc()).offset(skip).limit(limit).all()

def get_maintenance_cost_by_period(
    db: Session, 
    start_date: datetime, 
    end_date: datetime, 
    mine_id: int = None
) -> dict:
    """获取指定时间段内的维护成本"""
    query = db.query(MaintenanceRecord).filter(
        and_(
            MaintenanceRecord.start_time >= start_date,
            MaintenanceRecord.start_time <= end_date
        )
    )
    
    if mine_id:
        query = query.join(Equipment).filter(Equipment.mine_id == mine_id)
    
    records = query.all()
    
    total_cost = sum([r.cost for r in records if r.cost is not None])
    cost_by_type = {}
    
    for record in records:
        if record.cost:
            record_type = record.maintenance_type
            if record_type not in cost_by_type:
                cost_by_type[record_type] = 0
            cost_by_type[record_type] += record.cost
    
    return {
        "total_cost": total_cost,
        "cost_by_type": cost_by_type,
        "record_count": len(records)
    }

class CRUDMaintenanceRecord:
    get_maintenance_record = staticmethod(get_maintenance_record)
    get_maintenance_records_by_equipment = staticmethod(get_maintenance_records_by_equipment)
    get_maintenance_records_by_type = staticmethod(get_maintenance_records_by_type)
    get_maintenance_records_by_status = staticmethod(get_maintenance_records_by_status)
    get_maintenance_records_by_performer = staticmethod(get_maintenance_records_by_performer)
    get_maintenance_records_by_time_range = staticmethod(get_maintenance_records_by_time_range)
    create_maintenance_record = staticmethod(create_maintenance_record)
    update_maintenance_record = staticmethod(update_maintenance_record)
    delete_maintenance_record = staticmethod(delete_maintenance_record)
    get_maintenance_statistics = staticmethod(get_maintenance_statistics)
    get_upcoming_maintenance = staticmethod(get_upcoming_maintenance)
    get_maintenance_records_by_equipment_type = staticmethod(get_maintenance_records_by_equipment_type)
    get_maintenance_records_by_mine = staticmethod(get_maintenance_records_by_mine)
    get_maintenance_cost_by_period = staticmethod(get_maintenance_cost_by_period)

crud_maintenance_record = CRUDMaintenanceRecord() 