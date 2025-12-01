import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import OverlaySelector from './components/OverlaySelector';
import Settings from './components/Settings';
import { AppSettings } from './types';
import { DEFAULT_MODEL } from './constants';

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    modelName: DEFAULT_MODEL,
    enableNotifications: true,
    theme: 'dark'
  });

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard settings={settings} />} />
          <Route path="/overlay" element={<OverlaySelector />} />
          <Route 
            path="/settings" 
            element={
              <Settings 
                currentSettings={settings} 
                onSave={setSettings} 
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
