// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role: UserRole;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at?: string;
  last_login?: string;
}

export enum UserRole {
  ADMIN = "admin",
  OPERATOR = "operator",
  VIEWER = "viewer",
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  role: UserRole;
  is_active: boolean;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  password?: string;
  full_name?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// 煤矿相关类型
export interface Mine {
  id: number;
  name: string;
  location?: string;
  depth?: number;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface MineCreate {
  name: string;
  location?: string;
  depth?: number;
  status: string;
}

export interface MineUpdate {
  name?: string;
  location?: string;
  depth?: number;
  status?: string;
}

// 监控点相关类型
export interface MonitoringPoint {
  id: number;
  mine_id: number;
  name: string;
  location?: string;
  camera_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface MonitoringPointCreate {
  mine_id: number;
  name: string;
  location?: string;
  camera_id?: string;
  is_active: boolean;
}

export interface MonitoringPointUpdate {
  name?: string;
  location?: string;
  camera_id?: string;
  is_active?: boolean;
}

// 报警相关类型
export interface Alert {
  id: number;
  monitoring_point_id: number;
  alert_type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  description?: string;
  detected_at: string;
  acknowledged_at?: string;
  acknowledged_by?: number;
  resolved_at?: string;
  resolved_by?: number;
  confidence_score?: number;
  image_url?: string;
  video_url?: string;
  location_details?: string;
  equipment_id?: string;
  notes?: string;
}

export enum AlertStatus {
  ACTIVE = "active",
  ACKNOWLEDGED = "acknowledged",
  RESOLVED = "resolved",
  FALSE_ALARM = "false_alarm",
}

export enum AlertSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum AlertType {
  DANGEROUS_ACTION = "dangerous_action",
  EQUIPMENT_FAILURE = "equipment_failure",
  ENVIRONMENTAL_HAZARD = "environmental_hazard",
  SAFETY_VIOLATION = "safety_violation",
  SYSTEM_ERROR = "system_error",
}

export interface AlertCreate {
  monitoring_point_id: number;
  alert_type: AlertType;
  severity: AlertSeverity;
  title: string;
  description?: string;
  confidence_score?: number;
  image_url?: string;
  video_url?: string;
  location_details?: string;
  equipment_id?: string;
  notes?: string;
}

export interface AlertUpdate {
  status?: AlertStatus;
  title?: string;
  description?: string;
  notes?: string;
  image_url?: string;
  video_url?: string;
}

export interface AlertWithDetails extends Alert {
  monitoring_point?: MonitoringPoint;
  acknowledged_by_user?: User;
  resolved_by_user?: User;
}

export interface AlertSummary {
  total_alerts: number;
  active_alerts: number;
  critical_alerts: number;
  alerts_by_severity: Record<string, number>;
  recent_alerts: Alert[];
}

// 环境数据相关类型
export interface EnvironmentData {
  id: number;
  monitoring_point_id: number;
  methane_concentration?: number;
  carbon_monoxide?: number;
  carbon_dioxide?: number;
  oxygen_concentration?: number;
  hydrogen_sulfide?: number;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  air_flow?: number;
  dust_concentration?: number;
  ventilation_status?: boolean;
  emergency_system_status?: boolean;
  recorded_at: string;
}

export interface EnvironmentDataCreate {
  monitoring_point_id: number;
  methane_concentration?: number;
  carbon_monoxide?: number;
  carbon_dioxide?: number;
  oxygen_concentration?: number;
  hydrogen_sulfide?: number;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  air_flow?: number;
  dust_concentration?: number;
  ventilation_status?: boolean;
  emergency_system_status?: boolean;
}

export interface EnvironmentDataUpdate {
  methane_concentration?: number;
  carbon_monoxide?: number;
  carbon_dioxide?: number;
  oxygen_concentration?: number;
  hydrogen_sulfide?: number;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  air_flow?: number;
  dust_concentration?: number;
  ventilation_status?: boolean;
  emergency_system_status?: boolean;
}

// 设备相关类型
export interface Equipment {
  id: number;
  mine_id: number;
  name: string;
  equipment_type: string;
  model?: string;
  serial_number?: string;
  manufacturer?: string;
  installation_date?: string;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  status: string;
  location?: string;
  specifications?: string;
  operating_hours: number;
  efficiency_rating?: number;
  power_consumption?: number;
  temperature_threshold?: number;
  vibration_threshold?: number;
  created_at: string;
  updated_at?: string;
}

export interface EquipmentCreate {
  mine_id: number;
  name: string;
  equipment_type: string;
  model?: string;
  serial_number?: string;
  manufacturer?: string;
  installation_date?: string;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  status: string;
  location?: string;
  specifications?: string;
  operating_hours: number;
  efficiency_rating?: number;
  power_consumption?: number;
  temperature_threshold?: number;
  vibration_threshold?: number;
}

export interface EquipmentUpdate {
  name?: string;
  equipment_type?: string;
  model?: string;
  serial_number?: string;
  manufacturer?: string;
  installation_date?: string;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  status?: string;
  location?: string;
  specifications?: string;
  operating_hours?: number;
  efficiency_rating?: number;
  power_consumption?: number;
  temperature_threshold?: number;
  vibration_threshold?: number;
}

// 维护记录相关类型
export interface MaintenanceRecord {
  id: number;
  equipment_id: number;
  maintenance_type: string;
  description: string;
  performed_by?: string;
  start_time: string;
  end_time?: string;
  duration_hours?: number;
  cost?: number;
  parts_replaced?: string;
  findings?: string;
  recommendations?: string;
  status: string;
  created_at: string;
}

export interface MaintenanceRecordCreate {
  equipment_id: number;
  maintenance_type: string;
  description: string;
  performed_by?: string;
  start_time: string;
  end_time?: string;
  duration_hours?: number;
  cost?: number;
  parts_replaced?: string;
  findings?: string;
  recommendations?: string;
  status: string;
}

export interface MaintenanceRecordUpdate {
  maintenance_type?: string;
  description?: string;
  performed_by?: string;
  start_time?: string;
  end_time?: string;
  duration_hours?: number;
  cost?: number;
  parts_replaced?: string;
  findings?: string;
  recommendations?: string;
  status?: string;
}

// API响应类型
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// 统计数据类型
export interface EnvironmentStatistics {
  count: number;
  time_range: {
    start: string;
    end: string;
  };
  [key: string]:
    | {
        min: number;
        max: number;
        avg: number;
        count: number;
      }
    | any;
}

export interface EquipmentStatistics {
  total_equipment: number;
  operational_equipment: number;
  maintenance_equipment: number;
  offline_equipment: number;
  operational_rate: number;
  average_efficiency: number;
  total_operating_hours: number;
}

export interface MaintenanceStatistics {
  total_records: number;
  completed_records: number;
  in_progress_records: number;
  scheduled_records: number;
  completion_rate: number;
  total_cost: number;
  total_duration: number;
  average_cost: number;
  average_duration: number;
  type_statistics: Record<
    string,
    {
      count: number;
      cost: number;
      duration: number;
    }
  >;
}

// 趋势数据类型
export interface TrendData {
  timestamp: string;
  value: number;
}

export interface EnvironmentTrends {
  monitoring_point_id: number;
  field: string;
  hours: number;
  data_points: number;
  trends: TrendData[];
}

// 仪表板数据类型
export interface DashboardData {
  total_mines: number;
  total_monitoring_points: number;
  active_alerts: number;
  critical_alerts: number;
  operational_equipment: number;
  maintenance_equipment: number;
  recent_alerts: Alert[];
  environment_summary: EnvironmentStatistics;
  equipment_summary: EquipmentStatistics;
}
