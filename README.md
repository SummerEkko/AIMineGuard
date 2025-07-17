# AI Mine Guard - 智能矿山危险动作识别报警系统

一个基于 AI 的矿山危险动作识别报警系统，包含完整的后端 API 和前端管理界面。

## 项目结构

```
AIMineGuard/
├── backend/                 # FastAPI 后端
│   ├── app/
│   │   ├── api/            # API 路由
│   │   ├── core/           # 核心配置
│   │   ├── crud/           # 数据库操作
│   │   ├── models/         # 数据库模型
│   │   └── schemas/        # Pydantic 模式
│   ├── pyproject.toml      # Python 依赖配置
│   └── init_db.py          # 数据库初始化脚本
├── frontend/               # React + TypeScript 前端
│   ├── src/
│   │   ├── components/     # UI 组件
│   │   ├── hooks/          # React Hooks
│   │   ├── pages/          # 页面组件
│   │   ├── services/       # API 服务
│   │   └── types/          # TypeScript 类型定义
│   ├── package.json        # Node.js 依赖配置
│   └── vite.config.ts      # Vite 配置
└── README.md
```

## 技术栈

### 后端

- **FastAPI** - 现代、快速的 Web 框架
- **SQLAlchemy** - ORM 数据库操作
- **PostgreSQL** - 关系型数据库
- **Pydantic** - 数据验证和序列化
- **JWT** - 用户认证
- **Poetry** - 依赖管理

### 前端

- **React 18** - 用户界面库
- **TypeScript** - 类型安全
- **React Router** - 路由管理
- **Axios** - HTTP 客户端
- **Tailwind CSS** - 样式框架
- **Vite** - 构建工具

## 功能特性

### 用户管理

- 用户注册和登录
- 角色权限管理（管理员、经理、操作员）
- JWT 令牌认证

### 矿山管理

- 矿山信息 CRUD 操作
- 矿山状态监控
- 产能和位置管理

### 警报系统

- 实时警报监控
- 警报严重程度分级
- 警报状态管理
- 警报处理记录

### 环境监测

- 环境数据收集
- 监测点管理
- 数据可视化

### 设备管理

- 监控设备管理
- 设备维护记录
- 设备状态跟踪

## 快速开始

### 环境要求

- Python 3.9+
- Node.js 18+
- PostgreSQL 12+
- Poetry (Python 包管理器)

### 1. 克隆项目

```bash
git clone <repository-url>
cd AIMineGuard
```

### 2. 后端设置

#### 安装 Python 依赖

```bash
cd backend
poetry install
```

#### 配置数据库

1. 创建 PostgreSQL 数据库

```sql
CREATE DATABASE aimineguard;
```

2. 配置环境变量（创建 `.env` 文件）

```env
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=aimineguard
POSTGRES_PORT=5432
SECRET_KEY=your-secret-key-here
```

#### 初始化数据库

```bash
poetry run python init_db.py
```

#### 启动后端服务

```bash
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

后端 API 将在 http://localhost:8000 运行
API 文档可在 http://localhost:8000/docs 查看

### 3. 前端设置

#### 安装 Node.js 依赖

```bash
cd frontend
npm install
```

#### 启动开发服务器

```bash
npm run dev
```

前端应用将在 http://localhost:3000 运行

## API 端点

### 认证

- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/register` - 用户注册

### 矿山管理

- `GET /api/v1/mines/` - 获取矿山列表
- `POST /api/v1/mines/` - 创建矿山
- `GET /api/v1/mines/{id}` - 获取矿山详情
- `PUT /api/v1/mines/{id}` - 更新矿山
- `DELETE /api/v1/mines/{id}` - 删除矿山

### 警报管理

- `GET /api/v1/alerts/` - 获取警报列表
- `POST /api/v1/alerts/` - 创建警报
- `GET /api/v1/alerts/{id}` - 获取警报详情
- `PUT /api/v1/alerts/{id}` - 更新警报
- `DELETE /api/v1/alerts/{id}` - 删除警报

### 环境数据

- `GET /api/v1/environment-data/` - 获取环境数据
- `POST /api/v1/environment-data/` - 创建环境数据
- `GET /api/v1/environment-data/mine/{mine_id}` - 获取矿山环境数据

### 设备管理

- `GET /api/v1/equipment/` - 获取设备列表
- `POST /api/v1/equipment/` - 创建设备
- `GET /api/v1/equipment/{id}` - 获取设备详情
- `PUT /api/v1/equipment/{id}` - 更新设备
- `DELETE /api/v1/equipment/{id}` - 删除设备

### 维护记录

- `GET /api/v1/maintenance/` - 获取维护记录
- `POST /api/v1/maintenance/` - 创建维护记录
- `GET /api/v1/maintenance/{id}` - 获取维护记录详情
- `PUT /api/v1/maintenance/{id}` - 更新维护记录
- `DELETE /api/v1/maintenance/{id}` - 删除维护记录

## 数据库模型

### 用户 (User)

- id: 主键
- email: 邮箱（唯一）
- full_name: 姓名
- role: 角色（admin/manager/operator）
- is_active: 是否激活
- created_at: 创建时间

### 矿山 (Mine)

- id: 主键
- name: 矿山名称
- location: 位置
- description: 描述
- capacity: 年产能
- status: 状态（active/inactive/maintenance）
- created_at: 创建时间

### 监测点 (MonitoringPoint)

- id: 主键
- mine_id: 所属矿山
- name: 监测点名称
- location: 位置
- equipment_type: 设备类型
- status: 状态

### 警报 (Alert)

- id: 主键
- mine_id: 所属矿山
- monitoring_point_id: 监测点
- title: 警报标题
- description: 警报描述
- severity: 严重程度（critical/high/medium/low）
- status: 状态（active/resolved）
- alert_type: 警报类型
- resolution_notes: 处理备注

### 环境数据 (EnvironmentData)

- id: 主键
- mine_id: 所属矿山
- monitoring_point_id: 监测点
- temperature: 温度
- humidity: 湿度
- gas_level: 气体浓度
- timestamp: 时间戳

### 设备 (Equipment)

- id: 主键
- mine_id: 所属矿山
- name: 设备名称
- type: 设备类型
- model: 型号
- status: 状态
- installation_date: 安装日期

### 维护记录 (MaintenanceRecord)

- id: 主键
- equipment_id: 设备 ID
- maintenance_type: 维护类型
- description: 维护描述
- performed_by: 执行人
- performed_at: 执行时间
- cost: 成本

## 开发指南

### 后端开发

1. 使用 Poetry 管理依赖
2. 遵循 FastAPI 最佳实践
3. 使用 Pydantic 进行数据验证
4. 编写单元测试

### 前端开发

1. 使用 TypeScript 确保类型安全
2. 遵循 React Hooks 最佳实践
3. 使用 Tailwind CSS 进行样式设计
4. 组件化开发

### 数据库迁移

使用 Alembic 进行数据库迁移：

```bash
cd backend
poetry run alembic revision --autogenerate -m "描述"
poetry run alembic upgrade head
```

## 部署

### 生产环境配置

1. 设置环境变量
2. 配置数据库连接
3. 使用 Gunicorn 运行后端
4. 构建前端静态文件
5. 配置 Nginx 反向代理

### Docker 部署

项目支持 Docker 部署，具体配置请参考 Dockerfile 和 docker-compose.yml 文件。

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证。

## 联系方式

如有问题或建议，请通过以下方式联系：

- 邮箱: your.email@example.com
- 项目 Issues: [GitHub Issues](https://github.com/your-repo/issues)
