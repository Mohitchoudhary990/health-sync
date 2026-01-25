# HealthSync – Hospital & Appointment Management System

A full-stack MERN application for hospital and appointment management.

## 🚀 Features

- User authentication (JWT-based)
- Doctor profiles with specializations
- Appointment booking system
- Patient dashboard
- Admin panel
- Search and filter doctors
- Appointment management
- Responsive design

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt for password hashing

**Frontend:**
- React 18
- Vite
- React Router v6
- Axios
- Context API for state management

## 📁 Project Structure

```
healthm/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
└── client/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── context/     # Global state
    │   ├── pages/       # Page components
    │   ├── utils/       # API utilities
    │   └── App.jsx      # Main app
    └── package.json
```

## 🔧 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get single doctor
- `POST /api/doctors` - Create doctor (admin)
- `PUT /api/doctors/:id` - Update doctor
- `DELETE /api/doctors/:id` - Delete doctor (admin)

### Appointments
- `GET /api/appointments` - Get user's appointments
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Book appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department (admin)

## 👥 User Roles

- **Patient**: Book appointments, view doctors
- **Doctor**: View assigned appointments
- **Admin**: Manage doctors, departments, all appointments

## 📱 Screenshots

(Add screenshots here)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- React documentation
- MongoDB documentation
- Express.js documentation
