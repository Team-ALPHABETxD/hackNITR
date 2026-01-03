const express = require('express');
const router = express.Router();
const User = require('../models/User');
const NGO = require('../models/NGO');
const { authenticate, requireRole } = require('../middleware/auth');
const mongoose = require('mongoose');

// User sends a request to an NGO
// POST /api/users/requests
router.post('/requests', authenticate, requireRole('user'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { ngoId, type, message } = req.body;
    if (!ngoId || !type) return res.status(400).json({ success: false, error: 'ngoId and type are required' });

    if (!mongoose.Types.ObjectId.isValid(ngoId)) return res.status(400).json({ success: false, error: 'Invalid ngoId' });

    const ngo = await NGO.findById(ngoId);
    if (!ngo) return res.status(404).json({ success: false, error: 'NGO not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    const request = {
      ngo: ngo._id,
      type,
      message: message || '',
      status: 'pending'
    };

    user.requests.push(request);
    await user.save();

    // Return the newly created request (last element)
    const created = user.requests[user.requests.length - 1];
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all requests made by the authenticated user
// GET /api/users/requests
router.get('/requests', authenticate, requireRole(['user', 'ngo', 'admin']), async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('requests.ngo', 'name contact address services');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    res.json({ success: true, data: user.requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin or user fetch requests for given user id
// GET /api/users/:id/requests
router.get('/:id/requests', authenticate, async (req, res) => {
  try {
    const requester = req.user;
    const targetUserId = req.params.id;

    if (requester.role !== 'admin' && requester.id !== targetUserId) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const user = await User.findById(targetUserId).populate('requests.ngo', 'name contact address services');
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    res.json({ success: true, data: user.requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// NGO views requests targeted to them
// GET /api/users/ngo/:ngoId/requests  (NGO user or admin)
router.get('/ngo/:ngoId/requests', authenticate, async (req, res) => {
  try {
    const requester = req.user;
    const ngoId = req.params.ngoId;

    // If the requester is an NGO user, ensure they belong to the same ngo
    if (requester.role === 'ngo') {
      const user = await User.findById(requester.id);
      if (!user || !user.ngo || user.ngo.toString() !== ngoId) return res.status(403).json({ success: false, error: 'Forbidden' });
    } else if (requester.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Find users who have requests with this NGO
    const users = await User.find({ 'requests.ngo': ngoId }).select('name email requests');

    // Flatten requests and include user info
    const requests = [];
    users.forEach(u => {
      u.requests.forEach(r => {
        if (r.ngo.toString() === ngoId) {
          requests.push({ userId: u._id, userName: u.name, userEmail: u.email, request: r });
        }
      });
    });

    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// NGO updates request status
// PATCH /api/users/:userId/requests/:requestId/status
router.patch('/:userId/requests/:requestId/status', authenticate, async (req, res) => {
  try {
    const requester = req.user;
    const { userId, requestId } = req.params;
    const { status } = req.body;

    if (!['pending', 'accepted', 'rejected', 'resolved'].includes(status)) return res.status(400).json({ success: false, error: 'Invalid status' });

    // Find the target user and the request
    const targetUser = await User.findById(userId);
    if (!targetUser) return res.status(404).json({ success: false, error: 'Target user not found' });

    const reqIndex = targetUser.requests.findIndex(r => r._id.toString() === requestId);
    if (reqIndex === -1) return res.status(404).json({ success: false, error: 'Request not found' });

    const targetRequest = targetUser.requests[reqIndex];

    // Check authorization: admin OR NGO that matches request.ngo
    if (requester.role === 'ngo') {
      const user = await User.findById(requester.id);
      if (!user || !user.ngo || user.ngo.toString() !== targetRequest.ngo.toString()) return res.status(403).json({ success: false, error: 'Forbidden' });
    } else if (requester.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Update the embedded request
    targetUser.requests[reqIndex].status = status;
    targetUser.requests[reqIndex].updatedAt = Date.now();

    await targetUser.save();

    res.json({ success: true, data: targetUser.requests[reqIndex] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// user's daily advices
router.get('/advices', authenticate, async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId)
    if(!user) return res.status(401).json({succes: false, msg: "User not found"})
    const advices = user.advices
    return res.status(200).json({ data: advices })
  }
  catch {
    return res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router;