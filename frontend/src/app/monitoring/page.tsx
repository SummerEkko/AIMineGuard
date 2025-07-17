"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mineService } from "@/services/mineService";
import { systemService } from "@/services/systemService";
import { Mine, MonitoringPoint } from "@/types";

export default function MonitoringPage() {
  const [mines, setMines] = useState<Mine[]>([]);
  const [selectedMine, setSelectedMine] = useState<Mine | null>(null);
  const [monitoringPoints, setMonitoringPoints] = useState<MonitoringPoint[]>(
    []
  );
  const [selectedPoint, setSelectedPoint] = useState<MonitoringPoint | null>(
    null
  );
  const [environmentData, setEnvironmentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      if (data.length > 0) {
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
      if (data.length > 0) {
        setSelectedPoint(data[0]);
        loadEnvironmentData(data[0].id);
      }
    } catch (error) {
      console.error("加载监控点失败:", error);
    }
  };

  const loadEnvironmentData = async (pointId: number) => {
    try {
      // 模拟环境数据
      const mockData = {
        methane_concentration: Math.random() * 2.0,
        carbon_monoxide: Math.random() * 50,
        temperature: 20 + Math.random() * 15,
        humidity: 40 + Math.random() * 40,
        pressure: 101.3 + Math.random() * 2,
        oxygen_level: 20 + Math.random() * 2,
        recorded_at: new Date().toISOString(),
      };
      setEnvironmentData(mockData);
    } catch (error) {
      console.error("加载环境数据失败:", error);
    }
  };

  const handleMineSelect = (mine: Mine) => {
    setSelectedMine(mine);
    loadMonitoringPoints(mine.id);
  };

  const handlePointSelect = (point: MonitoringPoint) => {
    setSelectedPoint(point);
    loadEnvironmentData(point.id);
  };

  const getMethaneStatus = (value: number) => {
    if (value >= 5.0)
      return { status: "CRITICAL", color: "text-red-600", bg: "bg-red-100" };
    if (value >= 2.0)
      return {
        status: "DANGER",
        color: "text-orange-600",
        bg: "bg-orange-100",
      };
    if (value >= 1.0)
      return {
        status: "WARNING",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
      };
    return { status: "NORMAL", color: "text-green-600", bg: "bg-green-100" };
  };

  const getTemperatureStatus = (value: number) => {
    if (value < 15 || value > 35)
      return {
        status: "WARNING",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
      };
    return { status: "NORMAL", color: "text-green-600", bg: "bg-green-100" };
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
              <h1 className="text-xl font-semibold text-gray-900">实时监控</h1>
            </div>
            <div className="flex items-center space-x-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 侧边栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 矿井选择 */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                选择矿井
              </h3>
              <div className="space-y-2">
                {mines.map((mine) => (
                  <button
                    key={mine.id}
                    onClick={() => handleMineSelect(mine)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedMine?.id === mine.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900">{mine.name}</div>
                    <div className="text-sm text-gray-500">{mine.location}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 监控点选择 */}
            {selectedMine && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  监控点
                </h3>
                <div className="space-y-2">
                  {monitoringPoints.map((point) => (
                    <button
                      key={point.id}
                      onClick={() => handlePointSelect(point)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedPoint?.id === point.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-medium text-gray-900">
                        {point.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {point.location}
                      </div>
                      <div className="text-xs text-gray-400">
                        摄像头: {point.camera_id}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 主要内容 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 视频监控 */}
            {selectedPoint && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedPoint.name} - 实时监控
                  </h3>
                </div>
                <div className="p-6">
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <svg
                        className="w-16 h-16 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <p>摄像头 {selectedPoint.camera_id}</p>
                      <p className="text-sm">实时视频流</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 环境数据 */}
            {environmentData && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    环境参数
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {/* 甲烷浓度 */}
                    <div className="text-center">
                      <div
                        className={`p-4 rounded-lg ${
                          getMethaneStatus(
                            environmentData.methane_concentration
                          ).bg
                        }`}
                      >
                        <div
                          className={`text-2xl font-bold ${
                            getMethaneStatus(
                              environmentData.methane_concentration
                            ).color
                          }`}
                        >
                          {environmentData.methane_concentration.toFixed(2)}%
                        </div>
                        <div className="text-sm text-gray-600">甲烷浓度</div>
                        <div
                          className={`text-xs font-medium ${
                            getMethaneStatus(
                              environmentData.methane_concentration
                            ).color
                          }`}
                        >
                          {
                            getMethaneStatus(
                              environmentData.methane_concentration
                            ).status
                          }
                        </div>
                      </div>
                    </div>

                    {/* 温度 */}
                    <div className="text-center">
                      <div
                        className={`p-4 rounded-lg ${
                          getTemperatureStatus(environmentData.temperature).bg
                        }`}
                      >
                        <div
                          className={`text-2xl font-bold ${
                            getTemperatureStatus(environmentData.temperature)
                              .color
                          }`}
                        >
                          {environmentData.temperature.toFixed(1)}°C
                        </div>
                        <div className="text-sm text-gray-600">温度</div>
                        <div
                          className={`text-xs font-medium ${
                            getTemperatureStatus(environmentData.temperature)
                              .color
                          }`}
                        >
                          {
                            getTemperatureStatus(environmentData.temperature)
                              .status
                          }
                        </div>
                      </div>
                    </div>

                    {/* 湿度 */}
                    <div className="text-center">
                      <div className="p-4 rounded-lg bg-blue-100">
                        <div className="text-2xl font-bold text-blue-600">
                          {environmentData.humidity.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">湿度</div>
                        <div className="text-xs font-medium text-blue-600">
                          NORMAL
                        </div>
                      </div>
                    </div>

                    {/* 一氧化碳 */}
                    <div className="text-center">
                      <div className="p-4 rounded-lg bg-orange-100">
                        <div className="text-2xl font-bold text-orange-600">
                          {environmentData.carbon_monoxide.toFixed(1)}ppm
                        </div>
                        <div className="text-sm text-gray-600">一氧化碳</div>
                        <div className="text-xs font-medium text-orange-600">
                          MONITORING
                        </div>
                      </div>
                    </div>

                    {/* 氧气浓度 */}
                    <div className="text-center">
                      <div className="p-4 rounded-lg bg-green-100">
                        <div className="text-2xl font-bold text-green-600">
                          {environmentData.oxygen_level.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600">氧气浓度</div>
                        <div className="text-xs font-medium text-green-600">
                          NORMAL
                        </div>
                      </div>
                    </div>

                    {/* 气压 */}
                    <div className="text-center">
                      <div className="p-4 rounded-lg bg-purple-100">
                        <div className="text-2xl font-bold text-purple-600">
                          {environmentData.pressure.toFixed(1)}kPa
                        </div>
                        <div className="text-sm text-gray-600">气压</div>
                        <div className="text-xs font-medium text-purple-600">
                          NORMAL
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center text-sm text-gray-500">
                    最后更新:{" "}
                    {new Date(environmentData.recorded_at).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* AI检测状态 */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  AI检测状态
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <h4 className="font-medium text-green-900">人员检测</h4>
                        <p className="text-sm text-green-700">正常运行中</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <h4 className="font-medium text-green-900">
                          危险动作识别
                        </h4>
                        <p className="text-sm text-green-700">正常运行中</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <h4 className="font-medium text-green-900">
                          环境异常检测
                        </h4>
                        <p className="text-sm text-green-700">正常运行中</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <h4 className="font-medium text-green-900">
                          设备状态监控
                        </h4>
                        <p className="text-sm text-green-700">正常运行中</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
