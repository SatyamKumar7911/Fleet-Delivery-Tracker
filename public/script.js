// ============================================
// CONSTANTS
// ============================================
const API_BASE = 'http://localhost:3000/api';

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

let currentDeliveries = [];
let selectedDeliveryForUpdate = null;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  setDefaultDate();
  loadDeliveries();
  loadSummary();
  // Refresh data every 5 seconds
  setInterval(loadSummary, 5000);
});

// ============================================
// UTILITY FUNCTIONS
// ============================================
function setDefaultDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('deliveryDate').value = today;
}

function showMessage(message, type = 'success') {
  const messageBox = document.getElementById('messageBox');
  messageBox.textContent = message;
  messageBox.className = `message-box ${type}`;
  messageBox.style.display = 'block';

  setTimeout(() => {
    messageBox.style.display = 'none';
  }, 4000);
}

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getStatusColor(status) {
  const colors = {
    [DELIVERY_STATUS.CREATED]: '#fef3c7',
    [DELIVERY_STATUS.OUT_FOR_DELIVERY]: '#dbeafe',
    [DELIVERY_STATUS.DELIVERED]: '#dcfce7'
  };
  return colors[status] || '#e0e0e0';
}

// ============================================
// FEATURE 1: CREATE DELIVERY
// ============================================
async function handleCreateDelivery(event) {
  event.preventDefault();

  const vehicleId = document.getElementById('vehicleId').value.trim();
  const location = document.getElementById('location').value.trim();
  const deliveryDate = document.getElementById('deliveryDate').value;

  // Client-side validation
  if (!vehicleId || !location || !deliveryDate) {
    showMessage('Please fill in all required fields', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/deliveries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vehicleId,
        location,
        deliveryDate
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.errors?.join(', ') || data.message || 'Failed to create delivery';
      showMessage(errorMsg, 'error');
      return;
    }

    showMessage(`✅ Delivery #${data.delivery.deliveryId} created successfully!`, 'success');
    document.getElementById('createForm').reset();
    setDefaultDate();
    loadDeliveries();
    loadSummary();
  } catch (error) {
    console.error('Error creating delivery:', error);
    showMessage('Error creating delivery. Please try again.', 'error');
  }
}

// ============================================
// FEATURE 1: LOAD ALL DELIVERIES
// ============================================
async function loadDeliveries(sortBy = 'date') {
  try {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    const response = await fetch(`${API_BASE}/deliveries?sortBy=${sortBy}`);
    const data = await response.json();

    loading.style.display = 'none';

    if (data.success) {
      currentDeliveries = data.deliveries;
      displayDeliveries(data.deliveries);
    } else {
      showMessage('Failed to load deliveries', 'error');
    }
  } catch (error) {
    console.error('Error loading deliveries:', error);
    document.getElementById('loading').innerHTML = '❌ Failed to load deliveries. Make sure the server is running.';
  }
}

// ============================================
// DISPLAY DELIVERIES
// ============================================
function displayDeliveries(deliveries) {
  const list = document.getElementById('deliveriesList');

  if (!deliveries || deliveries.length === 0) {
    list.innerHTML = '<p style="text-align: center; color: #999; padding: 30px;">No deliveries found</p>';
    return;
  }

  list.innerHTML = deliveries.map(delivery => `
    <div class="delivery-item">
      <div class="delivery-header">
        <span class="delivery-id">Delivery #${delivery.deliveryId}</span>
        <span class="status-badge ${delivery.status}">${formatStatus(delivery.status)}</span>
      </div>
      <div class="delivery-details">
        <div class="detail-item">
          <span class="detail-label">Vehicle ID</span>
          <span class="detail-value">${delivery.vehicleId}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Location</span>
          <span class="detail-value">${delivery.location}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Date</span>
          <span class="detail-value">${formatDate(delivery.deliveryDate)}</span>
        </div>
      </div>
      <div class="delivery-actions">
        <button class="btn-update" onclick="openStatusModal(${delivery.deliveryId})">
          Update Status
        </button>
        <button class="btn-delete" onclick="deleteDelivery(${delivery.deliveryId})">
          Delete
        </button>
      </div>
    </div>
  `).join('');
}

// ============================================
// FEATURE 2: UPDATE STATUS - MODAL
// ============================================
async function openStatusModal(deliveryId) {
  try {
    const response = await fetch(`${API_BASE}/deliveries/${deliveryId}`);
    const data = await response.json();

    if (!data.success) {
      showMessage('Delivery not found', 'error');
      return;
    }

    const delivery = data.delivery;
    selectedDeliveryForUpdate = delivery;

    // Populate modal
    document.getElementById('modalDeliveryId').textContent = delivery.deliveryId;
    document.getElementById('modalCurrentStatus').textContent = formatStatus(delivery.status);
    document.getElementById('modalCurrentStatus').className = `status-badge ${delivery.status}`;
    document.getElementById('modalVehicleId').textContent = delivery.vehicleId;
    document.getElementById('modalLocation').textContent = delivery.location;

    // Generate status options
    const validNextStatuses = VALID_TRANSITIONS[delivery.status] || [];
    const statusOptionsDiv = document.getElementById('statusOptions');

    if (validNextStatuses.length === 0) {
      statusOptionsDiv.innerHTML = '<p style="color: #999;">No valid status transitions available</p>';
    } else {
      statusOptionsDiv.innerHTML = validNextStatuses.map(status => `
        <label class="status-option">
          <input type="radio" name="newStatus" value="${status}" onchange="updateSelectedStatus(this)">
          ${formatStatus(status)}
        </label>
      `).join('');
      // Select first option by default
      statusOptionsDiv.querySelector('input[type="radio"]').checked = true;
      statusOptionsDiv.querySelector('input[type="radio"]').parentElement.classList.add('selected');
    }

    document.getElementById('statusModal').style.display = 'block';
  } catch (error) {
    console.error('Error opening modal:', error);
    showMessage('Error loading delivery details', 'error');
  }
}

