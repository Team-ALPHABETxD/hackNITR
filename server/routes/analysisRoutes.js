const express = require('express');
const router = express.Router();
const CropAnalysis = require('../models/CropAnalysis');

// @route   POST /api/analysis
// @desc    Create a new crop analysis
// @access  Public
router.post('/', async (req, res) => {
  try {
    const analysisData = req.body;

    // Validate required fields
    if (!analysisData.crop_details || !analysisData.validated || 
        !analysisData.weather_details || !analysisData.disease_details || 
        !analysisData.plan) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // Create new analysis document
    const analysis = new CropAnalysis(analysisData);
    await analysis.save();

    res.status(201).json({
      success: true,
      message: 'Analysis created successfully',
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   GET /api/analysis
// @desc    Get all crop analyses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { crop, limit = 10, skip = 0 } = req.query;
    
    let query = {};
    if (crop) {
      query['crop_details.crop'] = crop;
    }

    const analyses = await CropAnalysis.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    const total = await CropAnalysis.countDocuments(query);

    res.json({
      success: true,
      data: analyses,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   GET /api/analysis/:id
// @desc    Get a specific crop analysis by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const analysis = await CropAnalysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   PUT /api/analysis/:id
// @desc    Update a crop analysis
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    let analysis = await CropAnalysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }

    // Update fields
    analysis = await CropAnalysis.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Analysis updated successfully',
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   DELETE /api/analysis/:id
// @desc    Delete a crop analysis
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const analysis = await CropAnalysis.findByIdAndDelete(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      message: 'Analysis deleted successfully',
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// @route   GET /api/analysis/stats/summary
// @desc    Get summary statistics
// @access  Public
router.get('/stats/summary', async (req, res) => {
  try {
    const totalAnalyses = await CropAnalysis.countDocuments();
    
    const cropStats = await CropAnalysis.aggregate([
      {
        $group: {
          _id: '$crop_details.crop',
          count: { $sum: 1 },
          avgProduction: { $avg: '$crop_details.estimated_production' },
          avgTemp: { $avg: '$weather_details.temp' }
        }
      }
    ]);

    const diseaseStats = await CropAnalysis.aggregate([
      {
        $group: {
          _id: '$disease_details.name',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalAnalyses,
        cropStats,
        diseaseStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
