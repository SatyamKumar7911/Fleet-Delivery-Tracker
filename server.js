const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// ============================================
// FEATURE 0: In-Memory Storage
// ============================================
const deliveries = [];
let deliveryIdCounter = 1;

// ============================================
// DELIVERY MODEL & STATUS CONSTANTS
// ============================================
const DELIVERY_STATUS = {
  CREATED: 'CREATED',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED'
};

const VALID_TRANSITIONS = {
  [DELIVERY_STATUS.CREATED]: [DELIVERY_STATUS.OUT_FOR_DELIVERY],
  [DELIVERY_STATUS.OUT_FOR_DELIVERY]: [DELIVERY_STATUS.DELIVERED],
  [DELIVERY_STATUS.DELIVERED]: []
};

// ============================================
// VALIDATION HELPERS
// ============================================
function validateDelivery(data) {
  const errors = [];

  if (!data.vehicleId || typeof data.vehicleId !== 'string') {
    errors.push('vehicleId is required and must be a string');
  }
  if (!data.location || typeof data.location !== 'string') {
    errors.push('location is required and must be a string');
  }
  if (!data.deliveryDate) {
    errors.push('deliveryDate is required');
  }

  return errors;
}

function isValidStatusTransition(currentStatus, newStatus) {
  return VALID_TRANSITIONS[currentStatus]?.includes(newStatus) || false;
}

function findDeliveryById(id) {
  return deliveries.find(d => d.deliveryId === parseInt(id));
}

// ============================================
// FEATURE 1: CREATE DELIVERY
// ============================================
app.post('/api/deliveries', (req, res) => {
  const { vehicleId, location, deliveryDate } = req.body;

  // Validation
  const errors = validateDelivery({ vehicleId, location, deliveryDate });
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const newDelivery = {
    deliveryId: deliveryIdCounter++,
    vehicleId,
    location,
    status: DELIVERY_STATUS.CREATED,
    deliveryDate: new Date(deliveryDate)
  };

  deliveries.push(newDelivery);

  res.status(201).json({
    success: true,
    message: 'Delivery created successfully',
    delivery: newDelivery
  });
});

// ============================================
// FEATURE 1: LIST ALL DELIVERIES
// ============================================
app.get('/api/deliveries', (req, res) => {
  const sortBy = req.query.sortBy || 'date'; // date or id
  let sortedDeliveries = [...deliveries];

  if (sortBy === 'date') {
    sortedDeliveries.sort((a, b) => new Date(b.deliveryDate) - new Date(a.deliveryDate));
  } else if (sortBy === 'id') {
    sortedDeliveries.sort((a, b) => a.deliveryId - b.deliveryId);
  }

  res.json({
    success: true,
    count: sortedDeliveries.length,
    deliveries: sortedDeliveries
  });
});

// ============================================
// FEATURE 2: UPDATE DELIVERY STATUS
// ============================================
app.put('/api/deliveries/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate delivery ID
  const delivery = findDeliveryById(id);
  if (!delivery) {
    return res.status(404).json({
      success: false,
      message: `Delivery with ID ${id} not found`
    });
  }

  // Validate status
  if (!Object.values(DELIVERY_STATUS).includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${Object.values(DELIVERY_STATUS).join(', ')}`
    });
  }

  // Validate transition
  if (!isValidStatusTransition(delivery.status, status)) {
    return res.status(400).json({
      success: false,
      message: `Cannot transition from ${delivery.status} to ${status}`
    });
  }

  // Update status
  delivery.status = status;

  res.json({
    success: true,
    message: `Delivery status updated to ${status}`,
    delivery
  });
});

// ============================================
// FEATURE 3: GET ACTIVE DELIVERIES
// ============================================
app.get('/api/deliveries/active/list', (req, res) => {
  const activeDeliveries = deliveries.filter(
    d => d.status === DELIVERY_STATUS.OUT_FOR_DELIVERY
  );

  res.json({
    success: true,
    count: activeDeliveries.length,
    deliveries: activeDeliveries
  });
});

// ============================================
// FEATURE 3: GET DELIVERIES BY LOCATION
// ============================================
app.get('/api/deliveries/location/:location', (req, res) => {
  const { location } = req.params;
  const decodedLocation = decodeURIComponent(location);
  
  const filteredDeliveries = deliveries.filter(
    d => d.location.toLowerCase() === decodedLocation.toLowerCase()
  );

  res.json({
    success: true,
    location: decodedLocation,
    count: filteredDeliveries.length,
    deliveries: filteredDeliveries
  });
});

// ============================================
// FEATURE 5: GET SUMMARY
// ============================================
app.get('/api/summary', (req, res) => {
  const summary = {
    totalDeliveries: deliveries.length,
    delivered: deliveries.filter(d => d.status === DELIVERY_STATUS.DELIVERED).length,
    outForDelivery: deliveries.filter(d => d.status === DELIVERY_STATUS.OUT_FOR_DELIVERY).length,
    created: deliveries.filter(d => d.status === DELIVERY_STATUS.CREATED).length,
    pending: deliveries.filter(d => d.status !== DELIVERY_STATUS.DELIVERED).length,
    deliveryRate: deliveries.length > 0 
      ? ((deliveries.filter(d => d.status === DELIVERY_STATUS.DELIVERED).length / deliveries.length) * 100).toFixed(2)
      : 0
  };

  res.json({
    success: true,
    summary
  });
});

// ============================================
// GET SINGLE DELIVERY
// ============================================
app.get('/api/deliveries/:id', (req, res) => {
  const { id } = req.params;
  const delivery = findDeliveryById(id);

  if (!delivery) {
    return res.status(404).json({
      success: false,
      message: `Delivery with ID ${id} not found`
    });
  }

  res.json({
    success: true,
    delivery
  });
});

// ============================================
// DELETE DELIVERY (for testing)
// ============================================
app.delete('/api/deliveries/:id', (req, res) => {
  const { id } = req.params;
  const index = deliveries.findIndex(d => d.deliveryId === parseInt(id));

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Delivery with ID ${id} not found`
    });
  }

  const deletedDelivery = deliveries.splice(index, 1);

  res.json({
    success: true,
    message: 'Delivery deleted successfully',
    delivery: deletedDelivery[0]
  });
});

// ============================================
// SEED DATA (for testing)
// ============================================
app.post('/api/seed', (req, res) => {
  deliveries.length = 0;
  deliveryIdCounter = 1;

  const seedData = [
    { vehicleId: 'VH001', location: 'New York', status: 'CREATED', deliveryDate: new Date('2026-05-12') },
    { vehicleId: 'VH002', location: 'Los Angeles', status: 'OUT_FOR_DELIVERY', deliveryDate: new Date('2026-05-11') },
    { vehicleId: 'VH003', location: 'Chicago', status: 'DELIVERED', deliveryDate: new Date('2026-05-10') },
    { vehicleId: 'VH001', location: 'Boston', status: 'CREATED', deliveryDate: new Date('2026-05-12') },
    { vehicleId: 'VH004', location: 'New York', status: 'OUT_FOR_DELIVERY', deliveryDate: new Date('2026-05-11') }
  ];

  seedData.forEach(data => {
    deliveries.push({
      deliveryId: deliveryIdCounter++,
      vehicleId: data.vehicleId,
      location: data.location,
      status: data.status,
      deliveryDate: data.deliveryDate
    });
  });

  res.json({
    success: true,
    message: 'Seed data loaded',
    count: deliveries.length
  });
});

// ============================================
// SERVE DASHBOARD
// ============================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Delivery Tracker Server running on http://localhost:${PORT}`);
});
