from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.maintenance_record import MaintenanceRecord
from app.schemas.maintenance_record import MaintenanceRecord as MaintenanceRecordSchema, MaintenanceRecordCreate, MaintenanceRecordUpdate
from app.crud import maintenance_record as crud_maintenance
from app.core.deps import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[MaintenanceRecordSchema])
def get_maintenance_records(
    skip: int = 0,
    limit: int = 100,
    equipment_id: Optional[int] = None,
    maintenance_type: Optional[str] = None,
    status: Optional[str] = None,
    performed_by: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取维护记录列表"""
    if equipment_id:
        records = crud_maintenance.get_maintenance_records_by_equipment(db, equipment_id, skip, limit)
    elif maintenance_type:
        records = crud_maintenance.get_maintenance_records_by_type(db, maintenance_type, skip, limit)
    elif status:
        records = crud_maintenance.get_maintenance_records_by_status(db, status, skip, limit)
    elif performed_by:
        records = crud_maintenance.get_maintenance_records_by_performer(db, performed_by, skip, limit)
    elif start_date and end_date:
        records = crud_maintenance.get_maintenance_records_by_time_range(db, start_date, end_date, equipment_id)
    else:
        # 如果没有指定过滤条件，返回最近的记录
        records = crud_maintenance.get_maintenance_records_by_equipment(db, equipment_id or 0, skip, limit)
    
    return records

@router.post("/", response_model=MaintenanceRecordSchema)
def create_maintenance_record(
    record: MaintenanceRecordCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """创建新的维护记录"""
    return crud_maintenance.create_maintenance_record(db, record)

@router.get("/{record_id}", response_model=MaintenanceRecordSchema)
def get_maintenance_record_by_id(
    record_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """根据ID获取维护记录"""
    record = crud_maintenance.get_maintenance_record(db, record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Maintenance record not found")
    return record

@router.put("/{record_id}", response_model=MaintenanceRecordSchema)
def update_maintenance_record(
    record_id: int,
    record_update: MaintenanceRecordUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """更新维护记录"""
    record = crud_maintenance.update_maintenance_record(db, record_id, record_update)
    if not record:
        raise HTTPException(status_code=404, detail="Maintenance record not found")
    return record

@router.delete("/{record_id}")
def delete_maintenance_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """删除维护记录"""
    success = crud_maintenance.delete_maintenance_record(db, record_id)
    if not success:
        raise HTTPException(status_code=404, detail="Maintenance record not found")
    return {"message": "Maintenance record deleted successfully"}

@router.get("/statistics/")
def get_maintenance_statistics(
    equipment_id: Optional[int] = None,
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取维护统计信息"""
    stats = crud_maintenance.get_maintenance_statistics(db, equipment_id, days)
    return stats

@router.get("/upcoming/", response_model=List[MaintenanceRecordSchema])
def get_upcoming_maintenance(
    days: int = Query(7, ge=1, le=30, description="Number of days to look ahead"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取即将到来的维护"""
    records = crud_maintenance.get_upcoming_maintenance(db, days)
    return records

@router.get("/by-equipment-type/", response_model=List[MaintenanceRecordSchema])
def get_maintenance_by_equipment_type(
    equipment_type: str = Query(..., description="Equipment type to filter by"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """根据设备类型获取维护记录"""
    records = crud_maintenance.get_maintenance_records_by_equipment_type(db, equipment_type, skip, limit)
    return records

@router.get("/by-mine/", response_model=List[MaintenanceRecordSchema])
def get_maintenance_by_mine(
    mine_id: int = Query(..., description="Mine ID to filter by"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取指定煤矿的维护记录"""
    records = crud_maintenance.get_maintenance_records_by_mine(db, mine_id, skip, limit)
    return records

@router.get("/cost-analysis/")
def get_maintenance_cost_analysis(
    start_date: datetime = Query(..., description="Start date for cost analysis"),
    end_date: datetime = Query(..., description="End date for cost analysis"),
    mine_id: Optional[int] = Query(None, description="Optional mine ID to filter by"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取维护成本分析"""
    if start_date >= end_date:
        raise HTTPException(status_code=400, detail="Start date must be before end date")
    
    cost_data = crud_maintenance.get_maintenance_cost_by_period(db, start_date, end_date, mine_id)
    return cost_data

@router.get("/equipment/{equipment_id}/history", response_model=List[MaintenanceRecordSchema])
def get_equipment_maintenance_history(
    equipment_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取设备的维护历史"""
    records = crud_maintenance.get_maintenance_records_by_equipment(db, equipment_id, skip, limit)
    return records

@router.get("/performer/{performer}/history", response_model=List[MaintenanceRecordSchema])
def get_performer_maintenance_history(
    performer: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取执行人员的维护历史"""
    records = crud_maintenance.get_maintenance_records_by_performer(db, performer, skip, limit)
    return records 