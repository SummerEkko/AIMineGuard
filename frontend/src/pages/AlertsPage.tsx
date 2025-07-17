import React, { useState } from "react";
import { useAlerts } from "../hooks/useAlerts";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Alert } from "../types";

export const AlertsPage: React.FC = () => {
  const { alerts, loading, error, updateAlert, deleteAlert } = useAlerts();
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");

  const handleStatusChange = async (
    alertId: number,
    status: "active" | "resolved"
  ) => {
    try {
      await updateAlert(alertId, { status });
    } catch (err) {
      // 错误已在hook中处理
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("确定要删除这个警报吗？")) {
      try {
        await deleteAlert(id);
      } catch (err) {
        // 错误已在hook中处理
      }
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "critical":
        return "严重";
      case "high":
        return "高";
      case "medium":
        return "中";
      case "low":
        return "低";
      default:
        return severity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "resolved":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "活跃";
      case "resolved":
        return "已解决";
      default:
        return status;
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true;
    return alert.status === filter;
  });

  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === "critical" && alert.status === "active"
  );
  const activeAlerts = alerts.filter((alert) => alert.status === "active");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">警报管理</h1>
            <div className="flex space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <option value="all">全部警报</option>
                <option value="active">活跃警报</option>
                <option value="resolved">已解决警报</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总警报数</CardTitle>
                <svg
                  className="h-4 w-4 text-muted-foreground"
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
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{alerts.length}</div>
                <p className="text-xs text-muted-foreground">所有警报</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">活跃警报</CardTitle>
                <svg
                  className="h-4 w-4 text-green-500"
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
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {activeAlerts.length}
                </div>
                <p className="text-xs text-muted-foreground">需要处理</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">严重警报</CardTitle>
                <svg
                  className="h-4 w-4 text-red-500"
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
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {criticalAlerts.length}
                </div>
                <p className="text-xs text-muted-foreground">紧急处理</p>
              </CardContent>
            </Card>
          </div>

          {/* Alerts List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">加载中...</div>
            ) : filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {filter === "all"
                  ? "暂无警报数据"
                  : `暂无${filter === "active" ? "活跃" : "已解决"}警报`}
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`border-l-4 ${
                    getSeverityColor(alert.severity).split(" ")[0]
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <CardDescription>
                          矿山: {alert.mine?.name || "未知"} | 监测点:{" "}
                          {alert.monitoring_point?.name || "未知"}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(
                            alert.severity
                          )}`}
                        >
                          {getSeverityText(alert.severity)}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            alert.status
                          )}`}
                        >
                          {getStatusText(alert.status)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        {alert.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">警报类型:</span>
                          <span className="ml-2 font-medium">
                            {alert.alert_type}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">创建时间:</span>
                          <span className="ml-2">
                            {new Date(alert.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">更新时间:</span>
                          <span className="ml-2">
                            {new Date(alert.updated_at).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {alert.resolution_notes && (
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm font-medium text-gray-700">
                            处理备注:
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {alert.resolution_notes}
                          </p>
                        </div>
                      )}

                      <div className="flex space-x-2 pt-2">
                        {alert.status === "active" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              handleStatusChange(alert.id, "resolved")
                            }
                          >
                            标记为已解决
                          </Button>
                        )}
                        {alert.status === "resolved" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              handleStatusChange(alert.id, "active")
                            }
                          >
                            重新激活
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(alert.id)}
                        >
                          删除
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
