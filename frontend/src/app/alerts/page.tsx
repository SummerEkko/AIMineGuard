"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { alertService } from "@/services/alertService";
import { Alert } from "@/types";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    severity: "",
    status: "",
    mineId: "",
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    loadAlerts();
  }, [router, filter]);

  const loadAlerts = async () => {
    try {
      const data = await alertService.getAlerts(filter);
      setAlerts(data);
    } catch (error) {
      console.error("加载警报失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (alertId: number) => {
    try {
      await alertService.acknowledgeAlert(alertId);
      loadAlerts(); // 重新加载数据
    } catch (error) {
      console.error("确认警报失败:", error);
    }
  };

  const handleResolve = async (alertId: number) => {
    try {
      await alertService.resolveAlert(alertId);
      loadAlerts(); // 重新加载数据
    } catch (error) {
      console.error("解决警报失败:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500 text-white";
      case "HIGH":
        return "bg-orange-500 text-white";
      case "MEDIUM":
        return "bg-yellow-500 text-black";
      case "LOW":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-red-100 text-red-800";
      case "ACKNOWLEDGED":
        return "bg-yellow-100 text-yellow-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "FALSE_ALARM":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "活跃";
      case "ACKNOWLEDGED":
        return "已确认";
      case "RESOLVED":
        return "已解决";
      case "FALSE_ALARM":
        return "误报";
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
              <h1 className="text-xl font-semibold text-gray-900">警报管理</h1>
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
        {/* 筛选器 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">筛选条件</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                严重程度
              </label>
              <select
                value={filter.severity}
                onChange={(e) =>
                  setFilter({ ...filter, severity: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">全部</option>
                <option value="CRITICAL">严重</option>
                <option value="HIGH">高</option>
                <option value="MEDIUM">中</option>
                <option value="LOW">低</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select
                value={filter.status}
                onChange={(e) =>
                  setFilter({ ...filter, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">全部</option>
                <option value="ACTIVE">活跃</option>
                <option value="ACKNOWLEDGED">已确认</option>
                <option value="RESOLVED">已解决</option>
                <option value="FALSE_ALARM">误报</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                矿井
              </label>
              <select
                value={filter.mineId}
                onChange={(e) =>
                  setFilter({ ...filter, mineId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">全部矿井</option>
                <option value="1">示例矿井</option>
              </select>
            </div>
          </div>
        </div>

        {/* 警报列表 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">警报列表</h3>
              <span className="text-sm text-gray-500">
                共 {alerts.length} 条警报
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    警报类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    严重程度
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    位置
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    检测时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alerts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      暂无警报数据
                    </td>
                  </tr>
                ) : (
                  alerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {alert.alert_type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {alert.action_type}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(
                            alert.severity
                          )}`}
                        >
                          {alert.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            alert.status || ""
                          )}`}
                        >
                          {getStatusText(alert.status || "")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {alert.location_description}
                        </div>
                        <div className="text-sm text-gray-500">
                          置信度:{" "}
                          {alert.confidence
                            ? `${(alert.confidence * 100).toFixed(1)}%`
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(alert.detected_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {alert.status === "ACTIVE" && (
                            <>
                              <button
                                onClick={() => handleAcknowledge(alert.id)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                确认
                              </button>
                              <button
                                onClick={() => handleResolve(alert.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                解决
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => router.push(`/alerts/${alert.id}`)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            详情
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 环境参数 */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            环境参数阈值
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-900">甲烷浓度</h4>
              <p className="text-sm text-red-700">
                警告: 1.0% | 危险: 2.0% | 严重: 5.0%
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900">矿井深度</h4>
              <p className="text-sm text-yellow-700">
                警告: 300m | 危险: 500m | 严重: 800m
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">温度</h4>
              <p className="text-sm text-blue-700">正常范围: 15°C - 35°C</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">湿度</h4>
              <p className="text-sm text-green-700">正常范围: 30% - 80%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
