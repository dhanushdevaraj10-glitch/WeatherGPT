import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  AppMode, Location, CurrentWeather, DailyForecast, HourlyForecast, 
  RiskAssessment, ReliabilityDetail, ModelAgreementDetail, ChatMessage, UserProfile 
} from '../types';

interface AppState {
  mode: AppMode;
  selectedLocation: Location | null;
  currentWeather: CurrentWeather | null;
  forecast: { daily: DailyForecast[]; hourly: HourlyForecast[] } | null;
  riskAssessment: RiskAssessment | null;
  reliability: ReliabilityDetail | null;
  modelAgreement: ModelAgreementDetail | null;
  chatMessages: ChatMessage[];
  sessionId: string;
  isLoading: boolean;
  error: string | null;
  userProfile: UserProfile;
}

type Action =
  | { type: 'SET_MODE'; payload: AppMode }
  | { type: 'SET_LOCATION'; payload: Location | null }
  | { type: 'SET_WEATHER'; payload: CurrentWeather | null }
  | { type: 'SET_FORECAST'; payload: { daily: DailyForecast[]; hourly: HourlyForecast[] } | null }
  | { type: 'SET_RISK'; payload: RiskAssessment | null }
  | { type: 'SET_RELIABILITY'; payload: ReliabilityDetail | null }
  | { type: 'SET_MODEL_AGREEMENT'; payload: ModelAgreementDetail | null }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_CHAT_MESSAGES'; payload: ChatMessage[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> };

const defaultProfile: UserProfile = {
  name: 'Guest',
  homeLocation: null,
  category: 'General',
  travelTime: '09:00',
  activities: [],
  savedLocations: []
};

const initialState: AppState = {
  mode: (localStorage.getItem('appMode') as AppMode) || 'live',
  selectedLocation: null,
  currentWeather: null,
  forecast: null,
  riskAssessment: null,
  reliability: null,
  modelAgreement: null,
  chatMessages: [],
  sessionId: crypto.randomUUID(),
  isLoading: false,
  error: null,
  userProfile: defaultProfile
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_MODE':
      localStorage.setItem('appMode', action.payload);
      return { ...state, mode: action.payload };
    case 'SET_LOCATION':
      return { ...state, selectedLocation: action.payload };
    case 'SET_WEATHER':
      return { ...state, currentWeather: action.payload };
    case 'SET_FORECAST':
      return { ...state, forecast: action.payload };
    case 'SET_RISK':
      return { ...state, riskAssessment: action.payload };
    case 'SET_RELIABILITY':
      return { ...state, reliability: action.payload };
    case 'SET_MODEL_AGREEMENT':
      return { ...state, modelAgreement: action.payload };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };
    case 'SET_CHAT_MESSAGES':
      return { ...state, chatMessages: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'UPDATE_PROFILE':
      return { ...state, userProfile: { ...state.userProfile, ...action.payload } };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
