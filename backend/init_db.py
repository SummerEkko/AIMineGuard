import asyncio
from sqlalchemy.orm import Session
from app.database.database import SessionLocal, engine
from app.models import user, mine, monitoring_point, alert, environment_data, equipment, maintenance_record
from app.crud import user as crud_user
from app.schemas.user import UserCreate
from app.models.user import UserRole

# 创建所有表
def create_tables():
    """创建所有数据库表"""
    user.Base.metadata.create_all(bind=engine)
    mine.Base.metadata.create_all(bind=engine)
    monitoring_point.Base.metadata.create_all(bind=engine)
    alert.Base.metadata.create_all(bind=engine)
    environment_data.Base.metadata.create_all(bind=engine)
    equipment.Base.metadata.create_all(bind=engine)
    maintenance_record.Base.metadata.create_all(bind=engine)

def init_db(db: Session) -> None:
    """初始化数据库"""
    # 创建超级管理员用户
    user_in = UserCreate(
        username="admin",
        email="admin@aimineguard.com",
        password="admin123",
        full_name="System Administrator",
        role=UserRole.ADMIN,
        is_active=True
    )
    user = crud_user.get_user_by_email(db, email=user_in.email)
    if not user:
        user = crud_user.create_user(db, user=user_in)
        print(f"Created admin user: {user.username}")
    
    # 创建操作员用户
    operator_in = UserCreate(
        username="operator",
        email="operator@aimineguard.com",
        password="operator123",
        full_name="System Operator",
        role=UserRole.OPERATOR,
        is_active=True
    )
    operator = crud_user.get_user_by_email(db, email=operator_in.email)
    if not operator:
        operator = crud_user.create_user(db, user=operator_in)
        print(f"Created operator user: {operator.username}")
    
    # 创建查看者用户
    viewer_in = UserCreate(
        username="viewer",
        email="viewer@aimineguard.com",
        password="viewer123",
        full_name="System Viewer",
        role=UserRole.VIEWER,
        is_active=True
    )
    viewer = crud_user.get_user_by_email(db, email=viewer_in.email)
    if not viewer:
        viewer = crud_user.create_user(db, user=viewer_in)
        print(f"Created viewer user: {viewer.username}")

def main() -> None:
    """主函数"""
    print("Creating database tables...")
    create_tables()
    print("Database tables created successfully!")
    
    print("Initializing database with initial data...")
    db = SessionLocal()
    try:
        init_db(db)
        print("Database initialized successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    main() 