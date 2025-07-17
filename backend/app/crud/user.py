from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserUpdate
from app.core.password import get_password_hash, verify_password

def get_user(db: Session, user_id: int) -> Optional[User]:
    """根据ID获取用户"""
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """根据邮箱获取用户"""
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """根据用户名获取用户"""
    return db.query(User).filter(User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """获取用户列表"""
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate) -> User:
    """创建新用户"""
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        role=user.role,
        is_active=user.is_active
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
    """更新用户信息"""
    db_user = get_user(db, user_id)
    if not db_user:
        return None
    
    update_data = user_update.dict(exclude_unset=True)
    
    # 如果更新密码，需要重新哈希
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int) -> bool:
    """删除用户"""
    db_user = get_user(db, user_id)
    if not db_user:
        return False
    
    db.delete(db_user)
    db.commit()
    return True

def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    """验证用户登录"""
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def is_active_user(user: User) -> bool:
    """检查用户是否激活"""
    return user.is_active

def is_superuser(user: User) -> bool:
    """检查用户是否为超级管理员"""
    return user.is_superuser

def get_users_by_role(db: Session, role: UserRole) -> List[User]:
    """根据角色获取用户列表"""
    return db.query(User).filter(User.role == role).all()

def update_user_last_login(db: Session, user_id: int) -> None:
    """更新用户最后登录时间"""
    db_user = get_user(db, user_id)
    if db_user:
        from datetime import datetime
        db_user.last_login = datetime.utcnow()
        db.commit() 

class CRUDUser:
    get_user = staticmethod(get_user)
    get_user_by_email = staticmethod(get_user_by_email)
    get_user_by_username = staticmethod(get_user_by_username)
    get_users = staticmethod(get_users)
    create_user = staticmethod(create_user)
    update_user = staticmethod(update_user)
    delete_user = staticmethod(delete_user)
    authenticate_user = staticmethod(authenticate_user)
    is_active_user = staticmethod(is_active_user)
    is_superuser = staticmethod(is_superuser)
    get_users_by_role = staticmethod(get_users_by_role)
    update_user_last_login = staticmethod(update_user_last_login)

crud_user = CRUDUser() 