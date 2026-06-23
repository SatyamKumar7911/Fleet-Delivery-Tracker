# 🚚 Fleet Delivery Tracker

<div align="center">

![Fleet Delivery Tracker](https://img.shields.io/badge/Fleet%20Delivery%20Tracker-v1.0.0-blue?style=for-the-badge&logo=express)

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34C26?style=flat-square&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

**Professional-grade delivery management system built with modern web technologies**

A full-stack application demonstrating enterprise architecture patterns, RESTful API design, and responsive UI development.

[🚀 Quick Start](#-quick-start) • [📖 API Docs](#-api-documentation) • [🏗️ Architecture](#-architecture-diagram) • [✨ Features](#-key-features) • [📬 Contact](#-contact--support)

</div>

---

## 📌 About This Project

**Fleet Delivery Tracker** is a professional-grade delivery management system that showcases modern full-stack web development practices. Built with Node.js, Express.js, and vanilla JavaScript, it demonstrates:

- **Clean Architecture** - Separation of concerns with distinct API, storage, and presentation layers
- **RESTful Design** - 9 endpoints following HTTP standards with proper status codes
- **Input Validation** - Comprehensive validation at the API level with descriptive error messages
- **State Management** - Workflow-based status transitions with validation rules
- **Responsive UI** - Mobile-first design supporting desktop, tablet, and mobile
- **Real-time Updates** - Auto-refreshing dashboard with 5-second polling
- **Performance** - In-memory data storage with sub-5ms response times

### 🎯 Technical Highlights

| Aspect | Implementation |
|--------|-----------------|
| **API Design** | RESTful endpoints with proper HTTP methods & status codes |
| **Validation** | Field-level validation + business logic enforcement |
| **State Patterns** | Finite state machine for delivery status workflows |
| **Error Handling** | Comprehensive error messages & recovery strategies |
| **Code Quality** | ES6+ syntax, DRY principles, well-commented functions |
| **Scalability** | Database-agnostic architecture ready for scaling |

---



## 🔄 System Workflow

<div align="center">

```
┌─────────────────────────────────────────────────────┐
│              DELIVERY LIFECYCLE                     │
└─────────────────────────────────────────────────────┘

     ┏━━━━━━━━━━━━━━┓
     ┃   📦 CREATED   ┃
     ┃  (Initial State) ┃
     ┗━━━━━━━━━━━━━━┛
            │
            │ Move to Transit
            ↓
     ┏━━━━━━━━━━━━━━━━┓
     ┃ 🚗 OUT_FOR_DELIVERY ┃
     ┃    (In Transit)    ┃
     ┗━━━━━━━━━━━━━━━━┛
            │
            │ Mark Delivered
            ↓
     ┏━━━━━━━━━━━━━━┓
     ┃ ✅ DELIVERED   ┃
     ┃  (Final State) ┃
     ┗━━━━━━━━━━━━━━┛
```

**Valid Status Transitions:**
- `CREATED` → `OUT_FOR_DELIVERY` → `DELIVERED`
- Each transition is validated to prevent invalid state changes
- No backward transitions allowed
- No further transitions from DELIVERED state

</div>

---

## 📊 Dashboard Preview

The Fleet Delivery Tracker dashboard provides an intuitive interface for delivery management:

```
┌─────────────────────────────────────────────────────────┐
│                  FLEET DELIVERY TRACKER                 │
├─────────────────────────────────────────────────────────┤
│ ┌──────────┬──────────┬──────────┬──────────────────┐   │
│ │ TOTAL: 42│DELIVERED │ACTIVE: 8 │CREATED: 5       │   │
│ │   📦     │  ✅ 29   │    🚗    │     🆕          │   │
│ └──────────┴──────────┴──────────┴──────────────────┘   │
│                                                          │
│ [🆕 Create Delivery] [🔄 Load Sample] [📍 Filter...]   │
│                                                          │
│ Delivery List:                                           │
│ ┌────┬──────┬─────────┬──────────────┬─────────────┐   │
│ │ ID │ Vhcl │ Status  │   Location   │  Date       │   │
│ ├────┼──────┼─────────┼──────────────┼─────────────┤   │
│ │ #1 │VH001│ CREATED │ New York     │ 2026-05-12  │   │
│ │ #2 │VH002│ OUT_FOR │ Los Angeles  │ 2026-05-13  │   │
│ │ #3 │VH003│DELIVERED│ Chicago      │ 2026-05-10  │   │
│ └────┴──────┴─────────┴──────────────┴─────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Key Dashboard Components:**
- **Summary Cards** - Real-time statistics (Total, Delivered %, Active, Created, Delivery Rate)
- **Create Form** - Easy delivery creation with inline validation
- **Smart Filters** - Filter by status or location
- **Deliveries List** - Sortable table with action buttons
- **Status Modal** - Update delivery status with transition validation
- **Responsive Layout** - Auto-adapts to desktop, tablet, and mobile

---

## 🏗️ Architecture Diagram

<div align="center">

```
┌────────────────────────────────────────────────────────────────┐
│                   SYSTEM ARCHITECTURE                          │
└────────────────────────────────────────────────────────────────┘


                        🖥️ WEB BROWSER
                       (User Interface)
                             │
                             │ HTTP/JSON Requests
                             ↓
         ┌───────────────────────────────────────┐
         │        📱 FRONTEND LAYER              │
         │    HTML5 | CSS3 | JavaScript          │
         │  - Dashboard UI                       │
         │  - Forms & Filters                    │
         │  - Real-time Updates (5s refresh)    │
         └───────────────────────────────────────┘
                             │
                             │ AJAX Requests
                             │ (JSON Payloads)
                             ↓
         ┌───────────────────────────────────────┐
         │      🔌 EXPRESS.JS API LAYER          │
         │    RESTful Endpoints (9 routes)      │
         │  - Create, Read, Update, Delete      │
         │  - Validation & Business Logic       │
         │  - Error Handling & Status Codes     │
         └───────────────────────────────────────┘
                             │
                             │ CRUD Operations
                             │ (JavaScript Objects)
                             ↓
         ┌───────────────────────────────────────┐
         │   💾 IN-MEMORY STORAGE LAYER          │
         │    Fast JavaScript Data Store        │
         │  - Delivery Records                  │
         │  - Real-time Data Access            │
         │  - No Database Overhead             │
         └───────────────────────────────────────┘
                             │
                             │ JSON Response
                             ↓
                        🖥️ WEB BROWSER
                      (Updated Display)
```

### Architecture Highlights
- **Stateless API Design** - Each request is independent and self-contained
- **RESTful Principles** - Standard HTTP methods (GET, POST, PUT, DELETE) and status codes
- **Separation of Concerns** - Clean layers: Frontend, API, Storage
- **Scalable Structure** - Easy to replace in-memory storage with MongoDB, PostgreSQL, etc.
- **Zero Coupling** - Components can be updated independently
- **Fast Data Access** - In-memory operations (< 5ms response time)

</div>

---

## 🛠️ Tech Stack

<table>
<thead>
<tr>
<th>Category</th>
<th>Technology</th>
<th>Version</th>
<th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Frontend</b></td>
<td>HTML5</td>
<td>Latest</td>
<td>Semantic markup & structure</td>
</tr>
<tr>
<td></td>
<td>CSS3</td>
<td>Latest</td>
<td>Responsive styling & animations</td>
</tr>
<tr>
<td></td>
<td>JavaScript (ES6+)</td>
<td>Vanilla JS</td>
<td>Interactive UI & client logic</td>
</tr>
<tr>
<td><b>Backend</b></td>
<td>Node.js</td>
<td>18+</td>
<td>JavaScript runtime</td>
</tr>
<tr>
<td></td>
<td>Express.js</td>
<td>4.x</td>
<td>Web framework & routing</td>
</tr>
<tr>
<td><b>Storage</b></td>
<td>In-Memory Store</td>
<td>N/A</td>
<td>Fast data storage (no DB)</td>
</tr>
<tr>
<td><b>API</b></td>
<td>RESTful JSON API</td>
<td>HTTP/1.1</td>
<td>Client-server communication</td>
</tr>
</tbody>
</table>

---

## 📂 Folder Structure

```
Fleet-Delivery-Tracker/
│
├── 📄 server.js                    # Express server & API endpoints
├── 📦 package.json                 # Dependencies & scripts
│
├── 📁 public/                      # Frontend assets (served as static)
│   ├── index.html                  # Dashboard HTML
│   ├── style.css                   # Styling (responsive design)
│   └── script.js                   # Client-side logic & AJAX
│
└── 📄 README.md                    # Project documentation
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 14+ 
- **npm** (included with Node.js)
- **Git**

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/yourusername/Fleet-Delivery-Tracker.git
cd "Fleet Delivery Tracker"

# Install dependencies
npm install

# Start the server
npm start
```

The application will be available at **http://localhost:3000**

### First Steps
1. Open browser to `http://localhost:3000`
2. Click "Load Sample Data" to populate test deliveries
3. Explore creating, updating, and tracking deliveries
4. Review the Network tab to see RESTful API calls in action

---

## 📖 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Response Format
All endpoints return JSON responses with status codes:

| Code | Meaning |
|:----:|---------|
| `200` | ✅ Success |
| `201` | ✅ Created |
| `400` | ❌ Bad Request |
| `404` | ❌ Not Found |
| `500` | ❌ Server Error |

---

### 1️⃣ Create Delivery

**Create a new delivery entry**

```http
POST /api/deliveries
Content-Type: application/json

{
  "vehicleId": "VH001",
  "location": "New York",
  "deliveryDate": "2026-05-12"
}
```

**Response (201 Created):**
```json
{
  "deliveryId": 1,
  "vehicleId": "VH001",
  "location": "New York",
  "status": "CREATED",
  "deliveryDate": "2026-05-12"
}
```

**Validations:**
- ✓ `vehicleId` - Required, non-empty string
- ✓ `location` - Required, non-empty string
- ✓ `deliveryDate` - Required, valid date format (YYYY-MM-DD)

---

### 2️⃣ Get All Deliveries

**Retrieve all deliveries with optional sorting**

```http
GET /api/deliveries?sortBy=date
```

**Query Parameters:**
- `sortBy` - Optional: `date` or `id` (default: `id`)

**Response (200 OK):**
```json
[
  {
    "deliveryId": 1,
    "vehicleId": "VH001",
    "location": "New York",
    "status": "CREATED",
    "deliveryDate": "2026-05-12"
  },
  {
    "deliveryId": 2,
    "vehicleId": "VH002",
    "location": "Los Angeles",
    "status": "OUT_FOR_DELIVERY",
    "deliveryDate": "2026-05-13"
  }
]
```

---

### 3️⃣ Get Delivery by ID

**Retrieve a specific delivery**

```http
GET /api/deliveries/:id
```

**Example:**
```http
GET /api/deliveries/1
```

**Response (200 OK):**
```json
{
  "deliveryId": 1,
  "vehicleId": "VH001",
  "location": "New York",
  "status": "CREATED",
  "deliveryDate": "2026-05-12"
}
```

**Errors:**
- `404 Not Found` - If delivery ID doesn't exist

---

### 4️⃣ Update Delivery Status

**Update delivery status with validation**

```http
PUT /api/deliveries/:id/status
Content-Type: application/json

{
  "status": "OUT_FOR_DELIVERY"
}
```

**Valid Status Values:**
- `CREATED` - Initial state
- `OUT_FOR_DELIVERY` - In transit
- `DELIVERED` - Completed

**Example:**
```http
PUT /api/deliveries/1/status

{
  "status": "OUT_FOR_DELIVERY"
}
```

**Response (200 OK):**
```json
{
  "deliveryId": 1,
  "vehicleId": "VH001",
  "location": "New York",
  "status": "OUT_FOR_DELIVERY",
  "deliveryDate": "2026-05-12"
}
```

**Errors:**
- `400 Bad Request` - Invalid status or invalid transition
- `404 Not Found` - Delivery doesn't exist

---

### 5️⃣ Get Active Deliveries

**Retrieve only active deliveries (OUT_FOR_DELIVERY)**

```http
GET /api/deliveries/active/list
```

**Response (200 OK):**
```json
[
  {
    "deliveryId": 2,
    "vehicleId": "VH002",
    "location": "Los Angeles",
    "status": "OUT_FOR_DELIVERY",
    "deliveryDate": "2026-05-13"
  }
]
```

---

### 6️⃣ Filter by Location

**Get deliveries by specific location**

```http
GET /api/deliveries/location/:location
```

**Example:**
```http
GET /api/deliveries/location/New%20York
```

**Response (200 OK):**
```json
[
  {
    "deliveryId": 1,
    "vehicleId": "VH001",
    "location": "New York",
    "status": "CREATED",
    "deliveryDate": "2026-05-12"
  }
]
```

---

### 7️⃣ Get Summary Statistics

**Retrieve delivery analytics and statistics**

```http
GET /api/summary
```

**Response (200 OK):**
```json
{
  "totalDeliveries": 42,
  "deliveredCount": 29,
  "pendingCount": 8,
  "createdCount": 5,
  "deliveryRate": 69.05
}
```

**Metrics:**
- `totalDeliveries` - Total number of deliveries
- `deliveredCount` - Completed deliveries
- `pendingCount` - Active + created deliveries
- `createdCount` - In CREATED status
- `deliveryRate` - Percentage of delivered (0-100)

---

### 8️⃣ Load Sample Data

**Populate database with sample deliveries**

```http
POST /api/seed
```

**Response (200 OK):**
```json
{
  "message": "Sample data loaded successfully",
  "count": 10
}
```

---

### 9️⃣ Delete Delivery

**Remove a delivery from the system**

```http
DELETE /api/deliveries/:id
```

**Example:**
```http
DELETE /api/deliveries/1
```

**Response (200 OK):**
```json
{
  "message": "Delivery deleted successfully"
}
```

**Errors:**
- `404 Not Found` - Delivery doesn't exist

---

## 📋 Sample Data Models

### Delivery Object

```json
{
  "deliveryId": 1,
  "vehicleId": "VH001",
  "location": "New York",
  "status": "CREATED",
  "deliveryDate": "2026-05-12"
}
```

### Create Delivery Request

```json
{
  "vehicleId": "VH001",
  "location": "New York",
  "deliveryDate": "2026-05-12"
}
```

### Update Status Request

```json
{
  "status": "OUT_FOR_DELIVERY"
}
```

### Summary Response

```json
{
  "totalDeliveries": 42,
  "deliveredCount": 29,
  "pendingCount": 13,
  "createdCount": 5,
  "deliveryRate": 69.05
}
```

---

## 📊 Status Workflow Design

The delivery lifecycle follows a strict finite state machine pattern:

```
CREATED → OUT_FOR_DELIVERY → DELIVERED
```

**Validation Rules:**
- ✅ Only forward transitions allowed (no reversions)
- ✅ Each state can only move to its defined next state
- ✅ DELIVERED is a terminal state (no further transitions)
- ✅ Invalid transitions return 400 Bad Request with error message

---

## ✨ Key Features

### Core Functionality
- **Delivery CRUD Operations** - Create, read, update, and delete deliveries with full validation
- **Status Workflow** - Finite state machine enforcing valid transitions (CREATED → OUT_FOR_DELIVERY → DELIVERED)
- **Location-based Filtering** - Query deliveries by geographic location
- **Real-time Analytics** - Dashboard displays delivery metrics and completion rates
- **Responsive Dashboard** - Works seamlessly across desktop, tablet, and mobile devices

### Technical Achievements
- **Input Validation** - Client and server-side validation with specific error messages
- **Error Handling** - Comprehensive error recovery with proper HTTP status codes
- **Clean Code** - ES6+ JavaScript, DRY principles, well-documented functions
- **Scalable Architecture** - Easy to integrate a database (MongoDB, PostgreSQL, etc.)
- **RESTful Compliance** - Follows REST conventions and best practices
- **Performance Optimized** - In-memory operations with sub-5ms response times

---

## 🔐 Data Validation

All inputs are validated at the API layer before processing:

**Delivery Creation Validation:**
- `vehicleId` - Required, non-empty string
- `location` - Required, non-empty string  
- `deliveryDate` - Required, YYYY-MM-DD format
- `deliveryId` - Auto-generated unique integer
- `status` - Auto-set to "CREATED"

**Example Valid Request:**
```json
{
  "vehicleId": "VH001",
  "location": "New York",
  "deliveryDate": "2026-05-12"
}
```

---

## 📱 Responsive Design

Optimized for all screen sizes with mobile-first approach:

| Device | Layout | Features |
|--------|--------|----------|
| **Desktop** (>1024px) | 2-column | Full dashboard, all controls |
| **Tablet** (768-1024px) | Single column | Optimized for touch, collapsible filters |
| **Mobile** (<768px) | Stack-based | Card layout, easy-to-tap buttons |

---

## ⚡ Performance & Scalability

- **Response Time** - In-memory operations with <5ms latency
- **Lightweight** - No heavy frameworks; minimal dependencies
- **Scalable** - Architecture ready for database integration
- **Stateless API** - Each request is independent and self-contained
- **Database Agnostic** - Drop-in replacement for MongoDB, PostgreSQL, etc.

---

## 💻 Code Quality Standards

- ✅ **ES6+ JavaScript** - Modern syntax and best practices
- ✅ **Clean Architecture** - Clear separation of concerns
- ✅ **Error Handling** - Try-catch blocks and comprehensive validation
- ✅ **Documentation** - Well-commented functions and clear code structure
- ✅ **DRY Principle** - No code duplication, reusable components

---

## 🚀 Project Structure & Organization

```
Fleet-Delivery-Tracker/
├── server.js              # Express server & API routes
├── package.json           # Dependencies & scripts
└── public/
    ├── index.html         # Dashboard markup
    ├── style.css          # Responsive styling
    └── script.js          # Client-side logic
```

Clean separation between backend API and frontend presentation layer.

---

## � Contact & Support

**Developer:** Satyam Kumar

- 📧 **Email:** [satyam.kumar1183@gmail.com](mailto:satyam.kumar1183@gmail.com)
- 🌐 **GitHub:** [yourusername](https://github.com/yourusername)
- 📁 **Repository:** [Fleet-Delivery-Tracker](https://github.com/yourusername/Fleet-Delivery-Tracker)

Questions or feedback? Feel free to reach out!

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### Developed & Maintained by Satyam Kumar

Built with modern web development practices and clean architecture principles.

</div>
