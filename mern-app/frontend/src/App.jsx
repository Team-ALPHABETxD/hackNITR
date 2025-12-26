import React, { useState } from 'react';
import AnalysisForm from './components/AnalysisForm';
import AnalysisList from './components/AnalysisList';
import Analytics from './components/Analytics';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('list');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAnalysisSubmit = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('list');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🌾 HackNITR Crop Analysis System</h1>
        <p>AI-Powered Agricultural Decision Support</p>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          📋 View Analyses
        </button>
        <button
          className={`nav-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          ➕ New Analysis
        </button>
        <button
          className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'list' && (
          <AnalysisList key={refreshKey} />
        )}
        {activeTab === 'form' && (
          <AnalysisForm onSubmit={handleAnalysisSubmit} />
        )}
        {activeTab === 'analytics' && (
          <Analytics />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 HackNITR. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
