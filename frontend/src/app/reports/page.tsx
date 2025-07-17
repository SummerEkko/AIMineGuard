"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { alertService } from "@/services/alertService";
import { mineService } from "@/services/mineService";

export default function ReportsPage() {
  const [alertStats, setAlertStats] = useState<any>(null);
  const [mineStats, setMineStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    loadReportData();
  }, [router, timeRange]);

  const loadReportData = async () => {
    try {
      // 模拟统计数据
      const mockAlertStats = {
        total_alerts: 156,
        critical_alerts: 12,
        high_alerts: 34,
        medium_alerts: 67,
        low_alerts: 43,
        resolved_alerts: 142,
        active_alerts: 14,
        alerts_by_type: {
          人员危险动作: 45,
          设备异常: 38,
          环境异常: 42,
          甲烷浓度超标: 31,
        },
        alerts_by_mine: {
          示例矿井: 89,
          二号矿井: 67,
        },
        daily_alerts: [
          { date: "2024-01-01", count: 5 },
          { date: "2024-01-02", count: 8 },
          { date: "2024-01-03", count: 3 },
          { date: "2024-01-04", count: 12 },
          { date: "2024-01-05", count: 7 },
          { date: "2024-01-06", count: 9 },
          { date: "2024-01-07", count: 6 },
        ],
      };

      const mockMineStats = {
        total_mines: 2,
        active_mines: 2,
        total_monitoring_points: 8,
        active_monitoring_points: 7,
        average_depth: 450,
        total_cameras: 12,
        environment_data_points: 2847,
      };

      setAlertStats(mockAlertStats);
      setMineStats(mockMineStats);
    } catch (error) {
      console.error("加载报表数据失败:", error);
    } finally {
      setLoading(false);
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
              <h1 className="text-xl font-semibold text-gray-900">报表统计</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="7d">最近7天</option>
                <option value="30d">最近30天</option>
                <option value="90d">最近90天</option>
                <option value="1y">最近1年</option>
              </select>
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
        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">总警报数</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {alertStats?.total_alerts || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">已解决警报</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {alertStats?.resolved_alerts || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">监控点数量</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {mineStats?.total_monitoring_points || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">数据点数量</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {mineStats?.environment_data_points || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 警报类型分布 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                警报类型分布
              </h3>
            </div>
            <div className="p-6">
              {alertStats?.alerts_by_type && (
                <div className="space-y-4">
                  {Object.entries(alertStats.alerts_by_type).map(
                    ([type, count]) => (
                      <div
                        key={type}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {type}
                        </span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${
                                  ((count as number) /
                                    alertStats.total_alerts) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500 w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 警报严重程度分布 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                警报严重程度分布
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">
                      严重
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {alertStats?.critical_alerts || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">
                      高
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {alertStats?.high_alerts || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">
                      中
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {alertStats?.medium_alerts || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">
                      低
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {alertStats?.low_alerts || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 每日警报趋势 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                每日警报趋势
              </h3>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-end justify-between space-x-2">
                {alertStats?.daily_alerts?.map((day: any, index: number) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{
                        height: `${
                          (day.count /
                            Math.max(
                              ...alertStats.daily_alerts.map(
                                (d: any) => d.count
                              )
                            )) *
                          200
                        }px`,
                      }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(day.date).toLocaleDateString("zh-CN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-xs font-medium text-gray-900">
                      {day.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 矿井警报统计 */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                矿井警报统计
              </h3>
            </div>
            <div className="p-6">
              {alertStats?.alerts_by_mine && (
                <div className="space-y-4">
                  {Object.entries(alertStats.alerts_by_mine).map(
                    ([mine, count]) => (
                      <div
                        key={mine}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {mine}
                        </span>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">
                            {count} 条警报
                          </span>
                          <span className="text-xs text-gray-400">
                            {(
                              ((count as number) / alertStats.total_alerts) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 系统性能指标 */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">系统性能指标</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">99.8%</div>
                <div className="text-sm text-gray-500">系统可用性</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">2.3s</div>
                <div className="text-sm text-gray-500">平均响应时间</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">98.5%</div>
                <div className="text-sm text-gray-500">AI识别准确率</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
