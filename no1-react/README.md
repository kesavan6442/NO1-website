# no1 Events - React + MySQL

## Setup Instructions

### 1. Database Setup
- Open your MySQL terminal or phpMyAdmin.
- Import the `server/setup.sql` file or copy its contents and run them.
- This will create the `no1_events` database and a default admin user.

### 2. Backend Setup
- Go to the `server` folder.
- Create a `.env` file and add your database credentials:
  ```env
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=your_password
  DB_NAME=no1_events
  PORT=5000
  ```
- Run `npm install` (if not already done).
- Run `npm run dev` or `node index.js` to start the server.

### 3. Frontend Setup
- Go to the `no1-react` folder.
- Run `npm install`.
- Run `npm run dev`.
- The website will be available at `http://localhost:5173`.

## Features
- **React Components**: Fully modular structure.
- **Real MySQL Connection**: Secure data handling.
- **Glassmorphism Design**: Maintains the premium aesthetic.
- **Admin Dashboard**: Pro-level management with protected routes.

## Functional Architecture

### 🏗️ System Overview
The platform follows a Full-Stack Client-Server architecture:
- **Client (React)**: The premium UI where admins manage data.
- **API (Express)**: The bridge that validates requests and handles logic.
- **Database (MySQL)**: The persistent storage for all event data.
- **Storage (Local FS)**: A local directory (`/uploads`) for images and videos.

### 🔄 Core Functional Flows
1. **The Service-Category Relationship**: Categories act as parent groups, and Services are linked to them.
2. **Media Upload & Integration**: Files are saved locally via Multer and served via local URLs.
3. **Booking & Customer Cycle**: Website bookings are stored as 'pending' and approved/completed by the admin.
4. **Stats & Analytics Engine**: Real-time aggregation of revenue and bookings via the `/api/stats` endpoint.

### 🗄️ Database Schema Relationships
- **Categories**: Parent grouping for services.
- **Services**: Referenced by categories.
- **Bookings**: Linked to specific services.
- **Reviews/Media**: Linked to service IDs.
