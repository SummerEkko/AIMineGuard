import apiService from "./api";
import { User, UserCreate, UserLogin, Token } from "@/types";

export const authService = {
  // 用户登录
  async login(credentials: UserLogin): Promise<Token> {
    return apiService.login(credentials);
  },

  // 用户注册
  async register(userData: UserCreate): Promise<User> {
    return apiService.register(userData);
  },

  // 获取当前用户信息
  async getCurrentUser(): Promise<User> {
    return apiService.testToken();
  },

  // 保存token到localStorage
  saveToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
    }
  },

  // 从localStorage获取token
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  },

  // 清除token
  clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
  },

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // 登出
  logout(): void {
    this.clearToken();
    // 可以在这里添加其他清理逻辑，比如重定向到登录页
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
};
