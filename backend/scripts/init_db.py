#!/usr/bin/env python3
"""
数据库初始化脚本
只在第一次运行时执行，创建数据库和初始数据
"""

import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models import Base
from app.models.user import User
from app.models.mine import Mine
from app.models.monitoring_point import MonitoringPoint
from app.core.password import get_password_hash
from app.core.enums import UserRole

def create_database():
    """创建数据库"""
    try:
        # 连接到PostgreSQL服务器（不指定数据库）
        conn = psycopg2.connect(
            host=settings.database_host,
            port=settings.database_port,
            user=settings.database_user,
            password=settings.database_password
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # 检查数据库是否存在
        cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (settings.database_name,))
        exists = cursor.fetchone()
        
        if not exists:
            cursor.execute(f'CREATE DATABASE "{settings.database_name}"')
            print(f"✅ 数据库 {settings.database_name} 创建成功")
        else:
            print(f"✅ 数据库 {settings.database_name} 已存在")
        
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ 创建数据库失败: {e}")
        return False

def create_tables():
    """创建数据库表"""
    try:
        engine = create_engine(settings.database_url)
        Base.metadata.create_all(bind=engine)
        print("✅ 数据库表创建成功")
        return True
    except Exception as e:
        print(f"❌ 创建数据库表失败: {e}")
        return False

def create_initial_data():
    """创建初始数据"""
    try:
        engine = create_engine(settings.database_url)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        # 检查是否已有管理员用户
        admin_user = db.query(User).filter(User.username == "admin").first()
        if not admin_user:
            # 创建管理员用户
            admin_user = User(
                username="admin",
                email="admin@aimineguard.com",
                hashed_password=get_password_hash("admin123"),
                full_name="系统管理员",
                role=UserRole.ADMIN,
                is_active=True
            )
            db.add(admin_user)
            print("✅ 管理员用户创建成功")
        
        # 检查是否已有示例矿井
        sample_mine = db.query(Mine).filter(Mine.name == "示例矿井").first()
        if not sample_mine:
            # 创建示例矿井
            sample_mine = Mine(
                name="示例矿井",
                location="山西省大同市",
                depth=500.0,
                status="active"
            )
            db.add(sample_mine)
            db.flush()  # 获取ID
            
            # 创建监控点
            monitoring_points = [
                MonitoringPoint(
                    mine_id=sample_mine.id,
                    name="主井口监控点",
                    location="主井口",
                    camera_id="CAM001",
                    is_active=True
                ),
                MonitoringPoint(
                    mine_id=sample_mine.id,
                    name="采煤工作面A",
                    location="采煤工作面A区",
                    camera_id="CAM002",
                    is_active=True
                ),
                MonitoringPoint(
                    mine_id=sample_mine.id,
                    name="通风井监控点",
                    location="通风井",
                    camera_id="CAM003",
                    is_active=True
                )
            ]
            
            for point in monitoring_points:
                db.add(point)
            
            print("✅ 示例矿井和监控点创建成功")
        
        db.commit()
        db.close()
        return True
    except Exception as e:
        print(f"❌ 创建初始数据失败: {e}")
        return False

def main():
    """主函数"""
    print("🚀 开始初始化数据库...")
    
    # 创建数据库
    if not create_database():
        sys.exit(1)
    
    # 创建表
    if not create_tables():
        sys.exit(1)
    
    # 创建初始数据
    if not create_initial_data():
        sys.exit(1)
    
    print("🎉 数据库初始化完成！")
    print("📝 默认管理员账户:")
    print("   用户名: admin")
    print("   密码: admin123")
    print("   邮箱: admin@aimineguard.com")

if __name__ == "__main__":
    main() 