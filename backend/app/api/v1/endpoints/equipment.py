from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.equipment import Equipment
from app.schemas.equipment import Equipment as EquipmentSchema, EquipmentCreate, EquipmentUpdate
from app.crud import equipment as crud_equipment
from app.core.deps import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[EquipmentSchema])
def get_equipment(
    skip: int = 0,
    limit: int = 100,
    mine_id: Optional[int] = None,
    equipment_type: Optional[str] = None,
    status: Optional[str] = None,
    manufacturer: Optional[str] = None,
    model: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取设备列表"""
    if mine_id:
        equipment = crud_equipment.get_equipment_by_mine(db, mine_id, skip, limit)
    elif equipment_type:
        equipment = crud_equipment.get_equipment_by_type(db, equipment_type, mine_id)
    elif status:
        equipment = crud_equipment.get_equipment_by_status(db, status, mine_id)
    elif manufacturer:
        equipment = crud_equipment.get_equipment_by_manufacturer(db, manufacturer, mine_id)
    elif model:
        equipment = crud_equipment.get_equipment_by_model(db, model, mine_id)
    else:
        # 如果没有指定过滤条件，返回所有设备
        equipment = crud_equipment.get_equipment_by_mine(db, mine_id or 0, skip, limit)
    
    return equipment

@router.post("/", response_model=EquipmentSchema)
def create_equipment(
    equipment: EquipmentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """创建新设备"""
    # 检查序列号是否已存在
    if equipment.serial_number:
        existing_equipment = crud_equipment.get_equipment_by_serial(db, equipment.serial_number)
        if existing_equipment:
            raise HTTPException(status_code=400, detail="Equipment with this serial number already exists")
    
    return crud_equipment.create_equipment(db, equipment)

@router.get("/{equipment_id}", response_model=EquipmentSchema)
def get_equipment_by_id(
    equipment_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """根据ID获取设备"""
    equipment = crud_equipment.get_equipment(db, equipment_id)
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return equipment

@router.put("/{equipment_id}", response_model=EquipmentSchema)
def update_equipment(
    equipment_id: int,
    equipment_update: EquipmentUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """更新设备信息"""
    equipment = crud_equipment.update_equipment(db, equipment_id, equipment_update)
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return equipment

@router.delete("/{equipment_id}")
def delete_equipment(
    equipment_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """删除设备"""
    success = crud_equipment.delete_equipment(db, equipment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return {"message": "Equipment deleted successfully"}

@router.get("/operational/", response_model=List[EquipmentSchema])
def get_operational_equipment(
    mine_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取运行中的设备"""
    equipment = crud_equipment.get_operational_equipment(db, mine_id)
    return equipment

@router.get("/maintenance/", response_model=List[EquipmentSchema])
def get_maintenance_equipment(
    mine_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取维护中的设备"""
    equipment = crud_equipment.get_maintenance_equipment(db, mine_id)
    return equipment

@router.put("/{equipment_id}/status")
def update_equipment_status(
    equipment_id: int,
    status: str = Query(..., description="New equipment status"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """更新设备状态"""
    valid_statuses = ["operational", "maintenance", "offline", "retired"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    equipment = crud_equipment.update_equipment_status(db, equipment_id, status)
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return {"message": f"Equipment status updated to {status}", "equipment": equipment}

@router.put("/{equipment_id}/operating-hours")
def update_operating_hours(
    equipment_id: int,
    hours: float = Query(..., ge=0, description="Hours to add to operating hours"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """更新设备运行小时数"""
    equipment = crud_equipment.update_operating_hours(db, equipment_id, hours)
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return {"message": f"Operating hours updated", "equipment": equipment}

@router.get("/needing-maintenance/", response_model=List[EquipmentSchema])
def get_equipment_needing_maintenance(
    mine_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取需要维护的设备"""
    equipment = crud_equipment.get_equipment_needing_maintenance(db, mine_id)
    return equipment

@router.get("/statistics/")
def get_equipment_statistics(
    mine_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取设备统计信息"""
    stats = crud_equipment.get_equipment_efficiency_stats(db, mine_id)
    return stats

@router.get("/by-serial/{serial_number}", response_model=EquipmentSchema)
def get_equipment_by_serial_number(
    serial_number: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """根据序列号获取设备"""
    equipment = crud_equipment.get_equipment_by_serial(db, serial_number)
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return equipment 