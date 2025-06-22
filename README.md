# Bakery - Next.js + Strapi Monorepo

## 🏗️ Architecture

This monorepo contains:
- **`apps/web`** : Next.js 15 application with product interface
- **`apps/strapi`** : Strapi CMS for product management
- **`packages/ui`** : Shared UI components based on ShadCN
- **`packages/eslint-config`** : Shared ESLint configuration
- **`packages/typescript-config`** : Shared TypeScript configuration

## 🚀 Quick Start

### 1. Install dependencies
```bash
pnpm install
```

### 2. Launch applications

#### Launch Next.js only (with test data)
```bash
pnpm run dev:web
```
→ Interface available at http://localhost:3000

#### Launch Strapi only
```bash
pnpm run dev:strapi
```
→ Strapi admin available at http://localhost:1337/admin

#### Launch both in parallel
```bash
pnpm run dev:all
```

## 📱 Features

### Next.js Interface (Port 3000)
- ✅ Responsive product grid
- ✅ Product cards with ShadCN UI
- ✅ Integrated test data (demo mode)
- ✅ Loading state management
- ✅ Automatic Strapi API connection

### Strapi CMS (Port 1337)
- ✅ Product model (name, description, price, image)
- ✅ Public REST API
- ✅ Image upload
- ✅ CORS configured for Next.js

## 🗄️ Database & Authentication

### Database Setup (PostgreSQL + Strapi)
This project now uses a real PostgreSQL database with Strapi as the backend API, replacing mock data with persistent storage.

#### Quick Setup
```bash
# Automatic setup (recommended)
./start-system.sh

# Manual setup
brew install postgresql  # macOS
brew services start postgresql
psql postgres -c "CREATE DATABASE boulangerie;"
```

### Authentication System
- ✅ **Secure JWT authentication** via Strapi users-permissions
- ✅ **User roles** (CLIENT, EMPLOYEE, ADMIN) with granular permissions
- ✅ **Protected routes** on both server and client side
- ✅ **Extended user profiles** with preferences and order history
- ✅ **Session management** with automatic token refresh

### New Features Available
- 🛒 **Complete order system** (pickup only)
- 👥 **User management** with profiles and preferences
- 📊 **Admin dashboard** with real-time statistics
- 📦 **Inventory management** with stock tracking
- 🔐 **Role-based permissions** and access control

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/local/register` - User registration
- `POST /api/auth/local` - User login
- `GET /api/utilisateurs/me` - Get user profile
- `PUT /api/utilisateurs/me` - Update user profile
- `GET /api/utilisateurs/historique` - Order history

### Orders & Products
- `GET /api/produits` - List products (public)
- `GET /api/categories` - List categories (public)
- `POST /api/commandes` - Create order (authenticated)
- `GET /api/commandes` - List orders (admin/employee)
- `PUT /api/commandes/:id/statut` - Update order status (admin/employee)
- `GET /api/commandes/stats` - Order statistics (admin/employee)

## 📋 Development Workflow

### First Time Setup
1. **Install dependencies**: `pnpm install`
2. **Start PostgreSQL**: `brew services start postgresql`
3. **Launch system**: `./start-system.sh`
4. **Configure Strapi admin**: Visit http://localhost:1337/admin
5. **Set permissions**: Configure user roles in Strapi admin
6. **Add test data**: Create categories and products
7. **Test frontend**: Visit http://localhost:3000

### Environment Variables
```bash
# apps/strapi/.env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=boulangerie
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password

# apps/web/.env.local
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

## 🎯 User Stories Implemented

### Customer Flow
- ✅ Browse products by category
- ✅ Add items to cart
- ✅ Register/Login account
- ✅ Complete order process (pickup scheduling)
- ✅ View order history
- ✅ Manage profile and preferences

### Employee/Admin Flow
- ✅ Real-time order dashboard
- ✅ Update order status
- ✅ Manage inventory and stock
- ✅ View sales statistics
- ✅ Manage users and permissions
- ✅ Access admin interface with role protection

## 🔧 Technical Stack

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **UI**: ShadCN/UI + Tailwind CSS
- **State**: React Context + Custom hooks
- **Auth**: JWT with secure storage
- **API**: Custom Strapi client with TypeScript

### Backend (Strapi)
- **CMS**: Strapi v5 with PostgreSQL
- **Auth**: users-permissions plugin + custom extensions
- **API**: REST with custom controllers
- **Security**: CORS, JWT, role-based permissions
- **Database**: PostgreSQL with migrations

### DevOps
- **Monorepo**: Turborepo with pnpm workspaces
- **Linting**: ESLint + TypeScript strict mode
- **Scripts**: Automated startup and deployment

## 📚 Documentation

- [Migration Guide](./GUIDE_MIGRATION.md) - Complete guide for setting up the database
- [Testing Guide](./GUIDE_TEST.md) - How to test all features and user flows  
- [Migration Summary](./MIGRATION_SUMMARY.md) - Overview of changes from mock to real data

## 🚦 Project Status

✅ **Production Ready** - Full e-commerce system with:
- Real PostgreSQL database
- Secure JWT authentication
- Role-based permissions
- Complete order management
- Admin dashboard
- Inventory tracking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
