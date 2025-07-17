"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mineService } from "@/services/mineService";
import { Mine, MonitoringPoint } from "@/types";

export default function MinesPage() {
  const [mines, setMines] = useState<Mine[]>([]);
  const [selectedMine, setSelectedMine] = useState<Mine | null>(null);
  const [monitoringPoints, setMonitoringPoints] = useState<MonitoringPoint[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [showAddMine, setShowAddMine] = useState(false);
  const [showAddPoint, setShowAddPoint] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    loadMines();
  }, [router]);

  const loadMines = async () => {
    try {
      const data = await mineService.getMines();
      setMines(data);
      if (data.length > 0 && !selectedMine) {
        setSelectedMine(data[0]);
        loadMonitoringPoints(data[0].id);
      }
    } catch (error) {
      console.error("加载矿井失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMonitoringPoints = async (mineId: number) => {
    try {
      const data = await mineService.getMonitoringPoints(mineId);
      setMonitoringPoints(data);
    } catch (error) {
      console.error("加载监控点失败:", error);
    }
  };

  const handleMineSelect = (mine: Mine) => {
    setSelectedMine(mine);
    loadMonitoringPoints(mine.id);
  };

  const handleAddMine = async (mineData: Partial<Mine>) => {
    try {
      await mineService.createMine(mineData);
      setShowAddMine(false);
      loadMines();
    } catch (error) {
      console.error("添加矿井失败:", error);
    }
  };

  const handleAddMonitoringPoint = async (
    pointData: Partial<MonitoringPoint>
  ) => {
    if (!selectedMine) return;

    try {
      await mineService.createMonitoringPoint({
        ...pointData,
        mine_id: selectedMine.id,
      });
      setShowAddPoint(false);
      loadMonitoringPoints(selectedMine.id);
    } catch (error) {
      console.error("添加监控点失败:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "运行中";
      case "inactive":
        return "停止";
      case "maintenance":
        return "维护中";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">矿井管理</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddMine(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                添加矿井
              </button>
              <span className="text-sm text-gray-500">欢迎，管理员</span>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  router.push("/login");
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 矿井列表 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">矿井列表</h3>
              </div>
              <div className="p-6">
                {mines.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">暂无矿井数据</p>
                ) : (
                  <div className="space-y-3">
                    {mines.map((mine) => (
                      <div
                        key={mine.id}
                        onClick={() => handleMineSelect(mine)}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedMine?.id === mine.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {mine.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {mine.location}
                            </p>
                            <p className="text-sm text-gray-500">
                              深度: {mine.depth}m
                            </p>
                          </div>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              mine.status
                            )}`}
                          >
                            {getStatusText(mine.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 监控点详情 */}
          <div className="lg:col-span-2">
            {selectedMine ? (
              <div className="space-y-6">
                {/* 矿井信息 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {selectedMine.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedMine.location}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        selectedMine.status
                      )}`}
                    >
                      {getStatusText(selectedMine.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900">矿井深度</h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedMine.depth}m
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900">监控点数量</h4>
                      <p className="text-2xl font-bold text-green-600">
                        {monitoringPoints.length}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900">活跃监控点</h4>
                      <p className="text-2xl font-bold text-purple-600">
                        {monitoringPoints.filter((p) => p.is_active).length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 监控点列表 */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        监控点
                      </h3>
                      <button
                        onClick={() => setShowAddPoint(true)}
                        className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                      >
                        添加监控点
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    {monitoringPoints.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        暂无监控点数据
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {monitoringPoints.map((point) => (
                          <div
                            key={point.id}
                            className="p-4 border border-gray-200 rounded-lg"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900">
                                {point.name}
                              </h4>
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  point.is_active
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {point.is_active ? "活跃" : "停用"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                              {point.location}
                            </p>
                            <p className="text-sm text-gray-500">
                              摄像头ID: {point.camera_id}
                            </p>
                            <div className="mt-3 flex space-x-2">
                              <button
                                onClick={() =>
                                  router.push(`/monitoring/${point.id}`)
                                }
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                查看监控
                              </button>
                              <button
                                onClick={() =>
                                  router.push(`/alerts?pointId=${point.id}`)
                                }
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                查看警报
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500 text-center py-8">
                  请选择一个矿井查看详情
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 添加矿井模态框 */}
      {showAddMine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">添加矿井</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddMine({
                  name: formData.get("name") as string,
                  location: formData.get("location") as string,
                  depth: parseFloat(formData.get("depth") as string),
                  status: "active",
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    矿井名称
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    位置
                  </label>
                  <input
                    name="location"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    深度 (米)
                  </label>
                  <input
                    name="depth"
                    type="number"
                    step="0.1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddMine(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 添加监控点模态框 */}
      {showAddPoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              添加监控点
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddMonitoringPoint({
                  name: formData.get("name") as string,
                  location: formData.get("location") as string,
                  camera_id: formData.get("camera_id") as string,
                  is_active: true,
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    监控点名称
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    位置
                  </label>
                  <input
                    name="location"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    摄像头ID
                  </label>
                  <input
                    name="camera_id"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddPoint(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
