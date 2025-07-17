from typing import Optional, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from app.models.equipment import Equipment
from app.schemas.equipment import EquipmentCreate, EquipmentUpdate

def get_equipment(db: Session, equipment_id: int) -> Optional[Equipment]:
    """根据ID获取设备"""
    return db.query(Equipment).filter(Equipment.id == equipment_id).first()

def get_equipment_by_serial(db: Session, serial_number: str) -> Optional[Equipment]:
    """根据序列号获取设备"""
    return db.query(Equipment).filter(Equipment.serial_number == serial_number).first()

def get_equipment_by_mine(db: Session, mine_id: int, skip: int = 0, limit: int = 100) -> List[Equipment]:
    """获取指定煤矿的设备列表"""
    return db.query(Equipment).filter(Equipment.mine_id == mine_id).offset(skip).limit(limit).all()

def get_equipment_by_type(db: Session, equipment_type: str, mine_id: int = None) -> List[Equipment]:
    """根据设备类型获取设备列表"""
    query = db.query(Equipment).filter(Equipment.equipment_type == equipment_type)
    if mine_id:
        query = query.filter(Equipment.mine_id == mine_id)
    return query.all()

def get_equipment_by_status(db: Session, status: str, mine_id: int = None) -> List[Equipment]:
    """根据状态获取设备列表"""
    query = db.query(Equipment).filter(Equipment.status == status)
    if mine_id:
        query = query.filter(Equipment.mine_id == mine_id)
    return query.all()

def get_operational_equipment(db: Session, mine_id: int = None) -> List[Equipment]:
    """获取运行中的设备"""
    return get_equipment_by_status(db, "operational", mine_id)

def get_maintenance_equipment(db: Session, mine_id: int = None) -> List[Equipment]:
    """获取维护中的设备"""
    return get_equipment_by_status(db, "maintenance", mine_id)

def create_equipment(db: Session, equipment: EquipmentCreate) -> Equipment:
    """创建新设备"""
    db_equipment = Equipment(**equipment.dict())
    db.add(db_equipment)
    db.commit()
    db.refresh(db_equipment)
    return db_equipment

def update_equipment(db: Session, equipment_id: int, equipment_update: EquipmentUpdate) -> Optional[Equipment]:
    """更新设备信息"""
    db_equipment = get_equipment(db, equipment_id)
    if not db_equipment:
        return None
    
    update_data = equipment_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_equipment, field, value)
    
    db.commit()
    db.refresh(db_equipment)
    return db_equipment

def delete_equipment(db: Session, equipment_id: int) -> bool:
    """删除设备"""
    db_equipment = get_equipment(db, equipment_id)
    if not db_equipment:
        return False
    
    db.delete(db_equipment)
    db.commit()
    return True

def update_equipment_status(db: Session, equipment_id: int, status: str) -> Optional[Equipment]:
    """更新设备状态"""
    db_equipment = get_equipment(db, equipment_id)
    if not db_equipment:
        return None
    
    db_equipment.status = status
    db.commit()
    db.refresh(db_equipment)
    return db_equipment

def update_operating_hours(db: Session, equipment_id: int, hours: float) -> Optional[Equipment]:
    """更新设备运行小时数"""
    db_equipment = get_equipment(db, equipment_id)
    if not db_equipment:
        return None
    
    db_equipment.operating_hours += hours
    db.commit()
    db.refresh(db_equipment)
    return db_equipment

def get_equipment_needing_maintenance(db: Session, mine_id: int = None) -> List[Equipment]:
    """获取需要维护的设备"""
    query = db.query(Equipment).filter(
        and_(
            Equipment.next_maintenance_date <= datetime.utcnow(),
            Equipment.status != "retired"
        )
    )
    if mine_id:
        query = query.filter(Equipment.mine_id == mine_id)
    return query.all()

def get_equipment_efficiency_stats(db: Session, mine_id: int = None) -> dict:
    """获取设备效率统计"""
    query = db.query(Equipment)
    if mine_id:
        query = query.filter(Equipment.mine_id == mine_id)
    
    equipment_list = query.all()
    
    if not equipment_list:
        return {}
    
    total_equipment = len(equipment_list)
    operational_equipment = len([e for e in equipment_list if e.status == "operational"])
    maintenance_equipment = len([e for e in equipment_list if e.status == "maintenance"])
    offline_equipment = len([e for e in equipment_list if e.status == "offline"])
    
    avg_efficiency = 0
    efficiency_values = [e.efficiency_rating for e in equipment_list if e.efficiency_rating is not None]
    if efficiency_values:
        avg_efficiency = sum(efficiency_values) / len(efficiency_values)
    
    total_operating_hours = sum([e.operating_hours for e in equipment_list])
    
    return {
        "total_equipment": total_equipment,
        "operational_equipment": operational_equipment,
        "maintenance_equipment": maintenance_equipment,
        "offline_equipment": offline_equipment,
        "operational_rate": operational_equipment / total_equipment if total_equipment > 0 else 0,
        "average_efficiency": avg_efficiency,
        "total_operating_hours": total_operating_hours
    }

def get_equipment_by_manufacturer(db: Session, manufacturer: str, mine_id: int = None) -> List[Equipment]:
    """根据制造商获取设备"""
    query = db.query(Equipment).filter(Equipment.manufacturer == manufacturer)
    if mine_id:
        query = query.filter(Equipment.mine_id == mine_id)
    return query.all()

def get_equipment_by_model(db: Session, model: str, mine_id: int = None) -> List[Equipment]:
    """根据型号获取设备"""
    query = db.query(Equipment).filter(Equipment.model == model)
    if mine_id:
        query = query.filter(Equipment.mine_id == mine_id)
    return query.all()

class CRUDEquipment:
    get_equipment = staticmethod(get_equipment)
    get_equipment_by_serial = staticmethod(get_equipment_by_serial)
    get_equipment_by_mine = staticmethod(get_equipment_by_mine)
    get_equipment_by_type = staticmethod(get_equipment_by_type)
    get_equipment_by_status = staticmethod(get_equipment_by_status)
    get_operational_equipment = staticmethod(get_operational_equipment)
    get_maintenance_equipment = staticmethod(get_maintenance_equipment)
    create_equipment = staticmethod(create_equipment)
    update_equipment = staticmethod(update_equipment)
    delete_equipment = staticmethod(delete_equipment)
    update_equipment_status = staticmethod(update_equipment_status)
    update_operating_hours = staticmethod(update_operating_hours)
    get_equipment_needing_maintenance = staticmethod(get_equipment_needing_maintenance)
    get_equipment_efficiency_stats = staticmethod(get_equipment_efficiency_stats)
    get_equipment_by_manufacturer = staticmethod(get_equipment_by_manufacturer)
    get_equipment_by_model = staticmethod(get_equipment_by_model)

crud_equipment = CRUDEquipment() 