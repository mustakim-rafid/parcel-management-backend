# 📦 Parcel Management Backend System

This is a backend system for managing parcel deliveries. It supports multiple user roles (Admin, Sender, Receiver) and enables secure registration, login, parcel creation, tracking, and management with proper role-based access.

---

## ✨ Features

### 🔐 Authentication & User Management

* **Register User**: Register a user as sender or receiver.
* **Login / Logout / Token Refresh**: Secure login with JWT tokens.
* **Role-based Access**: Admin, Sender, and Receiver roles supported.
* **Update User Info**: Admin can update user and sender and receiver can update their own details.

### 📦 Parcel Management

* **Create Parcel**: Senders or admins can create parcels.
* **Get Parcels**: View all, sender-specific, or receiver-specific parcels.
* **Parcel Status Logs**: Admins manage and update delivery status history.
* **Approval Workflow**: Admins and receivers can approve parcels.
* **Cancel Parcels**: Senders can cancel parcels if not dispatched.
* **Track Status**: View current status log of a parcel.

---

## 🧪 API Endpoints

### 👤 User (`/api/v1/user`)

| Method | Endpoint    | Description                                 | Access     |
| ------ | ----------- | ------------------------------------------- | ---------- |
| POST   | `/register` | Register a new user (Sender/Receiver)       | Public     |
| GET    | `/`         | Get all users                               | Admin only |
| PATCH  | `/:id`      | Update user (role: sender, receiver, admin) | All roles (on some conditons) |

### 🔐 Auth (`/api/v1/auth`)

| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| POST   | `/login`          | Login user               |
| GET    | `/logout`         | Logout current user      |
| POST   | `/refresh-token`  | Refresh JWT access token |
| POST   | `/reset-password` | Reset password           |

### 📦 Parcel (`/api/v1/parcel`)

| Method | Endpoint             | Description                      | Access                  |
| ------ | -------------------- | -------------------------------- | ----------------------- |
| POST   | `/`                  | Create a new parcel              | Sender, Admin           |
| GET    | `/`                  | Get all parcels                  | Admin only              |
| GET    | `/sender-parcels`    | Get parcels created by sender    | Sender only             |
| GET    | `/receiver-parcels`  | Get parcels assigned to receiver | Receiver only           |
| GET    | `/:id`               | Get a specific parcel by ID      | All roles               |
| PATCH  | `/:id`               | Update parcel details            | Sender, Admin           |
| PATCH  | `/:id/status-log`    | Update parcel status log         | Admin only              |
| PATCH  | `/:id/approve`       | Approve parcel                   | Admin, Receiver         |
| GET    | `/:id/status-log`    | Get current parcel status        | Admin, Sender, Receiver |
| PATCH  | `/:id/cancel-parcel` | Cancel parcel if not dispatched  | Sender only             |

---

## 🧰 Tech Stack

* **TypeScript**
* **Node.js**
* **Express.js**
* **MongoDB** with **Mongoose**
* **JWT** for authentication
* **Bcrypt** for password hashing
* **Zod** for validation

---

## 🛠️ Setup and Environment Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/parcel-management-backend.git
cd parcel-management-backend
```

### 2. Create `.env` file in the root directory

```env
# DB
MONGO_URI=your-mongodb-url

# Environment
NODE_ENV=development

# JWT
ACCESS_TOKEN_SECRET=your-secret
ACCESS_TOKEN_EXPIRY=your-expiry
REFRESH_TOKEN_SECRET=your-secret
REFRESH_TOKEN_EXPIRY=your-expiry

# ADMIN
ADMIN_EMAIL=admin-email
ADMIN_PASSWORD=admin-password
```

### 3. Install dependencies

```bash
npm install
```

### 4. Build TypeScript project

```bash
npm run build
```

### 5. Start the local server

```bash
npm run dev
```

### 6. Test with Postman or any API testing tool

## Thanks