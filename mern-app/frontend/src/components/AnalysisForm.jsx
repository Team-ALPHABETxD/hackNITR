import React, { useState } from 'react';

const AnalysisForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    crop_details: {
      crop: '',
      lat: '',
      lon: '',
      growth: 'germination',
      sowing_date: '',
      current_date: '',
      estimated_production: '',
      storage_availability: 'Yes',
      disease_detect: false,
      crop_img: ''
    },
    validated: {
      flag: true,
      reason: 'NONE'
    },
    weather_details: {
      temp: '',
      hum: '',
      wind_speed: '',
      summary: ''
    },
    disease_details: {
      NA: false,
      name: 'None',
      reason: '',
      status: 'none',
      spoilage_risk: 'Low',
      days_to_spoil: 0,
      confidence: 0
    },
    plan: {
      decision: 'Store',
      reason: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setFormData({
          crop_details: {
            crop: '',
            lat: '',
            lon: '',
            growth: 'germination',
            sowing_date: '',
            current_date: '',
            estimated_production: '',
            storage_availability: 'Yes',
            disease_detect: false,
            crop_img: ''
          },
          validated: { flag: true, reason: 'NONE' },
          weather_details: { temp: '', hum: '', wind_speed: '', summary: '' },
          disease_details: {
            NA: false,
            name: 'None',
            reason: '',
            status: 'none',
            spoilage_risk: 'Low',
            days_to_spoil: 0,
            confidence: 0
          },
          plan: { decision: 'Store', reason: '' }
        });
        if (onSubmit) onSubmit();
      } else {
        setError(result.error || 'Failed to submit analysis');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analysis-form">
      <h2>New Crop Analysis</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">Analysis submitted successfully!</div>}

      <form onSubmit={handleSubmit}>
        {/* Crop Details Section */}
        <fieldset>
          <legend>Crop Details</legend>
          <div className="form-group">
            <label>Crop Name</label>
            <input
              type="text"
              value={formData.crop_details.crop}
              onChange={(e) => handleChange('crop_details', 'crop', e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Latitude</label>
              <input
                type="number"
                step="0.01"
                value={formData.crop_details.lat}
                onChange={(e) => handleChange('crop_details', 'lat', parseFloat(e.target.value))}
                required
              />
            </div>
            <div className="form-group">
              <label>Longitude</label>
              <input
                type="number"
                step="0.01"
                value={formData.crop_details.lon}
                onChange={(e) => handleChange('crop_details', 'lon', parseFloat(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Growth Stage</label>
            <select
              value={formData.crop_details.growth}
              onChange={(e) => handleChange('crop_details', 'growth', e.target.value)}
            >
              <option value="germination">Germination</option>
              <option value="growth">Growth</option>
              <option value="flowering">Flowering</option>
              <option value="fruiting">Fruiting</option>
              <option value="harvest">Harvest</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Sowing Date</label>
              <input
                type="date"
                value={formData.crop_details.sowing_date}
                onChange={(e) => handleChange('crop_details', 'sowing_date', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Current Date</label>
              <input
                type="date"
                value={formData.crop_details.current_date}
                onChange={(e) => handleChange('crop_details', 'current_date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Estimated Production (kg)</label>
            <input
              type="number"
              value={formData.crop_details.estimated_production}
              onChange={(e) => handleChange('crop_details', 'estimated_production', parseFloat(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label>Storage Available</label>
            <select
              value={formData.crop_details.storage_availability}
              onChange={(e) => handleChange('crop_details', 'storage_availability', e.target.value)}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.crop_details.disease_detect}
                onChange={(e) => handleChange('crop_details', 'disease_detect', e.target.checked)}
              />
              Disease Detected
            </label>
          </div>

          <div className="form-group">
            <label>Crop Image</label>
            <input
              type="text"
              value={formData.crop_details.crop_img}
              onChange={(e) => handleChange('crop_details', 'crop_img', e.target.value)}
              placeholder="image_filename.jpg"
              required
            />
          </div>
        </fieldset>

        {/* Weather Details Section */}
        <fieldset>
          <legend>Weather Details</legend>
          <div className="form-group">
            <label>Temperature (°C)</label>
            <input
              type="number"
              step="0.01"
              value={formData.weather_details.temp}
              onChange={(e) => handleChange('weather_details', 'temp', parseFloat(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label>Humidity (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.weather_details.hum}
              onChange={(e) => handleChange('weather_details', 'hum', parseFloat(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label>Wind Speed (m/s)</label>
            <input
              type="number"
              step="0.01"
              value={formData.weather_details.wind_speed}
              onChange={(e) => handleChange('weather_details', 'wind_speed', parseFloat(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label>Weather Summary</label>
            <input
              type="text"
              value={formData.weather_details.summary}
              onChange={(e) => handleChange('weather_details', 'summary', e.target.value)}
              placeholder="e.g., overcast clouds"
              required
            />
          </div>
        </fieldset>

        {/* Disease Details Section */}
        <fieldset>
          <legend>Disease Details</legend>
          <div className="form-group">
            <label>Disease Name</label>
            <input
              type="text"
              value={formData.disease_details.name}
              onChange={(e) => handleChange('disease_details', 'name', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Reason</label>
            <textarea
              value={formData.disease_details.reason}
              onChange={(e) => handleChange('disease_details', 'reason', e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.disease_details.status}
              onChange={(e) => handleChange('disease_details', 'status', e.target.value)}
            >
              <option value="none">None</option>
              <option value="present">Present</option>
              <option value="may occur in future">May Occur in Future</option>
              <option value="occurred in past">Occurred in Past</option>
            </select>
          </div>

          <div className="form-group">
            <label>Spoilage Risk</label>
            <select
              value={formData.disease_details.spoilage_risk}
              onChange={(e) => handleChange('disease_details', 'spoilage_risk', e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Days to Spoil</label>
            <input
              type="number"
              min="0"
              value={formData.disease_details.days_to_spoil}
              onChange={(e) => handleChange('disease_details', 'days_to_spoil', parseInt(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Confidence (0-1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={formData.disease_details.confidence}
              onChange={(e) => handleChange('disease_details', 'confidence', parseFloat(e.target.value))}
            />
          </div>
        </fieldset>

        {/* Plan Section */}
        <fieldset>
          <legend>Recommendation Plan</legend>
          <div className="form-group">
            <label>Decision</label>
            <select
              value={formData.plan.decision}
              onChange={(e) => handleChange('plan', 'decision', e.target.value)}
            >
              <option value="Store">Store</option>
              <option value="Sell">Sell</option>
              <option value="Process">Process</option>
              <option value="Discard">Discard</option>
            </select>
          </div>

          <div className="form-group">
            <label>Reason</label>
            <textarea
              value={formData.plan.reason}
              onChange={(e) => handleChange('plan', 'reason', e.target.value)}
              required
            ></textarea>
          </div>
        </fieldset>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Submitting...' : 'Submit Analysis'}
        </button>
      </form>
    </div>
  );
};

export default AnalysisForm;
