# Wine and Food Pairing App

## What This App Does
A wine pairing recommendation tool that helps users find the perfect wine to match their food. Users select a food category (fish, chicken, beef, pork, lamb, vegetarian, cheese, dessert, sauce) and a preparation style, then receive wine style recommendations and specific wine suggestions with purchasable wine recommendations.

## Tech Stack
- **Frontend**: Angular 19 with Angular Material UI
- **Backend**: NestJS with TypeScript (wine-api/)
- **Database**: PostgreSQL (Railway)
- **Hosting**: Vercel (frontend) / Railway (backend + database)
- **Styling**: SCSS with Angular Material theming

## Project Structure
```
wine-and-food-pairing-ang/
├── wine-finder-app/              # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── header/
│   │   │   │   ├── footer/
│   │   │   │   ├── wine-finder/
│   │   │   │   ├── wine-recommendations/
│   │   │   │   ├── wine-detail-modal/
│   │   │   │   ├── wine-form-dialog/
│   │   │   │   ├── varietal-mapping/
│   │   │   │   └── admin-login/
│   │   │   ├── pages/
│   │   │   │   ├── home/
│   │   │   │   └── admin/
│   │   │   ├── services/
│   │   │   │   ├── pairing.service.ts
│   │   │   │   ├── wine.service.ts
│   │   │   │   ├── wine-api.service.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── models/
│   │   │   │   ├── pairing.model.ts
│   │   │   │   └── wine.model.ts
│   │   │   ├── data/
│   │   │   │   └── wines.data.ts
│   │   │   └── app.routes.ts
│   │   ├── environments/
│   │   └── assets/images/
│   └── .claude/CLAUDE.md
├── wine-api/                     # NestJS backend
│   ├── src/
│   │   ├── wines/
│   │   │   ├── entities/wine.entity.ts
│   │   │   ├── dto/
│   │   │   ├── wines.service.ts
│   │   │   ├── wines.controller.ts
│   │   │   └── wines.module.ts
│   │   ├── varietal-mappings/
│   │   │   ├── entities/varietal-mapping.entity.ts
│   │   │   ├── dto/
│   │   │   ├── varietal-mappings.service.ts
│   │   │   ├── varietal-mappings.controller.ts
│   │   │   └── varietal-mappings.module.ts
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── seed.ts
│   ├── .env.example
│   └── railway.json
└── wine-and-food-pairing-static/ # Original static reference
```

## Design System
Always utilize the frontend-design skill

### Colors
- **Primary**: `#0a7373` (teal)
- **Secondary**: `#c43302` (burnt orange)
- **Tertiary**: `#edaa25` (gold)
- **Background**: `#ffffff`
- **Text Dark**: `#010221`
- **Text Medium**: `#315D5D`
- **Text Light**: `#9DC1C1`
- **Card Background**: `rgba(255, 255, 255, 0.85)`
- **Footer Background**: `#3d4545`

### Typography
- **Display Font**: Cormorant Garamond (serif)
- **Body Font**: Quattrocento Sans (sans-serif)

## Key Features

### Public Pages
- **Home**: Wine pairing selector with recommendations
- **Wine Recommendations**: Shows purchasable wines based on pairing suggestions

### Admin Section (Password Protected)
- **Login**: `/admin/login` (password: `winelover2024`)
- **Wine Inventory**: Add/edit/delete wines
- **Varietal Mapping**: Map wines to varietal suggestions
- **Data Export**: Download JSON backup

## API Endpoints (NestJS Backend)

### Wines
- `GET /api/wines` - Get all wines
- `GET /api/wines/:id` - Get single wine
- `GET /api/wines/varietals` - Get unique varietals
- `GET /api/wines/by-varietal/:varietal` - Get wines by varietal
- `POST /api/wines` - Create wine
- `PATCH /api/wines/:id` - Update wine
- `DELETE /api/wines/:id` - Delete wine

### Varietal Mappings
- `GET /api/varietal-mappings` - Get all mappings (grouped by varietal)
- `GET /api/varietal-mappings/varietals` - Get all mapped varietals
- `GET /api/varietal-mappings/recommendations?varietals=a,b&limit=10` - Get wine recommendations
- `GET /api/varietal-mappings/:varietal` - Get wines for varietal
- `POST /api/varietal-mappings` - Create mapping
- `DELETE /api/varietal-mappings/:varietal/:wineId` - Remove mapping

## Database Schema

