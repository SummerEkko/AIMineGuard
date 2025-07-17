from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.mine import Mine
from app.models.monitoring_point import MonitoringPoint
from app.schemas.mine import Mine as MineSchema, MineCreate, MineUpdate, MonitoringPoint as MonitoringPointSchema, MonitoringPointCreate, MonitoringPointUpdate
from app.core.deps import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[MineSchema])
def get_mines(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取煤矿列表"""
    mines = db.query(Mine).offset(skip).limit(limit).all()
    return mines

@router.post("/", response_model=MineSchema)
def create_mine(
    mine: MineCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """创建煤矿"""
    db_mine = Mine(**mine.dict())
    db.add(db_mine)
    db.commit()
    db.refresh(db_mine)
    return db_mine

@router.get("/{mine_id}", response_model=MineSchema)
def get_mine(
    mine_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取煤矿详情"""
    mine = db.query(Mine).filter(Mine.id == mine_id).first()
    if mine is None:
        raise HTTPException(status_code=404, detail="Mine not found")
    return mine

@router.put("/{mine_id}", response_model=MineSchema)
def update_mine(
    mine_id: int,
    mine: MineUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """更新煤矿信息"""
    db_mine = db.query(Mine).filter(Mine.id == mine_id).first()
    if db_mine is None:
        raise HTTPException(status_code=404, detail="Mine not found")
    
    update_data = mine.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_mine, field, value)
    
    db.commit()
    db.refresh(db_mine)
    return db_mine

@router.delete("/{mine_id}")
def delete_mine(
    mine_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """删除煤矿"""
    db_mine = db.query(Mine).filter(Mine.id == mine_id).first()
    if db_mine is None:
        raise HTTPException(status_code=404, detail="Mine not found")
    
    db.delete(db_mine)
    db.commit()
    return {"message": "Mine deleted successfully"}

# 监控点相关API
@router.get("/{mine_id}/monitoring-points", response_model=List[MonitoringPointSchema])
def get_monitoring_points(
    mine_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """获取煤矿的监控点列表"""
    monitoring_points = db.query(MonitoringPoint).filter(MonitoringPoint.mine_id == mine_id).all()
    return monitoring_points

@router.post("/{mine_id}/monitoring-points", response_model=MonitoringPointSchema)
def create_monitoring_point(
    mine_id: int,
    monitoring_point: MonitoringPointCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """创建监控点"""
    # 检查煤矿是否存在
    mine = db.query(Mine).filter(Mine.id == mine_id).first()
    if mine is None:
        raise HTTPException(status_code=404, detail="Mine not found")
    
    db_monitoring_point = MonitoringPoint(**monitoring_point.dict())
    db.add(db_monitoring_point)
    db.commit()
    db.refresh(db_monitoring_point)
    return db_monitoring_point 