function updateSelectedStatus(radioButton) {
  // Remove selected class from all options
  document.querySelectorAll('.status-option').forEach(option => {
    option.classList.remove('selected');
  });
  // Add selected class to parent
  radioButton.parentElement.classList.add('selected');
}

function closeModal() {
  document.getElementById('statusModal').style.display = 'none';
  selectedDeliveryForUpdate = null;
}

// ============================================
// FEATURE 2: CONFIRM STATUS UPDATE
// ============================================
async function confirmStatusUpdate() {
  if (!selectedDeliveryForUpdate) {
    showMessage('No delivery selected', 'error');
    return;
  }

  const newStatus = document.querySelector('input[name="newStatus"]:checked')?.value;

  if (!newStatus) {
    showMessage('Please select a status', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/deliveries/${selectedDeliveryForUpdate.deliveryId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || 'Failed to update status', 'error');
      return;
    }

    showMessage(`✅ Status updated to ${formatStatus(newStatus)}!`, 'success');
    closeModal();
    loadDeliveries();
    loadSummary();
  } catch (error) {
    console.error('Error updating status:', error);
    showMessage('Error updating delivery status', 'error');
  }
}

// ============================================
// DELETE DELIVERY
// ============================================
async function deleteDelivery(deliveryId) {
  if (!confirm('Are you sure you want to delete this delivery?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/deliveries/${deliveryId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || 'Failed to delete delivery', 'error');
      return;
    }

    showMessage('✅ Delivery deleted successfully!', 'success');
    loadDeliveries();
    loadSummary();
  } catch (error) {
    console.error('Error deleting delivery:', error);
    showMessage('Error deleting delivery', 'error');
  }
}

// ============================================
// FEATURE 3: ACTIVE DELIVERIES
// ============================================
async function showActiveDeliveries() {
  try {
    const response = await fetch(`${API_BASE}/deliveries/active/list`);
    const data = await response.json();

    if (data.success) {
      displayDeliveries(data.deliveries);
      showMessage(`🚚 Showing ${data.count} active deliveries (Out for Delivery)`, 'success');
    } else {
      showMessage('Failed to load active deliveries', 'error');
    }
  } catch (error) {
    console.error('Error loading active deliveries:', error);
    showMessage('Error loading active deliveries', 'error');
  }
}

// ============================================
// FEATURE 3: FILTER BY LOCATION
// ============================================
async function filterByLocation() {
  const location = document.getElementById('locationFilter').value.trim();

  if (!location) {
    showMessage('Please enter a location', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/deliveries/location/${encodeURIComponent(location)}`);
    const data = await response.json();

    if (data.success) {
      displayDeliveries(data.deliveries);
      showMessage(`📍 Showing ${data.count} deliveries in ${location}`, 'success');
    } else {
      showMessage('Failed to filter by location', 'error');
    }
  } catch (error) {
    console.error('Error filtering by location:', error);
    showMessage('Error filtering by location', 'error');
  }
}

// ============================================
// FEATURE 3: SHOW ALL DELIVERIES
// ============================================
function showAllDeliveries() {
  document.getElementById('locationFilter').value = '';
  loadDeliveries();
  showMessage('📋 Showing all deliveries', 'success');
}

// ============================================
// SORT DELIVERIES
// ============================================
function handleSort() {
  const sortBy = document.getElementById('sortSelect').value;
  loadDeliveries(sortBy);
}

// ============================================
// FEATURE 5: SUMMARY & STATISTICS
// ============================================
async function loadSummary() {
  try {
    const response = await fetch(`${API_BASE}/summary`);
    const data = await response.json();

    if (data.success) {
      const summary = data.summary;
      document.getElementById('totalCount').textContent = summary.totalDeliveries;
      document.getElementById('deliveredCount').textContent = summary.delivered;
      document.getElementById('outForCount').textContent = summary.outForDelivery;
      document.getElementById('createdCount').textContent = summary.created;
      document.getElementById('deliveryRate').textContent = summary.deliveryRate + '%';
    }
  } catch (error) {
    console.error('Error loading summary:', error);
  }
}

// ============================================
// LOAD SAMPLE DATA
// ============================================
async function loadSampleData() {
  if (!confirm('Load sample data? This will replace existing data.')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/seed`, {
      method: 'POST'
    });

    const data = await response.json();

    if (data.success) {
      showMessage(`✅ Loaded ${data.count} sample deliveries!`, 'success');
      loadDeliveries();
      loadSummary();
    } else {
      showMessage('Failed to load sample data', 'error');
    }
  } catch (error) {
    console.error('Error loading sample data:', error);
    showMessage('Error loading sample data', 'error');
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function formatStatus(status) {
  const statusLabels = {
    [DELIVERY_STATUS.CREATED]: '📦 Created',
    [DELIVERY_STATUS.OUT_FOR_DELIVERY]: '🚚 Out for Delivery',
    [DELIVERY_STATUS.DELIVERED]: '✅ Delivered'
  };
  return statusLabels[status] || status;
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('statusModal');
  if (event.target === modal) {
    closeModal();
  }
};
