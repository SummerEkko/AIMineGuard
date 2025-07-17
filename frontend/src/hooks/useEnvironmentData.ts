import { useState, useEffect } from "react";
import apiService from "../services/api";
import { EnvironmentData, CreateEnvironmentDataRequest } from "../types";

export const useEnvironmentData = () => {
  const [environmentData, setEnvironmentData] = useState<EnvironmentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnvironmentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getEnvironmentData();
      setEnvironmentData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取环境数据失败");
    } finally {
      setLoading(false);
    }
  };

  const createEnvironmentData = async (data: CreateEnvironmentDataRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newData = await apiService.createEnvironmentData(data);
      setEnvironmentData((prev) => [...prev, newData]);
      return newData;
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建环境数据失败");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getEnvironmentDataByMine = async (mineId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getEnvironmentData({ mine_id: mineId });
      setEnvironmentData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取矿山环境数据失败");
    } finally {
      setLoading(false);
    }
  };

  const getEnvironmentDataByMonitoringPoint = async (
    monitoringPointId: number
  ) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getEnvironmentData({
        monitoring_point_id: monitoringPointId,
      });
      setEnvironmentData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取监控点环境数据失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvironmentData();
  }, []);

  return {
    environmentData,
    loading,
    error,
    fetchEnvironmentData,
    createEnvironmentData,
    getEnvironmentDataByMine,
    getEnvironmentDataByMonitoringPoint,
  };
};
