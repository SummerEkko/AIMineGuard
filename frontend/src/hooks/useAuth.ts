import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import apiService from "../services/api";
import { User, UserLogin, UserCreate } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 从localStorage恢复token和用户信息
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      apiService.setAuthToken(savedToken);
    }

    setLoading(false);
  }, []);

  const login = async (credentials: UserLogin) => {
    try {
      setLoading(true);
      setError(null);

      const tokenResponse = await apiService.login(credentials);

      setToken(tokenResponse.access_token);
      // 登录后需要获取用户信息
      const userResponse = await apiService.testToken();
      setUser(userResponse);

      localStorage.setItem("token", tokenResponse.access_token);
      localStorage.setItem("user", JSON.stringify(userResponse));

      apiService.setAuthToken(tokenResponse.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: UserCreate) => {
    try {
      setLoading(true);
      setError(null);

      const userResponse = await apiService.register(userData);

      // 注册成功后需要登录获取token
      const loginResponse = await apiService.login({
        username: userData.username,
        password: userData.password,
      });

      setToken(loginResponse.access_token);
      setUser(userResponse);

      localStorage.setItem("token", loginResponse.access_token);
      localStorage.setItem("user", JSON.stringify(userResponse));

      apiService.setAuthToken(loginResponse.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "注册失败");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    apiService.setAuthToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    error,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};
