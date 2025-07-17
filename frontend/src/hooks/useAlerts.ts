import { useState, useEffect } from "react";
import apiService from "../services/api";
import { Alert, CreateAlertRequest, UpdateAlertRequest } from "../types";

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAlerts();
      setAlerts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取警报列表失败");
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async (alertData: CreateAlertRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newAlert = await apiService.createAlert(alertData);
      setAlerts((prev) => [...prev, newAlert]);
      return newAlert;
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建警报失败");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAlert = async (id: number, alertData: UpdateAlertRequest) => {
    try {
      setLoading(true);
      setError(null);
      const updatedAlert = await apiService.updateAlert(id, alertData);
      setAlerts((prev) =>
        prev.map((alert) => (alert.id === id ? updatedAlert : alert))
      );
      return updatedAlert;
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新警报失败");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAlert = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      // Note: apiService doesn't have deleteAlert method, we'll need to implement it
      // For now, we'll just remove from local state
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除警报失败");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAlert = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      return await apiService.getAlertById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取警报详情失败");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAlertsByMine = async (mineId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAlerts({ mine_id: mineId });
      setAlerts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取矿山警报失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return {
    alerts,
    loading,
    error,
    fetchAlerts,
    createAlert,
    updateAlert,
    deleteAlert,
    getAlert,
    getAlertsByMine,
  };
};
