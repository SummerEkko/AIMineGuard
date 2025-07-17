import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useMines } from "../hooks/useMines";
import { useAlerts } from "../hooks/useAlerts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { mines, loading: minesLoading } = useMines();
  const { alerts, loading: alertsLoading } = useAlerts();

  const [stats, setStats] = useState({
    totalMines: 0,
    activeAlerts: 0,
    criticalAlerts: 0,
    totalEquipment: 0,
  });

  useEffect(() => {
    if (mines && alerts) {
      const activeAlerts = alerts.filter((alert) => alert.status === "active");
      const criticalAlerts = alerts.filter(
        (alert) => alert.severity === "critical"
      );

      setStats({
        totalMines: mines.length,
        activeAlerts: activeAlerts.length,
        criticalAlerts: criticalAlerts.length,
        totalEquipment: mines.reduce(
          (sum, mine) => sum + (mine.equipment_count || 0),
          0
        ),
      });
    }
  }, [mines, alerts]);

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: "系统管理员",
      manager: "管理员",
      operator: "操作员",
    };
    return roleMap[role] || role;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AI Mine Guard
              </h1>
              <p className="text-gray-600">智能矿山危险动作识别报警系统</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                欢迎，{user?.full_name} ({getRoleDisplayName(user?.role || "")})
              </span>
              <Button variant="ghost" size="sm">
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总矿山数</CardTitle>
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMines}</div>
              <p className="text-xs text-muted-foreground">活跃矿山数量</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">活跃警报</CardTitle>
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
              <div className="text-2xl font-bold">{stats.activeAlerts}</div>
              <p className="text-xs text-muted-foreground">需要处理的警报</p>
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
                {stats.criticalAlerts}
              </div>
              <p className="text-xs text-muted-foreground">紧急处理警报</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">设备总数</CardTitle>
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
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEquipment}</div>
              <p className="text-xs text-muted-foreground">监控设备数量</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>矿山管理</CardTitle>
              <CardDescription>查看和管理所有矿山信息</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/mines">
                <Button className="w-full">查看矿山</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>警报监控</CardTitle>
              <CardDescription>实时监控和处理警报信息</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/alerts">
                <Button className="w-full">查看警报</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>环境数据</CardTitle>
              <CardDescription>查看环境监测数据</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/environment">
                <Button className="w-full">查看数据</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>设备管理</CardTitle>
              <CardDescription>管理监控设备和维护记录</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/equipment">
                <Button className="w-full">管理设备</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>维护记录</CardTitle>
              <CardDescription>查看设备维护历史</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/maintenance">
                <Button className="w-full">查看记录</Button>
              </Link>
            </CardContent>
          </Card>

          {user?.role === "admin" && (
            <Card>
              <CardHeader>
                <CardTitle>用户管理</CardTitle>
                <CardDescription>管理系统用户和权限</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/users">
                  <Button className="w-full">管理用户</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>最近警报</CardTitle>
            <CardDescription>最新的警报信息</CardDescription>
          </CardHeader>
          <CardContent>
            {alertsLoading ? (
              <div className="text-center py-4">加载中...</div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-4 text-gray-500">暂无警报</div>
            ) : (
              <div className="space-y-4">
                {alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm text-gray-600">
                        {alert.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          alert.severity === "critical"
                            ? "bg-red-100 text-red-800"
                            : alert.severity === "high"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {alert.severity === "critical"
                          ? "严重"
                          : alert.severity === "high"
                          ? "高"
                          : "中"}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          alert.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {alert.status === "active" ? "活跃" : "已处理"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
