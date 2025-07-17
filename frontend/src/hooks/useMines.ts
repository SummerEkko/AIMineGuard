import { useState, useEffect } from "react";
import apiService from "../services/api";
import { Mine, CreateMineRequest, UpdateMineRequest } from "../types";

export const useMines = () => {
  const [mines, setMines] = useState<Mine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMines = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getMines();
      setMines(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取矿山列表失败");
    } finally {
      setLoading(false);
    }
  };

  const createMine = async (mineData: CreateMineRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newMine = await apiService.createMine(mineData);
      setMines((prev) => [...prev, newMine]);
      return newMine;
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建矿山失败");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMine = async (id: number, mineData: UpdateMineRequest) => {
    try {
      setLoading(true);
      setError(null);
      const updatedMine = await apiService.updateMine(id, mineData);
      setMines((prev) =>
        prev.map((mine) => (mine.id === id ? updatedMine : mine))
      );
      return updatedMine;
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新矿山失败");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMine = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await apiService.deleteMine(id);
      setMines((prev) => prev.filter((mine) => mine.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除矿山失败");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMine = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      return await apiService.getMineById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取矿山详情失败");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMines();
  }, []);

  return {
    mines,
    loading,
    error,
    fetchMines,
    createMine,
    updateMine,
    deleteMine,
    getMine,
  };
};
