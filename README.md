# HisaabKitab - POS & Inventory Management System

**HisaabKitab** (حساب کتاب) is a comprehensive, desktop-first Point of Sale (POS) and inventory management system designed specifically for small to medium-sized hardware shops in Pakistan. Built with Electron, React, and Node.js, it provides a complete offline-capable solution for managing sales, inventory, customers, suppliers, and financial operations.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Development](#development)
- [Building & Distribution](#building--distribution)
- [License System](#license-system)
- [Security & Authentication](#security--authentication)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Core Functionality

- **📊 Dashboard**: Real-time business metrics including today's sales, profit, cash in hand, customer/supplier dues, and low stock alerts
- **🧾 Billing & Sales**: Complete POS system with invoice generation, multiple payment types (cash, credit, split), discount and tax support
- **📦 Inventory Management**: Product management with categories, sub-categories, stock tracking, frequently sold items, and low stock alerts
- **👥 Customer Management**: Customer profiles, credit tracking (Udhaar), payment history, and outstanding balance management
- **🏪 Supplier Management**: Supplier profiles, purchase tracking, payment management, and payable tracking
- **💰 Financial Operations**:
  - Sales transactions with detailed reporting
  - Purchase management
  - Expense tracking
  - Customer payments (credit recovery)
  - Supplier payments
  - Profit/loss calculations

### Advanced Features

- **🌐 Multi-language Support**: Full bilingual interface (English/Urdu) with i18n
- **🔐 Role-Based Access Control**: Administrator and Cashier roles with granular permissions
- **📱 Real-time Notifications**: System notifications for important events
- **📈 Comprehensive Reports**: 
  - Sales reports (daily, weekly, monthly, custom date ranges)
  - Profit reports
  - Stock reports
  - Customer statements
  - Supplier history
  - Expense summaries
- **💾 Backup & Restore**: Automated and manual database backups with restore functionality
- **🖨️ Invoice Printing**: Thermal printer support for invoice printing
- **📋 Rate List**: Product pricing management and rate list generation
- **🔒 License Management**: Online license validation and activation system
- **⚙️ Settings Management**: Shop information, language, printer configuration, and more

## 🛠 Tech Stack

### Frontend
- **React 18.2.0**: UI framework
- **React Router 6.20.0**: Client-side routing
- **React i18next**: Internationalization (English/Urdu)
- **Axios**: HTTP client for API communication
- **CSS3**: Custom styling with modern UI/UX

### Backend
- **Node.js**: Runtime environment
- **Express 4.18.2**: Web framework
- **PostgreSQL**: Relational database
- **bcrypt**: Password hashing
- **UUID**: Session and ID generation
- **node-cron**: Scheduled tasks (backups)

### Desktop Application
- **Electron 28.0.0**: Desktop app framework
- **electron-builder**: Application packaging and distribution

### Key Dependencies
- **pg (PostgreSQL)**: Database driver
- **express-session**: Session management
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## 🏗 Architecture

### Project Structure

```
HisaabKitab/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components (34 components)
│   │   ├── contexts/        # React contexts (Auth, License)
│   │   ├── services/        # API service layer
│   │   ├── locales/         # Translation files (en.json, ur.json)
│   │   └── utils/           # Utility functions
│   └── public/              # Static assets
├── backend/                 # Node.js/Express backend
│   ├── routes/              # API route handlers (18 routes)
│   ├── middleware/          # Express middleware (auth, license)
│   ├── utils/               # Utility modules
│   └── server.js            # Express server entry point
├── database/                # Database scripts and migrations
├── main.js                  # Electron main process
├── preload.js               # Electron preload script
└── package.json             # Root package configuration
```

### Application Flow

1. **Electron Main Process** (`main.js`): Launches the desktop application
2. **Backend Server** (`backend/server.js`): Starts Express API server on port 5000
3. **React Frontend**: Serves UI on port 3000 (dev) or from build (production)
4. **Database**: PostgreSQL database for data persistence
5. **Communication**: Frontend communicates with backend via REST API

### Key Components

#### Frontend Components (34 total)
- **Dashboard**: Business overview and metrics
- **Billing**: POS interface for creating sales
- **Inventory**: Product management
- **Sales**: Sales transaction history and management
- **Customers**: Customer management and credit tracking
- **Suppliers**: Supplier management
- **Purchases**: Purchase order management
- **Expenses**: Daily expense tracking
- **Reports**: Comprehensive reporting system
- **Settings**: Application configuration
- **Users**: User management (Admin only)
- **Categories**: Product category management
- **RateList**: Product pricing management
- **Notifications**: Real-time notification system

#### Backend Routes (18 total)
- `/api/auth`: Authentication (login, logout, password management)
- `/api/products`: Product CRUD operations
- `/api/sales`: Sales transactions
- `/api/customers`: Customer management
- `/api/suppliers`: Supplier management
- `/api/purchases`: Purchase management
- `/api/expenses`: Expense tracking
- `/api/reports`: Reporting endpoints
- `/api/categories`: Category management
- `/api/users`: User management
- `/api/settings`: Application settings
- `/api/notifications`: Notification system
- `/api/backup`: Backup and restore operations
- `/api/license`: License validation

## 🚀 Installation

### Prerequisites

- **Node.js**: v16+ (recommended: v18+)
- **PostgreSQL**: v12+ (recommended: v14+)
- **npm**: v8+ or **yarn**
- **Windows**: 10/11 (for building Windows installer)

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd HisaabKitab
```

### Step 2: Install Dependencies

```bash
# Install all dependencies (root, frontend, backend)
npm run install:all
```

Or manually:
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

### Step 3: Database Setup

1. **Create PostgreSQL Database**:
```sql
CREATE DATABASE hisaabkitab;
```

2. **Configure Environment Variables**:
Create `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hisaabkitab
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
HOST=0.0.0.0
```

3. **Initialize Database**:
```bash
npm run setup:db
```

Or manually:
```bash
node database/setup.js
```

### Step 4: Run Application

#### Development Mode
```bash
npm run dev
```

This starts:
- Backend server on `http://localhost:5000`
- React dev server on `http://localhost:3000`
- Electron app window

#### Production Mode
```bash
# Build React app
npm run build:react

# Start backend
cd backend && npm start

# Start Electron
npm start
```

## ⚙️ Configuration

### Environment Variables

#### Backend (`backend/.env`)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hisaabkitab
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=5000
HOST=0.0.0.0

# License Server (Optional)
LICENSE_SERVER_URL=https://api.zentryasolutions.com
LICENSE_API_KEY=your_api_key

# Read-Only Mode (for client PCs)
READ_ONLY_MODE=false
```

### Application Settings

Accessible via Settings menu in the application:
- **Shop Information**: Name, address, phone
- **Language**: English/Urdu
- **Printer Configuration**: Thermal printer setup
- **Backup Settings**: Automated backup configuration
- **License Activation**: Online license validation

## 📖 Usage

### First-Time Setup

1. Launch the application
2. Complete first-time setup wizard:
   - Database connection configuration
   - Create administrator account
   - Set security questions
3. Activate license (if required)
4. Configure shop information in Settings

### User Roles

#### Administrator
- Full access to all features
- User management
- Settings configuration
- Reports access
- Can edit/delete sales
- License management

#### Cashier
- Access to Dashboard, Billing, Sales (view), Products, Customers, Rate List
- Can create sales and view details
- Cannot edit/delete sales
- Cannot access Reports, Suppliers, Categories, Users, Settings (edit)

### Key Workflows

#### Creating a Sale
1. Navigate to **Billing** or click "New Sale"
2. Add products to cart
3. Select customer (optional)
4. Apply discount/tax if needed
5. Choose payment type (Cash/Credit/Split)
6. Complete sale
7. Print invoice (optional)

#### Managing Inventory
1. Go to **Products** (Inventory)
2. Add new product or edit existing
3. Set purchase price, selling price, stock quantity
4. Assign category and supplier
5. Mark as "frequently sold" for quick access

#### Managing Customers
1. Navigate to **Customers**
2. Add customer with contact information
3. View customer history and outstanding balance
4. Record payments for credit recovery

#### Generating Reports
1. Go to **Reports**
2. Select report type (Sales, Profit, Stock, etc.)
3. Choose date range
4. View and export data

## 📡 API Documentation

### Authentication

All API routes (except `/api/health` and `/api/license/validate`) require authentication via session.

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

#### Logout
```http
POST /api/auth/logout
```

### Core Endpoints

#### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create sale
- `GET /api/sales/:id` - Get sale details
- `PUT /api/sales/:id` - Update sale (Admin only)
- `DELETE /api/sales/:id` - Delete sale (Admin only)

#### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers/:id/payments` - Record customer payment

#### Reports
- `GET /api/reports/dashboard` - Dashboard data
- `GET /api/reports/sales-summary` - Sales summary
- `GET /api/reports/profit` - Profit report
- `GET /api/reports/stock-current` - Current stock
- `GET /api/reports/customers-due` - Customer outstanding

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

Error Response:
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

## 🗄 Database Schema

### Core Tables

- **users**: User accounts and authentication
- **products**: Product catalog
- **categories**: Product categories
- **customers**: Customer information
- **suppliers**: Supplier information
- **sales**: Sales transactions
- **sale_items**: Individual items in sales
- **purchases**: Purchase orders
- **purchase_items**: Items in purchases
- **expenses**: Daily expenses
- **customer_payments**: Customer payment records
- **supplier_payments**: Supplier payment records
- **notifications**: System notifications
- **user_sessions**: Active user sessions
- **audit_logs**: Security audit trail
- **settings**: Application settings

### Key Relationships

- Sales → Sale Items → Products
- Sales → Customers (optional)
- Purchases → Purchase Items → Products
- Purchases → Suppliers
- Products → Categories
- Products → Suppliers

## 💻 Development

### Development Scripts

```bash
# Start all services in development mode
npm run dev

# Start backend only
npm run dev:backend

# Start frontend only
npm run dev:react

# Start Electron only
npm run dev:electron
```

### Code Structure

- **Frontend**: Component-based architecture with React hooks
- **Backend**: RESTful API with Express routes
- **State Management**: React Context API (Auth, License)
- **Styling**: CSS modules with component-specific styles
- **Internationalization**: i18next with JSON translation files

### Adding New Features

1. **New Component**: Create in `frontend/src/components/`
2. **New Route**: Add to `backend/routes/`
3. **New API Endpoint**: Add to appropriate route file
4. **Translation**: Add keys to `frontend/src/locales/en.json` and `ur.json`

## 📦 Building & Distribution

### Build React App
```bash
npm run build:react
```

### Build Electron App
```bash
npm run build:electron
```

### Build Complete Application
```bash
npm run build
```

### Build Signed Installer (Windows)
```bash
npm run build:signed
```

### Output
- Windows installer: `dist/HisaabKitab Setup 1.0.0.exe`
- Application files: `dist/win-unpacked/`

## 🔐 License System

HisaabKitab includes an online license validation system:

- **License Server**: Validates licenses against remote server
- **Device Fingerprinting**: Unique device identification
- **Activation**: One-time activation per device
- **Validation**: Periodic license status checks
- **Revocation**: Server can revoke licenses remotely

### License Flow

1. User activates license with activation code
2. System generates device fingerprint
3. License validated against remote server
4. License stored locally with expiration
5. Periodic revalidation ensures license is still valid

## 🔒 Security & Authentication

### Authentication
- **Session-based**: Express sessions with secure cookies
- **Password Hashing**: bcrypt with salt rounds
- **PIN Login**: 4-digit PIN support for cashiers
- **Session Management**: 24-hour session expiration

### Authorization
- **Role-Based Access Control (RBAC)**: Administrator and Cashier roles
- **Route Protection**: Middleware-based route guards
- **Operation Guards**: Frontend and backend operation blocking

### Security Features
- **Audit Logging**: All sensitive operations logged
- **Password Recovery**: Security question-based recovery
- **Read-Only Mode**: Client PCs can run in read-only mode
- **Input Validation**: Server-side validation for all inputs

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check `.env` file configuration
- Ensure database exists: `CREATE DATABASE hisaabkitab;`
- Test connection: `psql -U postgres -d hisaabkitab`

### Port Already in Use
- Backend (5000): Change `PORT` in `backend/.env`
- Frontend (3000): React will automatically use next available port

### Build Issues
- Clear node_modules: `rm -rf node_modules frontend/node_modules backend/node_modules`
- Reinstall: `npm run install:all`
- Clear cache: `npm cache clean --force`

### License Issues
- Check internet connection for license validation
- Verify license server URL in settings
- Check device fingerprint matches activation

### Performance Issues
- Database indexes may need optimization
- Large datasets: Use pagination (already implemented)
- Backup large databases before operations

## 📝 License

MIT License - See LICENSE file for details

## 👥 Support

For issues, questions, or contributions, please contact the development team.

---

**HisaabKitab** - حساب کتاب - Your Complete POS & Inventory Solution
