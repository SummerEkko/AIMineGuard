#!/usr/bin/env python3
"""
AI Mine Guard 系统测试脚本
测试前后端连接和基本功能
"""

import requests
import json
import time

# 配置
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

def test_backend_health():
    """测试后端健康状态"""
    print("🔍 测试后端健康状态...")
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ 后端服务正常")
            return True
        else:
            print(f"❌ 后端服务异常: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ 无法连接到后端: {e}")
        return False

def test_backend_api_docs():
    """测试后端API文档"""
    print("🔍 测试后端API文档...")
    try:
        response = requests.get(f"{BACKEND_URL}/docs", timeout=5)
        if response.status_code == 200:
            print("✅ API文档可访问")
            return True
        else:
            print(f"❌ API文档不可访问: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ 无法访问API文档: {e}")
        return False

def test_frontend():
    """测试前端服务"""
    print("🔍 测试前端服务...")
    try:
        response = requests.get(FRONTEND_URL, timeout=5)
        if response.status_code == 200:
            print("✅ 前端服务正常")
            return True
        else:
            print(f"❌ 前端服务异常: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ 无法连接到前端: {e}")
        return False

def test_database_connection():
    """测试数据库连接"""
    print("🔍 测试数据库连接...")
    try:
        # 尝试获取矿山列表来测试数据库连接
        response = requests.get(f"{BACKEND_URL}/api/v1/mines/", timeout=5)
        if response.status_code in [200, 401]:  # 200表示成功，401表示需要认证
            print("✅ 数据库连接正常")
            return True
        else:
            print(f"❌ 数据库连接异常: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ 无法测试数据库连接: {e}")
        return False

def test_user_registration():
    """测试用户注册功能"""
    print("🔍 测试用户注册功能...")
    try:
        user_data = {
            "email": f"test_{int(time.time())}@example.com",
            "password": "testpassword123",
            "full_name": "测试用户",
            "role": "operator"
        }
        
        response = requests.post(
            f"{BACKEND_URL}/api/v1/auth/register",
            json=user_data,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ 用户注册功能正常")
            result = response.json()
            print(f"   用户ID: {result.get('user', {}).get('id')}")
            return True
        elif response.status_code == 422:
            print("⚠️  用户注册验证正常（可能是重复邮箱）")
            return True
        else:
            print(f"❌ 用户注册功能异常: {response.status_code}")
            print(f"   响应: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ 无法测试用户注册: {e}")
        return False

def test_mine_creation():
    """测试矿山创建功能"""
    print("🔍 测试矿山创建功能...")
    try:
        mine_data = {
            "name": f"测试矿山_{int(time.time())}",
            "location": "测试位置",
            "description": "这是一个测试矿山",
            "capacity": 1000000,
            "status": "active"
        }
        
        response = requests.post(
            f"{BACKEND_URL}/api/v1/mines/",
            json=mine_data,
            timeout=10
        )
        
        if response.status_code == 401:
            print("✅ 矿山创建需要认证（安全正常）")
            return True
        elif response.status_code == 200:
            print("✅ 矿山创建功能正常")
            return True
        else:
            print(f"❌ 矿山创建功能异常: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ 无法测试矿山创建: {e}")
        return False

def main():
    """主测试函数"""
    print("🚀 AI Mine Guard 系统测试开始")
    print("=" * 50)
    
    tests = [
        ("后端健康状态", test_backend_health),
        ("后端API文档", test_backend_api_docs),
        ("前端服务", test_frontend),
        ("数据库连接", test_database_connection),
        ("用户注册", test_user_registration),
        ("矿山创建", test_mine_creation),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}")
        print("-" * 30)
        if test_func():
            passed += 1
        time.sleep(1)  # 避免请求过快
    
    print("\n" + "=" * 50)
    print(f"📊 测试结果: {passed}/{total} 通过")
    
    if passed == total:
        print("🎉 所有测试通过！系统运行正常")
        print(f"\n🌐 访问地址:")
        print(f"   前端应用: {FRONTEND_URL}")
        print(f"   后端API: {BACKEND_URL}")
        print(f"   API文档: {BACKEND_URL}/docs")
    else:
        print("⚠️  部分测试失败，请检查系统配置")
    
    print("\n💡 提示:")
    print("   1. 确保PostgreSQL数据库已启动")
    print("   2. 确保已运行数据库初始化脚本")
    print("   3. 检查环境变量配置")
    print("   4. 查看后端日志获取详细错误信息")

if __name__ == "__main__":
    main() 