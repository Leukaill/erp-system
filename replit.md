# AgriFlow ERP System

## Overview

AgriFlow is a comprehensive Enterprise Resource Planning (ERP) system designed specifically for Rwandan SME farms. The application provides farm management capabilities including financial management, project tracking, inventory control, and operational oversight through a modern web interface with a premium Apple/Google-inspired design aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (July 2024)

✓ Successfully migrated from Replit authentication to local authentication system
✓ Implemented secure username/password authentication with bcrypt-style password hashing
✓ Created comprehensive local auth system that works independently of Replit for render.com deployment
✓ Built beautiful authentication pages with login and registration forms
✓ Added logout functionality with proper session management
✓ Updated all API routes to use local user structure instead of Replit user structure
✓ Populated database with extensive demo data including:
  - 8 realistic agricultural projects (coffee, maize, beans, greenhouse, fruits, livestock, sweet potato, mushrooms)
  - 30 comprehensive inventory items across categories (seeds, fertilizers, pesticides, equipment, tools)
  - 25 financial transactions with realistic amounts and categories
  - 8 farm management tasks with priorities and assignments
  - 7 system activities and notifications
  - 4 farm sectors with detailed soil and irrigation information
  - 2 demo users with proper credentials for testing
✓ All modules now populated with realistic Rwandan farm data for demonstration
✓ Authentication system ready for render.com deployment without Replit dependencies

Demo Login Credentials:
- Email: manager@agriflow.rw / Password: password123
- Email: supervisor@agriflow.rw / Password: password123



## System Architecture

This is a full-stack TypeScript application built with a modern monorepo structure using a client-server architecture:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API endpoints
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage

### Database Layer
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM with type-safe queries
- **Migration**: Drizzle Kit for schema management
- **Connection**: Connection pooling via Neon serverless driver

## Key Components

### Authentication System
- Replit Auth integration for user authentication
- Session-based authentication with secure cookies
- User profile management with role-based access
- Automatic session persistence in PostgreSQL

### Data Models
The system manages several core entities:
- **Users**: Farm managers with profiles and roles
- **Projects**: Farm projects (crops, livestock) with progress tracking
- **Inventory**: Stock management for seeds, fertilizers, equipment
- **Transactions**: Financial records for income and expenses
- **Tasks**: Daily farm activities and todo items
- **Farm Sectors**: Geographic divisions of farm operations
- **Activities**: System activity logs and notifications

### API Structure
RESTful endpoints organized by domain:
- `/api/auth/*` - Authentication endpoints
- `/api/dashboard/*` - Dashboard metrics and summaries
- `/api/projects/*` - Project CRUD operations
- `/api/inventory/*` - Inventory management
- `/api/financial/*` - Financial transactions and reports
- `/api/tasks/*` - Task management
- `/api/activities/*` - Activity feed

### UI Architecture
- Responsive design with mobile-first approach
- Component-based architecture with reusable UI components
- Dashboard-centric layout with sidebar navigation
- Real-time data updates via React Query
- Toast notifications for user feedback

## Data Flow

1. **Authentication Flow**: Users authenticate via Replit Auth, sessions stored in PostgreSQL
2. **API Requests**: Frontend makes authenticated requests via fetch with credentials
3. **Data Fetching**: React Query manages server state with automatic caching and invalidation
4. **Database Operations**: Drizzle ORM handles type-safe database queries
5. **Real-time Updates**: Optimistic updates and query invalidation for responsive UX

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM and query builder
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **express**: Node.js web framework
- **passport**: Authentication middleware

### Development Tools
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: Production bundling for server code
- **@replit/***: Replit-specific integrations

### Authentication
- **openid-client**: OpenID Connect client implementation
- **connect-pg-simple**: PostgreSQL session store
- **express-session**: Session middleware

## Deployment Strategy

### Development Environment
- Vite dev server with HMR for frontend development
- tsx for TypeScript execution in development
- Integrated Replit environment with live preview

### Production Build
1. Frontend: Vite builds client to `dist/public`
2. Backend: esbuild bundles server to `dist/index.js`
3. Database: Drizzle migrations ensure schema consistency

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Session secrets and OAuth configuration via environment variables
- Replit-specific configuration for authentication domains

### Hosting Considerations
- Designed for Replit hosting with integrated authentication
- PostgreSQL database provisioning required
- Session storage configured for production persistence
- Static asset serving handled by Express in production