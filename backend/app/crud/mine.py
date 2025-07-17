from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.mine import Mine
from app.models.monitoring_point import MonitoringPoint
from app.schemas.mine import MineCreate, MineUpdate, MonitoringPointCreate, MonitoringPointUpdate

# 煤矿相关CRUD操作
def get_mine(db: Session, mine_id: int) -> Optional[Mine]:
    """根据ID获取煤矿"""
    return db.query(Mine).filter(Mine.id == mine_id).first()

def get_mines(db: Session, skip: int = 0, limit: int = 100) -> List[Mine]:
    """获取煤矿列表"""
    return db.query(Mine).offset(skip).limit(limit).all()

def get_mines_by_status(db: Session, status: str) -> List[Mine]:
    """根据状态获取煤矿列表"""
    return db.query(Mine).filter(Mine.status == status).all()

def create_mine(db: Session, mine: MineCreate) -> Mine:
    """创建新煤矿"""
    db_mine = Mine(**mine.dict())
    db.add(db_mine)
    db.commit()
    db.refresh(db_mine)
    return db_mine

def update_mine(db: Session, mine_id: int, mine_update: MineUpdate) -> Optional[Mine]:
    """更新煤矿信息"""
    db_mine = get_mine(db, mine_id)
    if not db_mine:
        return None
    
    update_data = mine_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_mine, field, value)
    
    db.commit()
    db.refresh(db_mine)
    return db_mine

def delete_mine(db: Session, mine_id: int) -> bool:
    """删除煤矿"""
    db_mine = get_mine(db, mine_id)
    if not db_mine:
        return False
    
    db.delete(db_mine)
    db.commit()
    return True

# 监控点相关CRUD操作
def get_monitoring_point(db: Session, point_id: int) -> Optional[MonitoringPoint]:
    """根据ID获取监控点"""
    return db.query(MonitoringPoint).filter(MonitoringPoint.id == point_id).first()

def get_monitoring_points_by_mine(db: Session, mine_id: int, skip: int = 0, limit: int = 100) -> List[MonitoringPoint]:
    """获取指定煤矿的监控点列表"""
    return db.query(MonitoringPoint).filter(MonitoringPoint.mine_id == mine_id).offset(skip).limit(limit).all()

def get_active_monitoring_points(db: Session, mine_id: int) -> List[MonitoringPoint]:
    """获取指定煤矿的活跃监控点"""
    return db.query(MonitoringPoint).filter(
        MonitoringPoint.mine_id == mine_id,
        MonitoringPoint.is_active == True
    ).all()

def create_monitoring_point(db: Session, monitoring_point: MonitoringPointCreate) -> MonitoringPoint:
    """创建新监控点"""
    db_monitoring_point = MonitoringPoint(**monitoring_point.dict())
    db.add(db_monitoring_point)
    db.commit()
    db.refresh(db_monitoring_point)
    return db_monitoring_point

def update_monitoring_point(db: Session, point_id: int, point_update: MonitoringPointUpdate) -> Optional[MonitoringPoint]:
    """更新监控点信息"""
    db_point = get_monitoring_point(db, point_id)
    if not db_point:
        return None
    
    update_data = point_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_point, field, value)
    
    db.commit()
    db.refresh(db_point)
    return db_point

def delete_monitoring_point(db: Session, point_id: int) -> bool:
    """删除监控点"""
    db_point = get_monitoring_point(db, point_id)
    if not db_point:
        return False
    
    db.delete(db_point)
    db.commit()
    return True

def get_monitoring_points_by_camera(db: Session, camera_id: str) -> List[MonitoringPoint]:
    """根据摄像头ID获取监控点"""
    return db.query(MonitoringPoint).filter(MonitoringPoint.camera_id == camera_id).all()

class CRUDMine:
    get_mine = staticmethod(get_mine)
    get_mines = staticmethod(get_mines)
    get_mines_by_status = staticmethod(get_mines_by_status)
    create_mine = staticmethod(create_mine)
    update_mine = staticmethod(update_mine)
    delete_mine = staticmethod(delete_mine)
    get_monitoring_point = staticmethod(get_monitoring_point)
    get_monitoring_points_by_mine = staticmethod(get_monitoring_points_by_mine)
    get_active_monitoring_points = staticmethod(get_active_monitoring_points)
    create_monitoring_point = staticmethod(create_monitoring_point)
    update_monitoring_point = staticmethod(update_monitoring_point)
    delete_monitoring_point = staticmethod(delete_monitoring_point)
    get_monitoring_points_by_camera = staticmethod(get_monitoring_points_by_camera)

crud_mine = CRUDMine() 