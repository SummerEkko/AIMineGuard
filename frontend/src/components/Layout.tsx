"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);

      if (!authenticated) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    authService.logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                AI危险动作识别报警系统
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 侧边栏和主内容区 */}
      <div className="flex">
        {/* 侧边栏 */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              <a
                href="/dashboard"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                仪表板
              </a>
              <a
                href="/mines"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                煤矿管理
              </a>
              <a
                href="/alerts"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                报警管理
              </a>
              <a
                href="/monitoring"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                实时监控
              </a>
              <a
                href="/reports"
                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                报表统计
              </a>
            </div>
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
