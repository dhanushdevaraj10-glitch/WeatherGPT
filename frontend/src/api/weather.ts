import { client } from './client';
import { CurrentWeather, DailyForecast, HourlyForecast, RiskAssessment, ReliabilityDetail, ModelAgreementDetail, OfficialWarning, VerificationMetrics, WeatherForecastResponse } from '../types';

export const weatherApi = {
  getCurrent: (lat: number, lon: number, locationName?: string) => 
    client.get<CurrentWeather>('/weather/current', { params: { lat, lon, location_name: locationName } }),
    
  getHourly: (lat: number, lon: number, days?: number) => 
    client.get<WeatherForecastResponse>('/weather/hourly', { params: { lat, lon, days } }),
    
  getDaily: (lat: number, lon: number, days?: number) => 
    client.get<WeatherForecastResponse>('/weather/daily', { params: { lat, lon, days } }),
    
  getModels: (lat: number, lon: number) => 
    client.get('/weather/models', { params: { lat, lon } }),
    
  getModelAgreement: (lat: number, lon: number) => 
    client.get<ModelAgreementDetail>('/weather/model-agreement', { params: { lat, lon } }),
    
  searchLocation: (q: string) => 
    client.get('/location/search', { params: { q } }),
    
  reverseGeocode: (lat: number, lon: number) => 
    client.get('/location/reverse', { params: { lat, lon } }),
    
  analyzeRisk: (data: any) => 
    client.post<RiskAssessment>('/risk/analyze', data),
    
  simulateScenario: (data: any) => 
    client.post('/scenario/simulate', data),
    
  getClimateHistory: (lat: number, lon: number, years?: number) => 
    client.get('/climate/history', { params: { lat, lon, years } }),
    
  getClimateTrend: (lat: number, lon: number, years?: number) => 
    client.get('/climate/trend', { params: { lat, lon, years } }),
    
  getClimateMonthly: (lat: number, lon: number, year?: number) => 
    client.get('/climate/monthly', { params: { lat, lon, year } }),
    
  getWarnings: (lat: number, lon: number) => 
    client.get<OfficialWarning[]>('/warnings', { params: { lat, lon } }),
    
  sendChat: (data: any) => 
    client.post('/chat', data),
    
  getChatHistory: (sessionId: string) => 
    client.get(`/chat/sessions/${sessionId}/messages`),
    
  compareLocations: (data: any) => 
    client.post('/locations/compare', data),
    
  getVerificationMetrics: (lat: number, lon: number) => 
    client.get<VerificationMetrics>('/verification/metrics', { params: { lat, lon } }),
    
  createAlert: (data: any) => 
    client.post('/alerts', data),
    
  getAlerts: (sessionId?: string) => 
    client.get('/alerts', { params: { session_id: sessionId } }),
    
  deleteAlert: (id: string) => 
    client.delete(`/alerts/${id}`),
    
  checkAlerts: (lat: number, lon: number) => 
    client.post('/alerts/check', null, { params: { lat, lon } }),
};
