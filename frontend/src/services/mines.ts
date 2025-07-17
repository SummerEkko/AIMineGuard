import apiService from "./api";
import {
  Mine,
  MineCreate,
  MineUpdate,
  MonitoringPoint,
  MonitoringPointCreate,
} from "@/types";

export const mineService = {
  // 获取煤矿列表
  async getMines(): Promise<Mine[]> {
    return apiService.getMines();
  },

  // 获取单个煤矿
  async getMine(id: number): Promise<Mine> {
    return apiService.getMineById(id);
  },

  // 创建煤矿
  async createMine(mineData: MineCreate): Promise<Mine> {
    return apiService.createMine(mineData);
  },

  // 更新煤矿
  async updateMine(id: number, mineData: MineUpdate): Promise<Mine> {
    return apiService.updateMine(id, mineData);
  },

  // 删除煤矿
  async deleteMine(id: number): Promise<void> {
    return apiService.deleteMine(id);
  },

  // 获取煤矿的监控点列表
  async getMonitoringPoints(mineId: number): Promise<MonitoringPoint[]> {
    return apiService.getMonitoringPoints(mineId);
  },

  // 创建监控点
  async createMonitoringPoint(
    mineId: number,
    pointData: MonitoringPointCreate
  ): Promise<MonitoringPoint> {
    return apiService.createMonitoringPoint(mineId, pointData);
  },
};
