const express = require('express');
const router = express.Router();
const NGO = require('../models/NGO');
const { authenticate, requireRole } = require('../middleware/auth');
const connectRedis = require('../redis');
const User = require('../models/User');



const redis = connectRedis()

// Create NGO (admin only)
router.post('/create', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { name, description, services, contact, address, location, serviceRadiusKm, availability, verified } = req.body;
    if (!name || !location || !lat || !lon) return res.status(400).json({ success: false, error: 'Missing required fields: name and location.coordinates [lon, lat]' });

    const ngo = new NGO({ name, description, services, contact, address, location, serviceRadiusKm, availability, verified });
    await ngo.save();

    const isSucc = await redis.geoadd("ngos", lon, lat, name)
    console.log(`Pushed to redis: ${isSucc}`)

    res.status(201).json({ success: true, data: ngo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch nearby ngos
router.get('/nearby', authenticate, async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId)
    const lat = user.lat
    const lon = user.lon

    const radius = 200
    const data = await redis.geosearch(
            "ngos",
            "FROMLONLAT",
            lon,        
            lat,
            "BYRADIUS",
            radius,
            "km",
            "WITHDIST",
            "COUNT",
            5
    )
    console.log(data)
    return res.status(200).json({data: data})
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Update NGO (admin only)
router.put('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!ngo) return res.status(404).json({ success: false, error: 'NGO not found' });
    res.json({ success: true, data: ngo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete NGO (admin only)
router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndDelete(req.params.id);
    if (!ngo) return res.status(404).json({ success: false, error: 'NGO not found' });
    res.json({ success: true, message: 'NGO deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch NGOs with optional filters: ?service=..., ?availability=true/false, ?lat=..&lon=..&radiusKm=..
router.get('/', async (req, res) => {
  try {
    const { service, availability, lat, lon, radiusKm = 50, limit = 50, skip = 0 } = req.query;

    const query = {};
    if (service) query.services = { $in: [service] };
    if (typeof availability !== 'undefined') query.availability = availability === 'true';

    let ngos;
    if (lat && lon) {
      const distanceMeters = Number(radiusKm) * 1000;
      ngos = await NGO.find({
        ...query,
        location: {
          $nearSphere: {
            $geometry: { type: 'Point', coordinates: [Number(lon), Number(lat)] },
            $maxDistance: distanceMeters
          }
        }
      }).limit(parseInt(limit)).skip(parseInt(skip));
    } else {
      ngos = await NGO.find(query).limit(parseInt(limit)).skip(parseInt(skip));
    }

    res.json({ success: true, data: ngos });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single NGO
router.get('/:id', async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    if (!ngo) return res.status(404).json({ success: false, error: 'NGO not found' });
    res.json({ success: true, data: ngo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;