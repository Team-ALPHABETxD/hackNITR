import React, { useState, useEffect } from 'react';

const AnalysisList = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchAnalyses();
  }, [filter]);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const url = filter 
        ? `http://localhost:5000/api/analysis?crop=${filter}`
        : 'http://localhost:5000/api/analysis';
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setAnalyses(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAnalysis = async (id) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/analysis/${id}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        
        if (result.success) {
          setAnalyses(analyses.filter(a => a._id !== id));
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="loading">Loading analyses...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="analysis-list">
      <div className="filter-section">
        <input
          type="text"
          placeholder="Filter by crop name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="analyses-container">
        {analyses.length === 0 ? (
          <p>No analyses found</p>
        ) : (
          analyses.map((analysis) => (
            <div key={analysis._id} className="analysis-card">
              <div className="card-header">
                <h3>{analysis.crop_details.crop.toUpperCase()}</h3>
                <span className="date">
                  {new Date(analysis.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="card-body">
                <div className="detail-section">
                  <h4>Crop Details</h4>
                  <p>Growth Stage: {analysis.crop_details.growth}</p>
                  <p>Location: ({analysis.crop_details.lat}, {analysis.crop_details.lon})</p>
                  <p>Estimated Production: {analysis.crop_details.estimated_production} kg</p>
                  <p>Storage Available: {analysis.crop_details.storage_availability}</p>
                </div>

                <div className="detail-section">
                  <h4>Weather</h4>
                  <p>Temperature: {analysis.weather_details.temp}°C</p>
                  <p>Humidity: {analysis.weather_details.hum}%</p>
                  <p>Wind Speed: {analysis.weather_details.wind_speed} m/s</p>
                  <p>Conditions: {analysis.weather_details.summary}</p>
                </div>

                <div className="detail-section">
                  <h4>Disease Analysis</h4>
                  <p>Disease: {analysis.disease_details.name}</p>
                  <p>Status: {analysis.disease_details.status}</p>
                  <p>Spoilage Risk: {analysis.disease_details.spoilage_risk}</p>
                  <p>Confidence: {(analysis.disease_details.confidence * 100).toFixed(1)}%</p>
                </div>

                <div className="detail-section">
                  <h4>Recommendation</h4>
                  <p className={`decision ${analysis.plan.decision.toLowerCase()}`}>
                    {analysis.plan.decision}
                  </p>
                  <p>{analysis.plan.reason}</p>
                </div>
              </div>

              <div className="card-footer">
                <button 
                  className="btn btn-delete"
                  onClick={() => deleteAnalysis(analysis._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnalysisList;
