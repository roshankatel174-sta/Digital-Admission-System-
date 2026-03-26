# Digital Admission System

A complete full-stack Digital Admission System for college admission management built with React.js, Node.js, Express.js, and MySQL.

## Tech Stack

| Layer      | Technology                           |
|------------|--------------------------------------|
| Frontend   | React.js (Vite), Tailwind CSS v4     |
| Backend    | Node.js, Express.js                  |
| Database   | MySQL                                |
| Auth       | JWT (jsonwebtoken + bcryptjs)        |
| File Upload| Multer                               |
| Charts     | Recharts                             |
| Icons      | Lucide React                         |
| HTTP       | Axios                                |

## Features

### Student Portal
- ✅ Register / Login with JWT auth
- ✅ Browse colleges and courses with search & filters
- ✅ Multi-step admission form
- ✅ Upload documents (PDF, JPG, PNG)
- ✅ Make payments (mock eSewa/Khalti flow)
- ✅ Track application status with progress timeline
- ✅ Messages to admin + FAQ chatbot
- ✅ Notifications system
- ✅ Profile management

### Admin Panel
- ✅ Dashboard with analytics charts (Recharts)
- ✅ Manage applicants (approve/reject)
- ✅ CRUD for colleges and courses
- ✅ Verify uploaded documents
- ✅ Monitor payments and revenue
- ✅ Reports with line, bar, pie charts
- ✅ User management (add admin, manage students)
- ✅ Messages with students
- ✅ System settings

### Public Website
- ✅ Home page (hero, featured colleges/courses, benefits, process steps)
- ✅ About page
- ✅ College listing and detail pages
- ✅ Course listing and detail pages
- ✅ Contact page

## Setup Instructions

### Prerequisites
- Node.js v18+
- MySQL Server
- npm

### 1. Database Setup
```bash
# Option A: Run the seed script (recommended)
cd backend
node seed.js

# Option B: Import SQL manually
mysql -u root -p < database/schema.sql
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies (already done if you ran seed.js)
npm install

# Configure environment variables
# Edit .env file with your MySQL credentials:
#   DB_HOST=localhost
#   DB_USER=root
#   DB_PASSWORD=your_password
#   DB_NAME=digital_admission

# Start development server
npm run dev
```
Backend runs on: `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 4. Login Credentials
| Role    | Email              | Password    |
|---------|--------------------|-------------|
| Admin   | admin@das.com      | admin123    |
| Student | roshan@example.com | student123  |
| Student | sita@example.com   | student123  |

## Environment Variables (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=digital_admission
JWT_SECRET=digital_admission_secret_key_2024
JWT_EXPIRES_IN=7d
```

## Project Structure
```
Digital Admission System/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route handlers
│   ├── middleware/      # Auth & upload middleware
│   ├── routes/          # API routes
│   ├── uploads/         # Uploaded files
│   ├── server.js        # Entry point
│   ├── seed.js          # Database seeder
│   └── .env             # Environment variables
├── frontend/
│   └── src/
│       ├── context/     # Auth context
│       ├── layouts/     # Public, Student, Admin layouts
│       ├── pages/       # All page components
│       │   ├── public/  # Home, About, Colleges, etc.
│       │   ├── student/ # Dashboard, Applications, etc.
│       │   └── admin/   # Dashboard, Reports, etc.
│       ├── services/    # API service layer
│       ├── App.jsx      # Main app with routing
│       └── index.css    # Tailwind CSS + custom styles
└── database/
    └── schema.sql       # MySQL schema + seed data
```

## API Endpoints

| Module         | Endpoints                                  |
|----------------|--------------------------------------------|
| Auth           | POST /register, /login, GET/PUT /profile   |
| Colleges       | GET /, /:id, POST, PUT, DELETE             |
| Courses        | GET /, /:id, POST, PUT, DELETE             |
| Applications   | GET /, /my, /:id, POST, PUT /:id/status    |
| Documents      | POST /upload, GET /my, GET /, PUT /verify  |
| Payments       | POST /, GET /my, GET /                     |
| Messages       | POST /, GET /, POST /reply                 |
| Notifications  | GET /, PUT /:id/read, PUT /read-all        |
| Reports        | GET /dashboard, /student-dashboard         |
| Users          | GET /students, DELETE, POST /admins        |
| Settings       | GET /, PUT /                               |

## Placeholder / Future Features
- 🔲 Real payment gateway integration (eSewa/Khalti)
- 🔲 Forgot password with email verification
- 🔲 AI-powered chatbot
- 🔲 College image gallery
- 🔲 Dark mode toggle
- 🔲 Email notifications
- 🔲 PDF application receipt download
- 🔲 Advanced role permissions

## Notes
- Payment module uses a mock flow — UI and database are ready for real gateway integration
- Chatbot uses FAQ keyword matching — structure ready for AI integration
- File uploads stored in `backend/uploads/` directory
- All API routes are prefixed with `/api/`
