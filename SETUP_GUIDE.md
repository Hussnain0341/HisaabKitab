# HisaabKitab Setup Guide

This guide will help you set up HisaabKitab on your local machine.

## Quick Start

### 1. Install Dependencies

```bash
npm run install:all
```

This installs dependencies for the root, frontend, and backend packages.

### 2. Set Up PostgreSQL Database

#### Option A: Using Setup Script (Recommended)

```bash
# Make sure you have PostgreSQL installed and running
# Update backend/.env with your database credentials

npm run setup:db
```

#### Option B: Manual Setup

1. **Create the database:**

```bash
psql -U postgres
```

```sql
CREATE DATABASE hisaabkitab;
\q
```

2. **Run initialization script:**

```bash
psql -U postgres -d hisaabkitab -f database/init.sql
```

### 3. Configure Environment

Create `backend/.env` file:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hisaabkitab
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
NODE_ENV=development
```

### 4. Start the Application

#### Development Mode

```bash
npm run dev
```

This starts:
- React development server (http://localhost:3000)
- Backend API server (http://localhost:5000)
- Electron desktop window

#### Production Mode

```bash
# Build React app
npm run build:react

# Start Electron
npm start
```

## Troubleshooting

### Database Connection Issues

1. **Verify PostgreSQL is running:**
   ```bash
   # Windows
   services.msc (check PostgreSQL service)
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. **Check database credentials in `backend/.env`**

3. **Test connection:**
   ```bash
   psql -U postgres -d hisaabkitab
   ```

### Port Already in Use

If port 3000 or 5000 is already in use:

- **Port 3000 (React):** Edit `frontend/package.json` scripts or set `PORT=3001` in environment
- **Port 5000 (Backend):** Change `PORT` in `backend/.env`

### Missing Dependencies

If you encounter module errors:

```bash
# Clean install
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

### Electron Window Not Opening

1. Check console for errors
2. Verify React dev server is running (http://localhost:3000)
3. Check that backend server started successfully

## File Structure

After setup, your project should have:

```
HisaabKitab/
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   └── package.json
├── backend/
│   ├── node_modules/
│   ├── .env (create this)
│   ├── server.js
│   └── package.json
├── database/
│   ├── init.sql
│   └── setup.js
├── assets/
├── main.js
├── preload.js
└── package.json
```

## Next Steps

Once setup is complete:

1. ✅ Verify the app opens and displays the dashboard
2. ✅ Check that navigation menu works
3. ✅ Test database connection (API will be implemented in next steps)
4. ✅ Proceed to Step 2: Database Integration

## Requirements

- **Node.js:** v18 or higher
- **PostgreSQL:** v14 or higher
- **npm:** v9 or higher (or yarn)

## Support

For issues during setup, check:
1. All prerequisites are installed
2. PostgreSQL service is running
3. Database credentials are correct
4. Ports 3000 and 5000 are available

---

**Version:** 1.0.0  
**Last Updated:** Step 1 Setup Complete









