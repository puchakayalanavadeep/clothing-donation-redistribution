# ♻️ Circular Threads – Smart Clothing Donation & Redistribution Platform API

A production-style RESTful API backend for **Circular Threads**, designed to eliminate textile waste and intelligently route clothing donations to verified shelters, NGOs, and individuals based on real-time demand matching.

---

## 📌 Features

- 🔒 **JWT Authentication & Authorization**: Role-based access control (`donor`, `organization`, `admin`) with bcrypt password hashing.
- 👕 **Donation Management**: Full CRUD operations for clothing donations with status tracking (`Available`, `Matching`, `Matched`, `Collected`, `Delivered`).
- 🏬 **Organization & Shelter Portal**: Non-profit registration, verification queue, and clothing requirement management.
- 🤖 **Smart AI Matching Engine**: Weighted multi-factor algorithm calculating match compatibility scores (0–100%) and Haversine geographical distance.
- 💡 **Match Reasoning Generator**: Automatically creates human-readable explanations detailing why a match was selected.
- 📊 **Impact & Sustainability Analytics**: Platform-wide and donor-specific ecological metrics (textile waste prevented, CO₂ offset, transport distance saved).
- 🛡️ **Admin Panel Controls**: User management, NGO verification approvals, and match stream monitoring.

---

## 🏗️ Technology Stack

- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **JWT (JSON Web Tokens)**
- **bcryptjs** (Password hashing)
- **Multer & Cloudinary** (Image handling)
- **dotenv & cors**

---

## 📁 Project Structure

```
backend/
├── config/
│   ├── db.js                 # MongoDB connection handler
│   └── cloudinary.js         # Cloudinary SDK configuration
│
├── controllers/
│   ├── authController.js     # User registration, login, profile management
│   ├── donationController.js # Clothing donation CRUD & filters
│   ├── organizationController.js # NGO profiles & verification
│   ├── requirementController.js  # Organization demand postings
│   ├── matchingController.js     # AI matching triggers & status updates
│   ├── userController.js         # Image upload handler
│   ├── impactController.js       # Sustainability analytics
│   └── adminController.js        # Admin dashboard & verification queue
│
├── models/
│   ├── User.js               # User schema (Donor/Organization/Admin)
│   ├── Donation.js           # Clothing donation schema
│   ├── Organization.js       # NGO/Shelter organization profile schema
│   ├── Requirement.js        # Demand requirement schema
│   └── Match.js              # Match recommendation & reasoning schema
│
├── routes/
│   ├── authRoutes.js         # /api/auth
│   ├── donationRoutes.js     # /api/donations
│   ├── organizationRoutes.js # /api/organizations
│   ├── requirementRoutes.js  # /api/requirements
│   ├── matchingRoutes.js     # /api/matches
│   ├── impactRoutes.js       # /api/impact
│   └── adminRoutes.js        # /api/admin
│
├── middleware/
│   ├── authMiddleware.js     # JWT token protection
│   ├── roleMiddleware.js     # Role authorization checker
│   ├── errorMiddleware.js    # Global error response handler
│   └── uploadMiddleware.js   # Multer file validator
│
├── services/
│   └── matchingService.js    # CORE Smart Matching Algorithm
│
├── utils/
│   ├── calculateDistance.js  # Haversine distance formula
│   └── seedData.js           # Database seeder script
│
├── server.js                 # Server entrypoint
├── app.js                    # Express app configuration
├── package.json
└── .env.example
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js**: v18+
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI.

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configured `.env` variables:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/circular_threads
JWT_SECRET=circular_threads_secret_key_2026_super_secure
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=demo_cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz12345
CLIENT_URL=http://localhost:5173
```

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Seed Sample Data (Optional)
To populate the database with 5 Donors, 5 NGOs, 10 Clothing Donations, 10 Requirements, and generated matches:
```bash
npm run seed
```

### 5. Run the Server
```bash
# Production mode
npm start

# Development mode with hot-reload
npm run dev
```

The server will start on `http://localhost:5000`.

---

## 🤖 Smart Matching Algorithm Explanation

The core highlight of Circular Threads is its intelligent matching engine located in `services/matchingService.js`.

### Multi-Factor Scoring Formula

