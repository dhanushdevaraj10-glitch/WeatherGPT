import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/appStore';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { Layout } from './components/layout/Layout';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { Forecast } from './pages/Forecast';
import { Map } from './pages/Map';
import { Risk } from './pages/Risk';
import { Climate } from './pages/Climate';
import { Compare } from './pages/Compare';
import { Verification } from './pages/Verification';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Alerts } from './pages/Alerts';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="chat" element={<Chat />} />
              <Route path="forecast" element={<Forecast />} />
              <Route path="map" element={<Map />} />
              <Route path="risk" element={<Risk />} />
              <Route path="climate" element={<Climate />} />
              <Route path="compare" element={<Compare />} />
              <Route path="verification" element={<Verification />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
