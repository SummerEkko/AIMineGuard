import apiService from "./api";
import { SystemStatus, EnvironmentThresholds } from "@/types";

export const systemService = {
  // 获取系统状态
  async getSystemStatus(): Promise<SystemStatus> {
    // 使用 fetch 直接调用，因为 apiService 没有这个方法
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/status`
    );
    if (!response.ok) {
      throw new Error("Failed to get system status");
    }
    return response.json();
  },

  // 获取环境参数阈值
  async getEnvironmentThresholds(): Promise<EnvironmentThresholds> {
    // 使用 fetch 直接调用，因为 apiService 没有这个方法
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL || "http://localhost:8000"
      }/api/v1/thresholds`
    );
    if (!response.ok) {
      throw new Error("Failed to get environment thresholds");
    }
    return response.json();
  },

  // 健康检查
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    version: string;
    service: string;
  }> {
    // 使用 fetch 直接调用，因为 apiService 没有这个方法
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/health`
    );
    if (!response.ok) {
      throw new Error("Health check failed");
    }
    return response.json();
  },
};