$$\text{MatchScore} = (S_{\text{type}} \times 0.25) + (S_{\text{size}} \times 0.20) + (S_{\text{genderAge}} \times 0.15) + (S_{\text{demand}} \times 0.15) + (S_{\text{location}} \times 0.15) + (S_{\text{urgency}} \times 0.10)$$

| Factor | Weight | Scoring Logic |
| :--- | :--- | :--- |
| **Clothing Type** | **25%** | Exact match = 100. Compatible outer layers/tops/bottoms = 75. Other = 20. |
| **Size Fit** | **20%** | Exact size match = 100. Free size = 85. Adjacent size = 70. Otherwise = 0. |
| **Gender & Age** | **15%** | Exact demographic fit = 100. Unisex/Partial fit = 60. Otherwise = 0. |
| **Remaining Demand** | **15%** | $\ge 15$ items needed = 100. $\ge 10$ = 85. $\ge 5$ = 70. $\ge 1$ = 50. |
| **Location Proximity** | **15%** | Uses **Haversine formula**. 0–5 km = 100. 5–15 km = 85. 15–30 km = 70. 30–50 km = 50. $>50$ km = 30. |
| **Urgency Level** | **10%** | Critical = 100. High = 80. Medium = 60. Low = 40. |

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Register user (`donor`, `organization`, `admin`).
- `POST /api/auth/login` - Authenticate & obtain JWT.
- `GET /api/auth/profile` - Get logged-in user profile.
- `PUT /api/auth/profile` - Update user profile & location.

### 👕 Clothing Donations (`/api/donations`)
- `POST /api/donations` - Create new clothing donation (Protected).
- `GET /api/donations` - Get donations with query filters (`clothingType`, `size`, `genderSuitability`, `ageGroup`, `condition`, `city`, `status`, `page`, `limit`).
- `GET /api/donations/my-donations` - Get donor's active donations (Protected).
- `GET /api/donations/:id` - Get donation details.
- `PUT /api/donations/:id` - Update donation parameters (Protected).
- `DELETE /api/donations/:id` - Delete donation (Protected).

### 🏬 Organizations & Shelters (`/api/organizations`)
- `POST /api/organizations` - Create organization profile (Protected).
- `GET /api/organizations` - Get all verified partner organizations.
- `GET /api/organizations/my/profile` - Get logged-in organization profile (Protected).
- `GET /api/organizations/:id` - Get organization profile.
- `PUT /api/organizations/:id` - Update organization profile (Protected).

### 📋 Requirements (`/api/requirements`)
- `POST /api/requirements` - Publish clothing requirement (Protected).
- `GET /api/requirements` - Get all active shelter requirements.
- `GET /api/requirements/my-requirements` - Get NGO's requirements (Protected).
- `GET /api/requirements/:id` - Get requirement details.
- `PUT /api/requirements/:id` - Update requirement (Protected).
- `DELETE /api/requirements/:id` - Delete requirement (Protected).

### 🎯 Smart Matching Engine (`/api/matches`)
- `POST /api/matches/:donationId/generate` - Run AI matching engine for a donation.
- `GET /api/matches/:donationId` - Get match recommendations for a donation.
- `PUT /api/matches/:matchId/accept` - NGO accepts match recommendation (Protected).
- `PUT /api/matches/:matchId/reject` - Reject match recommendation (Protected).
- `PUT /api/matches/:matchId/delivered` - Mark donation as delivered & update quantity fulfilled (Protected).

### 📊 Sustainability Impact (`/api/impact`)
- `GET /api/impact/platform` - Get platform-wide waste reduction & CO₂ metrics.
- `GET /api/impact/my-impact` - Get donor's personal environmental savings (Protected).

### 🛡️ System Administration (`/api/admin`)
- `GET /api/admin/dashboard` - Platform overview metrics.
- `GET /api/admin/organizations/pending` - NGO verification queue.
- `PUT /api/admin/organizations/:id/verify` - Approve NGO verification.
- `PUT /api/admin/organizations/:id/reject` - Reject NGO verification.
- `GET /api/admin/users` - Get user directory.
- `PUT /api/admin/users/:id/status` - Activate / Suspend user.

---

## 📸 Image Upload Endpoint (`/api/upload`)
- `POST /api/upload` - Upload up to 5 clothing photos (Multer memory storage / Cloudinary SDK). Returns image URLs array.
