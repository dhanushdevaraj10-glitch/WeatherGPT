export interface Location {
  name: string;
  country: string;
  region: string;
  latitude: number;
  longitude: number;
  timezone: string;
  elevation: number;
}

export interface CurrentWeather {
  temperature: number;
  apparent_temp: number;
  precipitation: number;
  precip_probability: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  wind_gusts: number;
  cloud_cover: number;
  visibility: number;
  uv_index: number;
  weather_code: number;
  weather_description: string;
  pressure: number;
  data_status: 'LIVE' | 'CACHED';
  updated_at: string;
  provider: string;
  location: Location;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  apparent_temp: number;
  precipitation: number;
  precip_probability: number;
  humidity: number;
  wind_speed: number;
  wind_gusts: number;
  cloud_cover: number;
  weather_code: number;
  weather_description: string;
}

export interface DailyForecast {
  date: string;
  temp_max: number;
  temp_min: number;
  temp_mean: number;
  precipitation_sum: number;
  precip_probability_max: number;
  wind_speed_max: number;
  wind_gusts_max: number;
  weather_code: number;
  weather_description: string;
  sunrise: string;
  sunset: string;
  uv_index_max: number;
}

export interface WeatherForecastResponse {
  location: Location;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  provider: string;
  generated_at: string;
}

export interface RiskFactor {
  name: string;
  value: string | number;
  unit: string;
  contribution: string;
}

export interface RiskDetail {
  level: 'NORMAL' | 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  score: number;
  factors: RiskFactor[];
  explanation: string;
}

export interface RiskAssessment {
  location: Location;
  rain_risk: RiskDetail;
  heat_risk: RiskDetail;
  wind_risk: RiskDetail;
  storm_risk: RiskDetail;
  travel_risk: RiskDetail;
  outdoor_risk: RiskDetail;
  overall_risk: RiskDetail;
  assessed_at: string;
}

export interface ReliabilityDetail {
  score: number;
  grade: string;
  checks: Array<{name: string; passed: boolean; points: number; max_points: number}>;
  label: string;
}

export interface ModelAgreementDetail {
  agreement: string;
  models_compared: number;
  temperature_spread: number;
  precip_spread: number;
  models: Array<{name: string; temperature: number; precipitation: number; wind_speed: number}>;
  note: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  intent?: string;
  weather_data?: any;
  risk_data?: any;
  sources?: Array<{source: string; type: string; updated_at: string}>;
  timestamp: string;
}

export interface OfficialWarning {
  source: string;
  warning_type: string;
  severity: string;
  issued_at: string;
  valid_from: string;
  valid_to: string;
  description: string;
  is_connected: boolean;
}

export interface VerificationMetrics {
  location: { id: number };
  temp_mae: number | null;
  temp_bias: number | null;
  precip_error: number | null;
  forecast_skill: number | null;
  records_count: number;
  message: string;
}

export type AppMode = 'live' | 'demo';

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  weather_override: Partial<CurrentWeather>;
}

export interface UserProfile {
  name: string;
  homeLocation: Location | null;
  category: string;
  travelTime: string;
  activities: string[];
  savedLocations: Location[];
}
