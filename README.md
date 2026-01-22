# HisaabKitab

**Desktop-first, offline POS and inventory software for small Pakistani hardware and equipment shops.**

HisaabKitab helps shop owners manage inventory, billing, suppliers, price changes, profit/loss, and reports. Built with Electron, React, Node.js, and PostgreSQL for a seamless offline experience.

## Features

- 📦 **Inventory Management** - Track products, stock levels, and categories
- 🧾 **Billing System** - Create bills and process sales
- 👥 **Supplier Management** - Manage suppliers and purchase orders
- 📈 **Reports & Analytics** - Sales reports, profit/loss statements
- ⚙️ **Settings & Backup** - Configure shop details and backup data
- 🌐 **Multi-language Support** - English (default) and Urdu
- 💾 **Offline First** - Works completely offline, no internet required
- 🖥️ **Desktop Optimized** - Designed for 1366x768 resolution

## Tech Stack

- **Frontend**: React 18, React Router, i18next
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (local)
- **Desktop**: Electron
- **Styling**: CSS3 with responsive design

## Project Structure

```
HisaabKitab/
├── frontend/          # React frontend application
│   ├── public/       # Static assets
│   ├── src/          # React source code
│   │   ├── components/  # React components
│   │   ├── locales/     # i18n translation files
│   │   └── ...
│   └── package.json
├── backend/          # Node.js backend API
│   ├── routes/      # API routes (to be added)
│   ├── db.js        # Database connection
│   ├── server.js    # Express server
│   └── package.json
├── database/        # PostgreSQL scripts
│   ├── create_database.sql
│   └── init.sql
├── assets/          # Images, icons, logo
├── main.js          # Electron main process
├── preload.js       # Electron preload script
└── package.json     # Root package.json
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd HisaabKitab
```

### 2. Install dependencies

Install all dependencies for root, frontend, and backend:

```bash
npm run install:all
```

Or manually:

```bash
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 3. Set up PostgreSQL Database

1. **Install PostgreSQL** if not already installed
2. **Create the database**:

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Run the create database script
\i database/create_database.sql

# Connect to the new database
\c hisaabkitab

# Run the initialization script
\i database/init.sql
```

Alternatively, you can create the database manually:

```sql
CREATE DATABASE hisaabkitab;
```

Then connect to `hisaabkitab` and run `init.sql`.

### 4. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

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

### 5. Start the Application

#### Development Mode

```bash
npm run dev
```

This will start:
- React development server (http://localhost:3000)
- Electron desktop window
- Backend API server (http://localhost:5000)

#### Production Mode

```bash
# Build React app
npm run build

# Start Electron
npm start
```

## Usage

1. Launch the application using `npm run dev` or `npm start`
2. The desktop window will open with the HisaabKitab interface
3. Use the sidebar menu to navigate between:
   - **Dashboard** - Overview of shop performance
   - **Inventory** - Manage products and stock
   - **Billing** - Create bills and process sales
   - **Suppliers** - Manage suppliers
   - **Reports** - View sales and analytics
   - **Settings** - Configure shop settings

## Development

### Project Status

This is **Step 1** of the development process:
- ✅ Project setup and basic architecture
- ✅ UI shell with navigation
- ✅ Database schema setup
- ⏳ API endpoints (to be implemented)
- ⏳ Full feature implementation (to be implemented)

### Next Steps

1. Database setup and connection testing
2. Inventory management screens
3. Billing logic implementation
4. Reports functionality
5. Printing capabilities
6. Settings and backup features

## Building for Production

To create a distributable desktop application:

```bash
npm run build
```

This will create a build in the `dist/` directory.

## Offline Support

HisaabKitab is designed to work completely offline. All data is stored locally in PostgreSQL, and the application runs as a standalone desktop app with no internet dependency.

## Multi-language Support

The application supports multiple languages:
- **English** (default)
- **Urdu** (available)

Language can be changed in Settings (to be implemented).

## Contributing

This is a work-in-progress project. Development is being done in structured steps.

## License

MIT License

## Support

For issues and questions, please refer to the project documentation or contact the development team.

---

**Version**: 1.0.0  
**Status**: In Development (Step 1 Complete)









