import apiService from "./api";
import {
  Alert,
  AlertCreate,
  AlertUpdate,
  AlertWithDetails,
  AlertSummary,
  AlertStatus,
  AlertSeverity,
} from "@/types";

export const alertService = {
  // 获取报警列表
  async getAlerts(params?: {
    skip?: number;
    limit?: number;
    status?: AlertStatus;
    severity?: AlertSeverity;
    mine_id?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<AlertWithDetails[]> {
    return apiService.getAlerts(params);
  },

  // 获取单个报警
  async getAlert(id: number): Promise<AlertWithDetails> {
    return apiService.getAlertById(id);
  },

  // 创建报警
  async createAlert(alertData: AlertCreate): Promise<Alert> {
    return apiService.createAlert(alertData);
  },

  // 更新报警
  async updateAlert(id: number, alertData: AlertUpdate): Promise<Alert> {
    return apiService.updateAlert(id, alertData);
  },

  // 确认报警
  async acknowledgeAlert(id: number): Promise<void> {
    return apiService.acknowledgeAlert(id);
  },

  // 解决报警
  async resolveAlert(id: number): Promise<void> {
    return apiService.resolveAlert(id);
  },

  // 获取报警统计概览
  async getAlertSummary(): Promise<AlertSummary> {
    return apiService.getAlertSummary();
  },
};
