# Hotel Booking System

A modern hotel booking application built with Laravel 12 and React, featuring advanced search capabilities with Elasticsearch integration, real-time booking management, and a beautiful responsive UI.

## 🚀 Overview

<iframe width="640" height="416" src="https://www.loom.com/embed/610d6d94076a47b3b5a99d959d32eece?sid=e83f1d3b-fc1e-4f81-be92-44cbe1809057" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

## 🛠️ Tech Stack

### Backend
- **Laravel 12** - PHP framework
- **PHP 8.2+** - Programming language
- **MySQL** - Primary database
- **Elasticsearch** - Search engine
- **Redis** - Caching and sessions
- **Laravel Scout** - Full-text search
- **Spatie Media Library** - File management

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Inertia.js** - SPA-like experience
- **Tailwind CSS 4** - Styling
- **Radix UI** - Accessible components
- **Vite** - Build tool

### Development Tools
- **Laravel Sail** - Docker development environment
- **Pest** - Testing framework
- **ESLint & Prettier** - Code quality
- **Laravel Pint** - PHP code style

## 📋 Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- Docker and Docker Compose (for Sail)

## 🚀 Quick Start

### Using Laravel Sail (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/sahapranta/hotel
   cd hotel
   ```

2. **Install dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Start the development environment**
   ```bash
   ./vendor/bin/sail up -d
   ```

4. **Run database migrations and seeders**
   ```bash
   ./vendor/bin/sail artisan migrate --seed
   ```

5. **Build frontend assets**
   ```bash
   ./vendor/bin/sail npm run dev
   ```

6. **Access the application**
   - Application: http://localhost:8000
   - Admin Dashboard: http://localhost:8000/admin/dashboard

### Manual Setup

1. **Install PHP dependencies**
   ```bash
   composer install
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database setup**
   ```bash
   php artisan migrate --seed
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Laravel server
   php artisan serve
   
   # Terminal 2: Vite dev server
   npm run dev
   ```

## 🗄️ Database Structure

### Core Models
- **Users**: Authentication and user management
- **Hotels**: Hotel information with media support
- **Rooms**: Room types, pricing, and availability
- **Bookings**: Reservation management with status tracking

### Key Relationships
- Hotels belong to users (hotel owners)
- Hotels have many rooms
- Bookings belong to users and hotels
- Bookings can have multiple rooms

## 🔍 Search Features

The application includes a sophisticated search system with:

- **Elasticsearch Integration**: Fast full-text search across hotel data
- **Database Fallback**: Automatic fallback when Elasticsearch is unavailable
- **Advanced Filtering**: Price range, star rating, location, and availability
- **Search Analytics**: Track search performance and user behavior

## 🎨 Frontend Architecture

- **Component-based**: Reusable React components with TypeScript
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Built with Radix UI for accessibility compliance
- **State Management**: Inertia.js for seamless server-client communication

## 🧪 Testing

Run the test suite:

```bash
# Using Sail
./vendor/bin/sail test

# Manual
php artisan test
```

## 📦 Available Scripts

### Composer Scripts
- `composer dev` - Start all development services
- `composer dev:ssr` - Start with SSR enabled
- `composer test` - Run test suite

### NPM Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run build:ssr` - Build with SSR
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🐳 Docker Services

The application includes the following Docker services:

- **Laravel App**: Main application server
- **MySQL**: Database server
- **Redis**: Cache and session storage
- **Elasticsearch**: Search engine
- **MinIO**: S3-compatible object storage

## 🔧 Configuration

### Environment Variables

Key environment variables to configure:

```env
# Database
DB_CONNECTION=mysql
DB_HOST=mysql
DB_DATABASE=hotel
DB_USERNAME=sail
DB_PASSWORD=password

# Elasticsearch
SCOUT_DRIVER=Matchish\ScoutElasticSearch\Engines\ElasticSearchEngine
ELASTICSEARCH_HOST=elasticsearch:9200

# Redis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
```

## 📁 Project Structure

```
app/
├── DTOs/              # Data Transfer Objects
├── Enums/             # Application enums
├── Events/            # Event classes
├── Http/
│   ├── Controllers/   # API controllers
│   ├── Middleware/    # Custom middleware
│   ├── Requests/      # Form request validation
│   └── Resources/     # API resources
├── Models/            # Eloquent models
├── Repositories/      # Data access layer
└── Services/          # Business logic

resources/
├── js/
│   ├── components/    # React components
│   ├── pages/         # Inertia pages
│   ├── layouts/       # Page layouts
│   └── types/         # TypeScript types
└── css/               # Stylesheets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.

---

Built with ❤️ using Laravel and React
