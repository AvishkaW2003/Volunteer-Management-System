# VolunteerHub — Volunteer Opportunity Management System

VolunteerHub is a web application designed to streamline volunteer opportunities, event approvals, attendance tracking, credentials validation, and reputation management. 

This repository contains both the **React Frontend** and the **Express/Sequelize/MySQL Backend**.

---

## Repository Structure

```
VOMS-Project-Structure/
├── backend/            # Express.js Server & Sequelize ORM
│   ├── config/         # Database, Seed, and JWT settings
│   ├── controllers/    # API Controllers
│   ├── middleware/     # Auth, Security (XSS, Rate Limits) & Validation
│   ├── models/         # Sequelize Schema Definitions
│   ├── routes/         # Express Router endpoints
│   ├── services/       # Core Business Logic Layer
│   └── server.js       # Production Entry Point
├── frontend/           # React SPA & TailwindCSS
│   ├── src/
│   │   ├── context/    # React Context (AuthContext)
│   │   ├── pages/      # Pages & Dashboards (Student, Organizer, Admin)
│   │   ├── services/   # Frontend API Services
│   │   └── routes/     # Protected Route Guards
└── docs/               # System & API documentation
```

---

## Getting Started

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **MySQL Server** (v8.x or higher)

---

## 1. Backend Setup & Configuration

### Installation
Navigate to the `backend/` directory and install the dependencies:
```bash
cd backend
npm install
```

### Environment Variables (`.env`)
Create a `.env` file in the `backend/` directory with the following variables:
```ini
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=volunteerhub
JWT_SECRET=your_jwt_signing_secret_key
JWT_EXPIRES_IN=7d
```

### Database Initialization
1. Ensure your MySQL server is running.
2. Create the database matching your `DB_NAME`:
   ```sql
   CREATE DATABASE volunteerhub;
   ```
3. Start the server. The application uses Sequelize's `sync({ alter: true })` schema sync to automatically create all 10 tables, configure foreign keys, and establish indexes on startup:
   ```bash
   npm run dev
   ```
4. On the very first startup, the database is automatically seeded via [seed.js](file:///c:/Users/USER/Desktop/test%20web/VOMS-Project-Structure/backend/config/seed.js) with:
   - 1 Administrator account (`admin@gmail.com` / `123456`)
   - 4 Student accounts & profiles
   - 3 Organizer accounts & profiles
   - System settings, default events, sample applications, and audit entries.

---

## 2. Frontend Setup & Configuration

### Installation
Navigate to the `frontend/` directory and install dependencies:
```bash
cd ../frontend
npm install
```

### Run Locally (Development Server)
Launch the development build on Vite (typically runs on `http://localhost:5173`):
```bash
npm run dev
```

### Build for Production
Build the optimized static files to the `frontend/dist` directory:
```bash
npm run build
```

---

## 3. Database Backup & Recovery

To ensure operational stability and prevent data loss, the following database backup and recovery procedures should be executed periodically.

### Database Backup
Use `mysqldump` to export the database structure and data:
```bash
mysqldump -u root -p volunteerhub > backup.sql
```

### Database Recovery
To restore the database from a backup file:
1. Re-create the database:
   ```bash
   mysql -u root -p -e "DROP DATABASE IF EXISTS volunteerhub; CREATE DATABASE volunteerhub;"
   ```
2. Import the backup SQL file:
   ```bash
   mysql -u root -p volunteerhub < backup.sql
   ```

---

## 4. Production Deployment Guidelines

For deploying the production-ready VolunteerHub application:

### Backend Execution (using PM2)
Deploy the server using a process manager like PM2 to guarantee reliability and automatic restarts on crash:
```bash
cd backend
npm install -g pm2
pm2 start server.js --name "volunteerhub-api"
```

### Frontend Hosting
Serve the built static folder (`frontend/dist`) using Nginx or Apache.
Example Nginx Server block:
```nginx
server {
    listen 80;
    server_name volunteerhub.uni.lk;

    location / {
        root /var/www/volunteerhub/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 5. Security & Verification
- **E2E Workflow verification**: Run `node test-e2e.js` inside the `backend/` directory to verify registrations, logins, event workflows, attendance marking, certificate generation, notifications, leaderboard sorting, and route security policies.
- **Vulnerabilities Mitigations**:
  - All write endpoints utilize an input-level **XSS Sanitizer** scrubbing script and HTML injection patterns.
  - Brute-force vectors are mitigated using custom **Rate Limiters** on authentication and recovery paths.
  - Sequelize ORM parameters protect against SQL injections globally.
