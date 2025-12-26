import React, { useState, useEffect } from 'react';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analysis/stats/summary');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!stats) return <div>No data available</div>;

  return (
    <div className="analytics">
      <h2>Analytics Dashboard</h2>

      <div className="stat-card">
        <h3>Total Analyses</h3>
        <p className="stat-value">{stats.totalAnalyses}</p>
      </div>

      <div className="stats-section">
        <h3>Crop Statistics</h3>
        <div className="stats-grid">
          {stats.cropStats && stats.cropStats.map((crop, idx) => (
            <div key={idx} className="stat-card">
              <h4>{crop._id || 'Unknown'}</h4>
              <p>Count: <strong>{crop.count}</strong></p>
              <p>Avg Production: <strong>{crop.avgProduction?.toFixed(2) || 'N/A'} kg</strong></p>
              <p>Avg Temp: <strong>{crop.avgTemp?.toFixed(2) || 'N/A'}°C</strong></p>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-section">
        <h3>Disease Statistics</h3>
        <div className="stats-grid">
          {stats.diseaseStats && stats.diseaseStats.map((disease, idx) => (
            <div key={idx} className="stat-card">
              <h4>{disease._id || 'None'}</h4>
              <p>Cases: <strong>{disease.count}</strong></p>
            </div>
          ))}
        </div>
      </div>

      <button onClick={fetchStats} className="btn btn-secondary">
        Refresh Statistics
      </button>
    </div>
  );
};

export default Analytics;
