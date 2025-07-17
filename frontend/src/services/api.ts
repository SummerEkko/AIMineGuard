import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  User,
  UserCreate,
  UserUpdate,
  UserLogin,
  Token,
  Mine,
  MineCreate,
  MineUpdate,
  MonitoringPoint,
  MonitoringPointCreate,
  MonitoringPointUpdate,
  Alert,
  AlertCreate,
  AlertUpdate,
  AlertWithDetails,
  AlertSummary,
  EnvironmentData,
  EnvironmentDataCreate,
  EnvironmentDataUpdate,
  EnvironmentStatistics,
  EnvironmentTrends,
  Equipment,
  EquipmentCreate,
  EquipmentUpdate,
  EquipmentStatistics,
  MaintenanceRecord,
  MaintenanceRecordCreate,
  MaintenanceRecordUpdate,
  MaintenanceStatistics,
  ApiResponse,
  PaginatedResponse,
  DashboardData,
} from "@/types";

// API基础配置
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 请求拦截器：添加认证token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器：处理错误
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token过期，清除本地存储并跳转到登录页
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // 设置认证token
  setAuthToken(token: string | null) {
    if (token) {
      localStorage.setItem("access_token", token);
    } else {
      localStorage.removeItem("access_token");
    }
  }

  // 认证相关API
  async login(credentials: UserLogin): Promise<Token> {
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response: AxiosResponse<Token> = await this.api.post(
      "/auth/login",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  }

  async register(userData: UserCreate): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post(
      "/auth/register",
      userData
    );
    return response.data;
  }

  async testToken(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post(
      "/auth/test-token"
    );
    return response.data;
  }

  async refreshToken(): Promise<Token> {
    const response: AxiosResponse<Token> = await this.api.post("/auth/refresh");
    return response.data;
  }

  // 用户相关API
  async getUsers(skip = 0, limit = 100): Promise<User[]> {
    const response: AxiosResponse<User[]> = await this.api.get("/users", {
      params: { skip, limit },
    });
    return response.data;
  }

  async getUserById(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async createUser(userData: UserCreate): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post(
      "/users",
      userData
    );
    return response.data;
  }

  async updateUser(id: number, userData: UserUpdate): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put(
      `/users/${id}`,
      userData
    );
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  // 煤矿相关API
  async getMines(skip = 0, limit = 100): Promise<Mine[]> {
    const response: AxiosResponse<Mine[]> = await this.api.get("/mines", {
      params: { skip, limit },
    });
    return response.data;
  }

  async getMineById(id: number): Promise<Mine> {
    const response: AxiosResponse<Mine> = await this.api.get(`/mines/${id}`);
    return response.data;
  }

  async createMine(mineData: MineCreate): Promise<Mine> {
    const response: AxiosResponse<Mine> = await this.api.post(
      "/mines",
      mineData
    );
    return response.data;
  }

  async updateMine(id: number, mineData: MineUpdate): Promise<Mine> {
    const response: AxiosResponse<Mine> = await this.api.put(
      `/mines/${id}`,
      mineData
    );
    return response.data;
  }

  async deleteMine(id: number): Promise<void> {
    await this.api.delete(`/mines/${id}`);
  }

  // 监控点相关API
  async getMonitoringPoints(
    mineId: number,
    skip = 0,
    limit = 100
  ): Promise<MonitoringPoint[]> {
    const response: AxiosResponse<MonitoringPoint[]> = await this.api.get(
      `/mines/${mineId}/monitoring-points`,
      {
        params: { skip, limit },
      }
    );
    return response.data;
  }

  async createMonitoringPoint(
    mineId: number,
    pointData: MonitoringPointCreate
  ): Promise<MonitoringPoint> {
    const response: AxiosResponse<MonitoringPoint> = await this.api.post(
      `/mines/${mineId}/monitoring-points`,
      pointData
    );
    return response.data;
  }

  async updateMonitoringPoint(
    mineId: number,
    pointId: number,
    pointData: MonitoringPointUpdate
  ): Promise<MonitoringPoint> {
    const response: AxiosResponse<MonitoringPoint> = await this.api.put(
      `/mines/${mineId}/monitoring-points/${pointId}`,
      pointData
    );
    return response.data;
  }

  async deleteMonitoringPoint(mineId: number, pointId: number): Promise<void> {
    await this.api.delete(`/mines/${mineId}/monitoring-points/${pointId}`);
  }

  // 报警相关API
  async getAlerts(params?: {
    skip?: number;
    limit?: number;
    status?: string;
    severity?: string;
    mine_id?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<AlertWithDetails[]> {
    const response: AxiosResponse<AlertWithDetails[]> = await this.api.get(
      "/alerts",
      { params }
    );
    return response.data;
  }

  async getAlertById(id: number): Promise<AlertWithDetails> {
    const response: AxiosResponse<AlertWithDetails> = await this.api.get(
      `/alerts/${id}`
    );
    return response.data;
  }

  async createAlert(alertData: AlertCreate): Promise<Alert> {
    const response: AxiosResponse<Alert> = await this.api.post(
      "/alerts",
      alertData
    );
    return response.data;
  }

  async updateAlert(id: number, alertData: AlertUpdate): Promise<Alert> {
    const response: AxiosResponse<Alert> = await this.api.put(
      `/alerts/${id}`,
      alertData
    );
    return response.data;
  }

  async acknowledgeAlert(id: number): Promise<void> {
    await this.api.post(`/alerts/${id}/acknowledge`);
  }

  async resolveAlert(id: number): Promise<void> {
    await this.api.post(`/alerts/${id}/resolve`);
  }

  async getAlertSummary(): Promise<AlertSummary> {
    const response: AxiosResponse<AlertSummary> = await this.api.get(
      "/alerts/summary/overview"
    );
    return response.data;
  }

  // 环境数据相关API
  async getEnvironmentData(params?: {
    skip?: number;
    limit?: number;
    monitoring_point_id?: number;
    mine_id?: number;
    start_time?: string;
    end_time?: string;
  }): Promise<EnvironmentData[]> {
    const response: AxiosResponse<EnvironmentData[]> = await this.api.get(
      "/environment-data",
      { params }
    );
    return response.data;
  }

  async getLatestEnvironmentData(
    monitoringPointId: number
  ): Promise<EnvironmentData> {
    const response: AxiosResponse<EnvironmentData> = await this.api.get(
      `/environment-data/latest/${monitoringPointId}`
    );
    return response.data;
  }

  async createEnvironmentData(
    data: EnvironmentDataCreate
  ): Promise<EnvironmentData> {
    const response: AxiosResponse<EnvironmentData> = await this.api.post(
      "/environment-data",
      data
    );
    return response.data;
  }

  async getEnvironmentStatistics(
    monitoringPointId: number,
    hours = 24
  ): Promise<EnvironmentStatistics> {
    const response: AxiosResponse<EnvironmentStatistics> = await this.api.get(
      `/environment-data/statistics/${monitoringPointId}`,
      {
        params: { hours },
      }
    );
    return response.data;
  }

  async getEnvironmentTrends(
    monitoringPointId: number,
    field: string,
    hours = 24
  ): Promise<EnvironmentTrends> {
    const response: AxiosResponse<EnvironmentTrends> = await this.api.get(
      `/environment-data/trends/${monitoringPointId}`,
      {
        params: { field, hours },
      }
    );
    return response.data;
  }

  async getMineEnvironmentSummary(mineId: number, hours = 24): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get(
      `/environment-data/summary/mine/${mineId}`,
      {
        params: { hours },
      }
    );
    return response.data;
  }

  // 设备相关API
  async getEquipment(params?: {
    skip?: number;
    limit?: number;
    mine_id?: number;
    equipment_type?: string;
    status?: string;
    manufacturer?: string;
    model?: string;
  }): Promise<Equipment[]> {
    const response: AxiosResponse<Equipment[]> = await this.api.get(
      "/equipment",
      { params }
    );
    return response.data;
  }

  async getEquipmentById(id: number): Promise<Equipment> {
    const response: AxiosResponse<Equipment> = await this.api.get(
      `/equipment/${id}`
    );
    return response.data;
  }

  async createEquipment(equipmentData: EquipmentCreate): Promise<Equipment> {
    const response: AxiosResponse<Equipment> = await this.api.post(
      "/equipment",
      equipmentData
    );
    return response.data;
  }

  async updateEquipment(
    id: number,
    equipmentData: EquipmentUpdate
  ): Promise<Equipment> {
    const response: AxiosResponse<Equipment> = await this.api.put(
      `/equipment/${id}`,
      equipmentData
    );
    return response.data;
  }

  async deleteEquipment(id: number): Promise<void> {
    await this.api.delete(`/equipment/${id}`);
  }

  async getOperationalEquipment(mineId?: number): Promise<Equipment[]> {
    const response: AxiosResponse<Equipment[]> = await this.api.get(
      "/equipment/operational",
      {
        params: { mine_id: mineId },
      }
    );
    return response.data;
  }

  async getMaintenanceEquipment(mineId?: number): Promise<Equipment[]> {
    const response: AxiosResponse<Equipment[]> = await this.api.get(
      "/equipment/maintenance",
      {
        params: { mine_id: mineId },
      }
    );
    return response.data;
  }

  async updateEquipmentStatus(id: number, status: string): Promise<any> {
    const response: AxiosResponse<any> = await this.api.put(
      `/equipment/${id}/status`,
      null,
      {
        params: { status },
      }
    );
    return response.data;
  }

  async updateOperatingHours(id: number, hours: number): Promise<any> {
    const response: AxiosResponse<any> = await this.api.put(
      `/equipment/${id}/operating-hours`,
      null,
      {
        params: { hours },
      }
    );
    return response.data;
  }

  async getEquipmentNeedingMaintenance(mineId?: number): Promise<Equipment[]> {
    const response: AxiosResponse<Equipment[]> = await this.api.get(
      "/equipment/needing-maintenance",
      {
        params: { mine_id: mineId },
      }
    );
    return response.data;
  }

  async getEquipmentStatistics(mineId?: number): Promise<EquipmentStatistics> {
    const response: AxiosResponse<EquipmentStatistics> = await this.api.get(
      "/equipment/statistics",
      {
        params: { mine_id: mineId },
      }
    );
    return response.data;
  }

  // 维护记录相关API
  async getMaintenanceRecords(params?: {
    skip?: number;
    limit?: number;
    equipment_id?: number;
    maintenance_type?: string;
    status?: string;
    performed_by?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<MaintenanceRecord[]> {
    const response: AxiosResponse<MaintenanceRecord[]> = await this.api.get(
      "/maintenance",
      { params }
    );
    return response.data;
  }

  async getMaintenanceRecordById(id: number): Promise<MaintenanceRecord> {
    const response: AxiosResponse<MaintenanceRecord> = await this.api.get(
      `/maintenance/${id}`
    );
    return response.data;
  }

  async createMaintenanceRecord(
    recordData: MaintenanceRecordCreate
  ): Promise<MaintenanceRecord> {
    const response: AxiosResponse<MaintenanceRecord> = await this.api.post(
      "/maintenance",
      recordData
    );
    return response.data;
  }

  async updateMaintenanceRecord(
    id: number,
    recordData: MaintenanceRecordUpdate
  ): Promise<MaintenanceRecord> {
    const response: AxiosResponse<MaintenanceRecord> = await this.api.put(
      `/maintenance/${id}`,
      recordData
    );
    return response.data;
  }

  async deleteMaintenanceRecord(id: number): Promise<void> {
    await this.api.delete(`/maintenance/${id}`);
  }

  async getMaintenanceStatistics(
    equipmentId?: number,
    days = 30
  ): Promise<MaintenanceStatistics> {
    const response: AxiosResponse<MaintenanceStatistics> = await this.api.get(
      "/maintenance/statistics",
      {
        params: { equipment_id: equipmentId, days },
      }
    );
    return response.data;
  }

  async getUpcomingMaintenance(days = 7): Promise<MaintenanceRecord[]> {
    const response: AxiosResponse<MaintenanceRecord[]> = await this.api.get(
      "/maintenance/upcoming",
      {
        params: { days },
      }
    );
    return response.data;
  }

  async getMaintenanceByEquipmentType(
    equipmentType: string,
    skip = 0,
    limit = 100
  ): Promise<MaintenanceRecord[]> {
    const response: AxiosResponse<MaintenanceRecord[]> = await this.api.get(
      "/maintenance/by-equipment-type",
      {
        params: { equipment_type: equipmentType, skip, limit },
      }
    );
    return response.data;
  }

  async getMaintenanceByMine(
    mineId: number,
    skip = 0,
    limit = 100
  ): Promise<MaintenanceRecord[]> {
    const response: AxiosResponse<MaintenanceRecord[]> = await this.api.get(
      "/maintenance/by-mine",
      {
        params: { mine_id: mineId, skip, limit },
      }
    );
    return response.data;
  }

  async getMaintenanceCostAnalysis(
    startDate: string,
    endDate: string,
    mineId?: number
  ): Promise<any> {
    const response: AxiosResponse<any> = await this.api.get(
      "/maintenance/cost-analysis",
      {
        params: { start_date: startDate, end_date: endDate, mine_id: mineId },
      }
    );
    return response.data;
  }

  async getEquipmentMaintenanceHistory(
    equipmentId: number,
    skip = 0,
    limit = 100
  ): Promise<MaintenanceRecord[]> {
    const response: AxiosResponse<MaintenanceRecord[]> = await this.api.get(
      `/maintenance/equipment/${equipmentId}/history`,
      {
        params: { skip, limit },
      }
    );
    return response.data;
  }

  async getPerformerMaintenanceHistory(
    performer: string,
    skip = 0,
    limit = 100
  ): Promise<MaintenanceRecord[]> {
    const response: AxiosResponse<MaintenanceRecord[]> = await this.api.get(
      `/maintenance/performer/${performer}/history`,
      {
        params: { skip, limit },
      }
    );
    return response.data;
  }
}

// 创建API服务实例
export const apiService = new ApiService();
export default apiService;
