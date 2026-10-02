# 🏃‍♂️ Fitness Tracker Web Application

A full-stack fitness tracking application that integrates with **Google Health API** to monitor health metrics from Fitbit, Pixel Watch, and Health Connect. Users can also track daily calories and macros from a seeded food catalog.

## 🚀 Features
- 🔐 **Authentication** with JWT
- 📊 Health data via **Google Health API**
- 🍽️ Daily calorie and macro tracking
- ✏️ Editable user profiles with conditional rendering
- 🌐 RESTful API for backend services
- 💾 MongoDB for persistent data storage

## 🖥️ Tech Stack

### Frontend (React)
- React.js with Hooks
- Axios for API calls
- Dynamic styling for user interactivity

### Backend (Node.js & Express)
- Express.js REST API
- MongoDB & Mongoose for data persistence
- Fitbit OAuth 2.0 integration
- JWT-based Authentication

## 📦 Repositories
- **Frontend**: [FITNESS_TRACKER](https://github.com/Adhi2312/FITNESS_TRACKER)
- **Backend**: [fitness-tracker-backend](https://github.com/Prithivraj22/fitness-tracker-backend)

## 🛠️ Setup Instructions

### Backend
```bash
git clone https://github.com/Prithivraj22/fitness-tracker-backend
cd fitness-tracker-backend
npm install
npm run seed:foods
npm start
```

### Frontend
```bash
git clone https://github.com/Adhi2312/FITNESS_TRACKER
cd FITNESS_TRACKER
npm install
npm start
```

Copy each repository's `.env.example` file to `.env` first. Configure the
backend `MONGO_URI`, then run the food seed before starting both applications.

## 🤝 Contributors
- [@Prithivraj22](https://github.com/Prithivraj22)
- [@Adhi2312](https://github.com/Adhi2312)

---