### wines table
```sql
CREATE TABLE wines (
  id SERIAL PRIMARY KEY,
  winery_name VARCHAR(255) NOT NULL,
  wine_name VARCHAR(255) NOT NULL,
  varietal VARCHAR(100) NOT NULL,
  year INTEGER,
  estimated_price DECIMAL(10,2) NOT NULL,
  winery_city VARCHAR(100) NOT NULL,
  winery_state VARCHAR(100) NOT NULL,
  ava VARCHAR(255),                    -- American Viticultural Area (e.g., "Willamette Valley")
  winery_address VARCHAR(255) NOT NULL,
  winery_url VARCHAR(500) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### varietal_mappings table
```sql
CREATE TABLE varietal_mappings (
  id SERIAL PRIMARY KEY,
  varietal VARCHAR(100) NOT NULL,
  wine_id INTEGER REFERENCES wines(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
ADMIN_PASSWORD=winelover2024
```

## Running the App

### Development
```bash
# Frontend (from wine-finder-app/)
npm install
npm start                    # or: ng serve
# Open http://localhost:4200

# Backend (from wine-api/)
npm install
npm run start:dev
# API runs on http://localhost:3000

# Seed database (after setting up PostgreSQL)
npm run seed
```

### Production Build
```bash
# Frontend
npm run build                # or: ng build --configuration production

# Backend
npm run build
npm run start:prod
```

### Testing

#### Unit Tests (Frontend)
```bash
cd wine-finder-app
npm test                     # Run Karma unit tests
```

#### E2E Tests with Playwright
```bash
cd wine-finder-app

# Run all e2e tests (headless)
npm run e2e

# Run tests with Playwright UI (interactive)
npm run e2e:ui

# Run tests with visible browser
npm run e2e:headed

# Run only scraper tests with visible browser
npm run scrape
```

#### URL Scraper
The URL scraper helps extract wine/winery data from websites to populate the database.
set up tests in scraper.specs.ts

```bash
# Scrape a specific URL
SCRAPE_URL="https://example-winery.com" npm run scrape

# Run scraper tests (edit e2e/scraper.spec.ts to add URLs)
npx playwright test e2e/scraper.spec.ts --headed

# scrape one winery
npx playwright test e2e/scraper.spec.ts --grep "scrape winery"

# scrape a list of wineries
npx playwright test e2e/scraper.spec.ts --grep "batch scrape multiple wineries"

# open last report
npx playwright show-report
```

**Scraper Features:**
- Extract winery name, address, city, state
- Find wine product details (name, varietal, year, price)
- Discover wine images
- Extract descriptions and tasting notes

**Test Files:**
- `e2e/app.spec.ts` - Basic app navigation and auth tests
- `e2e/scraper.spec.ts` - URL scraper demonstration tests
- `e2e/url-scraper.ts` - Scraper utility class

## Deployment

### Frontend (Vercel - FREE)
1. Connect GitHub repo to Vercel
2. Set root directory to `wine-finder-app`
3. Build command: `ng build --configuration production`
4. Output directory: `dist/wine-finder-app/browser`
5. Add environment variable: `apiUrl` pointing to Railway API

### Backend + Database (Railway)
1. Create new Railway project
2. Add PostgreSQL plugin (auto-generates DATABASE_URL)
3. Deploy NestJS app from `wine-api` directory
4. Environment variables set automatically by Railway
5. Run `npm run seed` to populate initial data

## Admin Access
- URL: `/admin` (redirects to login if not authenticated)
- Password: `xxxxx` (change in `auth.service.ts`)
- Session stored in sessionStorage (clears on tab close)
- Access via small "Admin" link in footer
- Login popup has close button (X) that returns to home

## NPM Scripts Quick Reference

### wine-finder-app (Frontend)
| Command | Description |
|---------|-------------|
| `npm start` | Start dev server (http://localhost:4200) |
| `npm run build` | Production build |
| `npm test` | Run unit tests (Karma) |
| `npm run e2e` | Run Playwright e2e tests (headless) |
| `npm run e2e:ui` | Run Playwright with interactive UI |
| `npm run e2e:headed` | Run Playwright with visible browser |
| `npm run scrape` | Run URL scraper tests with visible browser |

### wine-api (Backend)
| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run start:prod` | Start production server |
| `npm run seed` | Seed database with initial data |

## Local PostgreSQL Setup

```bash
# Start PostgreSQL (macOS with Homebrew)
brew services start postgresql@18

# Connect to PostgreSQL (uses your macOS username)
psql -d postgres

# Create database
CREATE DATABASE wine_finder;

# .env file for wine-api
DATABASE_URL=postgresql://YOUR_USERNAME@localhost:5432/wine_finder
```

## Wine Model Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| wineryName | string | Yes | Name of the winery |
| wineName | string | Yes | Name of the wine |
| varietal | string | Yes | Grape variety (e.g., "Pinot Noir") |
| year | number | No | Vintage year |
| estimatedPrice | number | Yes | Price in USD |
| wineryCity | string | Yes | City where winery is located |
| wineryState | string | Yes | State abbreviation (e.g., "OR") |
| ava | string | No | American Viticultural Area (e.g., "Willamette Valley") |
| wineryAddress | string | Yes | Street address |
| wineryUrl | string | Yes | Winery website URL |
| imageUrl | string | Yes | Full-size wine image URL |
| thumbnailUrl | string | Yes | Thumbnail image URL |
| description | string | No | Wine description/tasting notes |
