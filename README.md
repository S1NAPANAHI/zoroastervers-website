# ZOROASTER - Novel Worldbuilding Hub

*by Sina Panahi*

A comprehensive digital platform for exploring the **ZOROASTER** universe - a fantasy saga with complete admin management system, hierarchical content structure, and advanced e-commerce capabilities. Built with Next.js 15, TypeScript, and Supabase, featuring a full-stack admin dashboard for content management and real-time synchronization.

## 🌟 Features

### Complete Admin Management System
- **Books Manager**: Create and manage top-level book series with metadata, pricing, and completion status
- **Volumes Manager**: Organize volumes within books with ordering, pricing, and physical/digital options
- **Sagas Manager**: Manage story sagas within volumes with word count tracking and descriptions
- **Arcs Manager**: Control story arcs within sagas with detailed descriptions and word counts
- **Issues Manager**: Handle individual issues with release dates, content URLs, and status management
- **Timeline Manager**: Full CRUD operations for historical events with categories and descriptions
- **Shop Manager**: Legacy hierarchical shop management with advanced filtering
- **User Management**: Admin controls for user roles and permissions
- **Real-time Updates**: Changes reflect immediately across the platform
- **Authentication-Based Access**: Role-based admin access with secure authentication

### Hierarchical Database Structure
- **PostgreSQL Backend**: Complete Supabase integration with proper relational structure
- **5-Level Hierarchy**: Books → Volumes → Sagas → Arcs → Issues
- **Row Level Security**: Comprehensive RLS policies for data protection
- **Cascade Operations**: Proper cascade delete operations maintaining data integrity
- **Optimized Queries**: Indexed tables with relationship joins for performance
- **Type Safety**: Full TypeScript interfaces matching database schema

### Interactive Universal Timeline
- **1,700-year span**: Explore events from 500 CE to 2200 CE
- **Expandable event cards**: Click any event to reveal detailed descriptions, consequences, and related books
- **Smart navigation**: Book ribbons and smooth scrolling between eras
- **Dynamic backgrounds**: Progressive gradients that change as you scroll through different time periods
- **Date ruler**: Visual timeline indicator showing your current position in history
- **Admin Management**: Full CRUD operations for timeline events from admin dashboard

### Advanced E-Commerce Shop
- **Live Database Integration**: Real-time shop data from Supabase backend
- **Hierarchical Product Structure**: Dynamic structure based on database content
- **Multi-Level Purchasing**: Buy individual issues, volumes, or complete books with bundle discounts
- **Dynamic Filtering**: Filter by product level with live data updates
- **Admin-Controlled Pricing**: Pricing management through admin dashboard
- **Smart Cart System**: Add individual items or bundles with automatic discount calculation
- **Cart Drawer**: Slide-out cart accessible from header with item management
- **Status Management**: Draft, published, and archived content states

### Release Management & Content Control
- **Admin-Controlled Releases**: Manage publication status from admin dashboard
- **Integrated Countdown Timer**: Live countdown in navigation header
- **Status Transitions**: Draft → Published → Archived workflow
- **Release Date Management**: Set and manage release dates for issues
- **Content URL Management**: Link to actual content through admin interface
- **Bulk Operations**: Manage multiple items efficiently

### User Experience & Authentication
- **Role-Based Authentication**: Admin and user roles with different access levels
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Cosmic Background System**: Global high-resolution cosmic background with 6px blur glass overlay
- **Glassmorphism UI**: Modern glass effects with neon accents and backdrop filters
- **Elegant Typography**: Optimized Google Fonts (Playfair Display, Crimson Text, EB Garamond)
- **Dark Theme**: Immersive sci-fi aesthetic with floating particle animations
- **Performance Optimized**: Single global background eliminates redundant loading
- **Real-time Sync**: Live updates between admin changes and public views

### Technical Excellence
- **Next.js 15**: Latest App Router with TypeScript
- **Supabase Backend**: PostgreSQL database with real-time subscriptions
- **Full-Stack Architecture**: Complete frontend and backend integration
- **Type Safety**: Comprehensive TypeScript implementation
- **Performance Optimized**: Efficient queries and optimized rendering
- **Deployment Ready**: Configured for Vercel with environment management
- **Security**: Row Level Security, authentication, and input validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd novel-worldbuilding-hub

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
# or
 bun install
```

### Development

```bash
# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Header.tsx              # Navigation with countdown timer and cart
│   │   ├── EnhancedTimeline.tsx     # Main timeline component
│   │   ├── InteractiveTimelineEvent.tsx  # Expandable event cards
│   │   ├── AuthForm.tsx            # Login/signup forms
│   │   ├── admin/                  # Admin management components
│   │   │   ├── AdminSidebar.tsx    # Admin navigation sidebar
│   │   │   ├── AdminOverview.tsx   # Admin dashboard overview
│   │   │   ├── BookManager.tsx     # Books CRUD management
│   │   │   ├── BookModal.tsx       # Add/edit books modal
│   │   │   ├── VolumeManager.tsx   # Volumes CRUD management
│   │   │   ├── VolumeModal.tsx     # Add/edit volumes modal
│   │   │   ├── SagaManager.tsx     # Sagas CRUD management
│   │   │   ├── SagaModal.tsx       # Add/edit sagas modal
│   │   │   ├── ArcManager.tsx      # Arcs CRUD management
│   │   │   ├── ArcModal.tsx        # Add/edit arcs modal
│   │   │   ├── IssueManager.tsx    # Issues CRUD management
│   │   │   └── IssueModal.tsx      # Add/edit issues modal
│   │   └── shop/                   # Shop component directory
│   │       ├── BundleRecommendations.tsx    # Bundle suggestions
│   │       ├── CartDrawer.tsx               # Slide-out cart component
│   │       ├── GridView.tsx                 # Grid display for products
│   │       ├── HierarchicalShopTree.tsx     # Tree view for hierarchical browsing
│   │       └── ProgressivePurchaseModal.tsx # Multi-tier purchase modal
│   ├── api/
│   │   └── admin/                  # Admin API routes
│   │       ├── books/              # Books API endpoints
│   │       │   ├── route.ts        # GET, POST books
│   │       │   └── [id]/route.ts   # GET, PUT, DELETE specific book
│   │       ├── volumes/            # Volumes API endpoints
│   │       │   ├── route.ts        # GET, POST volumes
│   │       │   └── [id]/route.ts   # GET, PUT, DELETE specific volume
│   │       ├── sagas/              # Sagas API endpoints
│   │       │   ├── route.ts        # GET, POST sagas
│   │       │   └── [id]/route.ts   # GET, PUT, DELETE specific saga
│   │       ├── arcs/               # Arcs API endpoints
│   │       │   ├── route.ts        # GET, POST arcs
│   │       │   └── [id]/route.ts   # GET, PUT, DELETE specific arc
│   │       ├── issues/             # Issues API endpoints
│   │       │   ├── route.ts        # GET, POST issues
│   │       │   └── [id]/route.ts   # GET, PUT, DELETE specific issue
│   │       ├── shop/               # Legacy shop API endpoints
│   │       └── timeline/           # Timeline events API endpoints
│   ├── contexts/
│   │   ├── AuthContext.tsx         # User authentication state
│   │   └── CartContext.tsx         # Shopping cart management
│   ├── admin/
│   │   └── page.tsx               # Admin dashboard main page
│   ├── books/
│   │   └── page.tsx               # Books overview page
│   ├── login/
│   │   └── page.tsx               # Login page
│   ├── overview/
│   │   └── page.tsx               # Series overview page
│   ├── profile/
│   │   └── page.tsx               # User profile page
│   ├── shop/
│   │   └── page.tsx               # E-commerce shop page
│   ├── signup/
│   │   └── page.tsx               # Signup page
│   ├── timeline/
│   │   └── page.tsx               # Interactive timeline page
│   ├── globals.css                # Global styles and font imports
│   ├── layout.tsx                 # Root layout with font optimization
│   └── page.tsx                   # Homepage with cosmic background
├── lib/
│   └── supabase.ts                # Supabase client configuration and types
├── database/
│   ├── schema.sql                 # Original database schema
│   └── hierarchical-schema.sql    # New hierarchical database schema
├── documentation/
│   ├── README.md                  # Main documentation
│   ├── file-structure-guide.md    # File structure explanation
│   ├── react-fundamentals.md      # React concepts guide
│   └── authentication-guide.md    # Authentication system guide
├── data/
│   └── shopData.ts                # Hierarchical shop product data
├── types/
│   └── shop.ts                    # TypeScript interfaces for shop
├── utils/
│   └── bundlePricing.ts           # Bundle pricing calculation utilities
└── public/
    └── covers/                    # Book cover images
```

## 🎨 Design System

### Color Palette
- **Primary**: Cyan (#4ECDC4) to Purple (#DDA0DD) gradients
- **Book Colors**: 
  - Book 1: Red (#FF6B6B) to Teal (#4ECDC4)
  - Book 2: Teal (#4ECDC4) to Blue (#45B7D1) 
  - Book 3: Blue (#45B7D1) to Green (#96CEB4)
  - Book 4: Green (#96CEB4) to Yellow (#FFEAA7)
  - Book 5: Yellow (#FFEAA7) to Purple (#DDA0DD)

### Typography
- **Headers**: Playfair Display (serif)
- **Body**: Crimson Text (serif)
- **Elegant**: EB Garamond (serif)
- **UI**: Geist (sans-serif)

### Glass Effects
- `glass-dark`: Dark glass with backdrop blur
- `glass-light`: Light glass with subtle transparency
- **Neon accents**: Glowing borders and shadows

## 🔧 Component Architecture

### EnhancedTimeline
Main timeline component featuring:
- Scroll-based animations and progress tracking
- Dynamic background gradients
- Book navigation ribbons
- Date ruler with current year indicator
- Helper functions for event data enrichment

### InteractiveTimelineEvent
Expandable event cards with:
- Detailed descriptions and consequences
- Related book information with purchase links
- Chapter references and relevance descriptions
- Smooth expand/collapse animations
- Left/right positioning based on timeline

### Shop Components

#### HierarchicalShopTree
Tree view component for browsing products hierarchically:
- Expandable/collapsible book and volume nodes
- Visual hierarchy with indentation and icons
- Direct purchase buttons at each level
- Real-time bundle pricing calculations

#### GridView
Grid display for quick product browsing:
- Responsive card layout
- Product images and pricing
- Quick add-to-cart functionality
- Filtered product display based on current selection

#### CartDrawer
Slide-out shopping cart component:
- Accessible from header cart indicator
- Item quantity management
- Real-time total calculations
- Remove items functionality
- Persistent cart state across sessions

#### ProgressivePurchaseModal
Multi-tier purchase recommendation system:
- Smart bundle suggestions based on selection
- Volume and book-level upgrade options
- Dynamic pricing with discount highlights
- Streamlined checkout process

#### BundleRecommendations
Intelligent bundle suggestion component:
- Analyzes current cart contents
- Suggests optimal bundles for savings
- Displays potential discounts
- One-click bundle upgrades

### Context Management

#### AuthContext
Provides:
- User authentication state
- Progress tracking (timeline exploration, purchases)
- Persistent user data
- Analytics integration hooks

#### CartContext
Manages shopping cart functionality:
- Add/remove items from cart
- Bundle pricing calculations
- Cart persistence across sessions
- Real-time cart totals and item counts
- Purchase history tracking

## 📚 Content Management

### Adding New Events
```typescript
// In EnhancedTimeline.tsx books array
{
  id: 'unique-event-id',
  title: 'Event Title',
  date: '1000 CE',
  year: 1000,
  bookId: 'book1',
  description: 'Short description',
  category: 'war', // war, discovery, prophecy, etc.
  icon: '⚔️'
}
```

### Extending Helper Functions
- **getFullDescription()**: Add detailed event descriptions
- **getRelatedBooks()**: Configure book pricing and purchase URLs
- **getConsequences()**: Define long-term event impacts
- **getChapterReferences()**: Map events to specific chapters

## 🛠️ Customization

### Fonts
Update font imports in `layout.tsx`:
```typescript
import { Playfair_Display, Crimson_Text, EB_Garamond, Geist } from 'next/font/google';
```

### Colors
Modify book colors and gradients in the `books` array within `EnhancedTimeline.tsx`.

### Timeline Data
Expand the universe by adding new books, events, and time periods in the component data structures.

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
The app is compatible with:
- Netlify
- AWS Amplify
- Railway
- Any Node.js hosting service

## 📈 Analytics & Tracking

The application tracks:
- Timeline exploration progress
- Event interactions
- Book purchase clicks
- User engagement metrics

Integration points are available in the `AuthContext` for connecting to:
- Google Analytics
- Mixpanel
- Custom analytics solutions

## 🔒 Security

- User authentication with secure session management
- Input validation on all forms
- XSS protection with React's built-in safeguards
- Environment variable management for sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is proprietary software for the ZOROASTER universe by Sina Panahi.

## 🎯 Roadmap

- [ ] Character profiles and relationship mapping
- [ ] Interactive world maps
- [ ] Book reading progress integration
- [ ] Community features (reviews, discussions)
- [ ] Mobile app version
- [ ] Multilingual support
- [ ] Advanced analytics dashboard
- [ ] E-book integration
- [ ] Audio timeline narration
- [ ] VR/AR timeline exploration

## 📋 Database Schema

### Hierarchical Content Structure

The application uses a 5-level hierarchical database structure:

```
Books → Volumes → Sagas → Arcs → Issues
```

#### Core Tables

**Books Table**
```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author TEXT NOT NULL DEFAULT 'S1NAPANAHI',
  price DECIMAL(10,2) DEFAULT 0,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  total_word_count INTEGER DEFAULT 0,
  is_complete BOOLEAN DEFAULT FALSE,
  physical_available BOOLEAN DEFAULT FALSE,
  digital_bundle BOOLEAN DEFAULT FALSE,
  publication_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Volumes Table**
```sql
CREATE TABLE volumes (
  id SERIAL PRIMARY KEY,
  book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  physical_available BOOLEAN DEFAULT FALSE,
  digital_bundle BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, order_index)
);
```

**Issues Table** (Final level)
```sql
CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  arc_id INTEGER NOT NULL REFERENCES arcs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'pre-order', 'coming-soon')),
  release_date DATE,
  content_url TEXT,
  cover_image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(arc_id, order_index)
);
```

#### Character Management Schema

**Characters Table**
```sql
CREATE TABLE characters (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  aliases TEXT[],
  description TEXT,
  appearance JSONB,
  height TEXT,
  weight TEXT,
  eye_color TEXT,
  hair_color TEXT,
  age_range TEXT,
  personality JSONB,
  skills TEXT[],
  abilities TEXT[],
  weaknesses TEXT[],
  motivations TEXT,
  fears TEXT,
  avatar_url TEXT,
  images JSONB,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deceased', 'unknown')),
  importance_level INTEGER DEFAULT 5 CHECK (importance_level >= 1 AND importance_level <= 10),
  is_main_character BOOLEAN DEFAULT FALSE,
  is_antagonist BOOLEAN DEFAULT FALSE,
  is_protagonist BOOLEAN DEFAULT FALSE,
  universe_id INTEGER,
  series_id INTEGER,
  season_id INTEGER,
  work_id INTEGER,
  first_appearance TEXT,
  creator TEXT,
  voice_actor TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by INTEGER,
  updated_by INTEGER
);
```

#### Security & Permissions

- **Row Level Security (RLS)** enabled on all tables
- **Admin-only policies** for full CRUD operations
- **Public read policies** for published content only
- **Cascade delete operations** maintain data integrity

## 🔌 API Endpoints

### Admin Content Management

#### Books API
- `GET /api/admin/books` - List all books with nested data
- `POST /api/admin/books` - Create new book
- `GET /api/admin/books/[id]` - Get specific book
- `PUT /api/admin/books/[id]` - Update book
- `DELETE /api/admin/books/[id]` - Delete book (cascades)

#### Volumes API
- `GET /api/admin/volumes` - List volumes with filtering
- `POST /api/admin/volumes` - Create new volume
- `PUT /api/admin/volumes/[id]` - Update volume
- `DELETE /api/admin/volumes/[id]` - Delete volume

#### Issues API
- `GET /api/admin/issues` - List issues with full hierarchy
- `POST /api/admin/issues` - Create new issue
- `PUT /api/admin/issues/[id]` - Update issue
- `DELETE /api/admin/issues/[id]` - Delete issue

### Character Management API

#### Characters
- `GET /api/characters` - List characters with advanced filtering
  - Query Parameters: `search`, `status`, `importance`, `sort`, `order`, `limit`, `offset`
  - Export formats: `format=json|csv`
- `POST /api/characters` - Create character or bulk import
- `GET /api/characters/[id]` - Get specific character
- `PUT /api/characters/[id]` - Update character
- `DELETE /api/characters/[id]` - Delete character

#### Character Relationships
- `GET /api/characters/relationships` - List character relationships
- `POST /api/characters/relationships` - Create relationship
- `PUT /api/characters/relationships/[id]` - Update relationship
- `DELETE /api/characters/relationships/[id]` - Delete relationship

#### Bulk Operations
- `POST /api/characters/bulk-import` - Import characters from CSV/JSON
- `GET /api/characters/bulk-import/preview` - Preview import data
- `GET /api/characters/templates` - Get import templates

### Public API

#### Timeline
- `GET /api/timeline` - Get timeline events
- `POST /api/timeline` - Create timeline event (admin)
- `PUT /api/timeline` - Update timeline event (admin)
- `DELETE /api/timeline` - Delete timeline event (admin)

#### Shop
- `GET /api/shop` - Get published shop items
- `GET /api/shop-items/hierarchy` - Get hierarchical shop structure

#### Posts (Creator Blog)
- `GET /api/posts` - List published blog posts
- `GET /api/posts/[slug]` - Get specific post by slug
- `POST /api/admin/posts` - Create post (admin)
- `PUT /api/admin/posts/[id]` - Update post (admin)

### API Response Format

**Success Response:**
```json
{
  "data": [...],
  "pagination": {
    "offset": 0,
    "limit": 50,
    "total": 100
  }
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "details": "Additional error context"
}
```

## 🧩 Component Usage Guide

### Admin Components

#### BookManager
```typescript
import BookManager from '@/app/components/admin/BookManager'

// Usage in admin dashboard
<BookManager />
```

**Features:**
- Full CRUD operations for books
- Status management (draft/published/archived)
- Search and filtering
- Hierarchical data display with nested volumes/sagas/arcs/issues

#### CharacterManager
```typescript
import CharacterManager from '@/app/components/admin/CharacterManager'

// Usage with props
<CharacterManager 
  searchTerm="" 
  statusFilter="all"
  importanceFilter="all"
/>
```

**Features:**
- Character CRUD operations
- Advanced filtering and search
- Bulk import/export (CSV/JSON)
- Relationship management
- Tag system integration

### Public Components

#### EnhancedTimeline
```typescript
import EnhancedTimeline from '@/app/components/EnhancedTimeline'

// Main timeline component
<EnhancedTimeline />
```

**Features:**
- Interactive 1,700-year timeline (500 CE - 2200 CE)
- Expandable event cards with detailed descriptions
- Dynamic background gradients
- Book navigation ribbons
- Scroll-based animations

#### Shop Components

```typescript
// Hierarchical shop tree
import HierarchicalShopTree from '@/app/components/shop/HierarchicalShopTree'
<HierarchicalShopTree />

// Grid view for products
import GridView from '@/app/components/shop/GridView'
<GridView products={products} onAddToCart={handleAddToCart} />

// Shopping cart drawer
import CartDrawer from '@/app/components/shop/CartDrawer'
<CartDrawer isOpen={isOpen} onClose={handleClose} />
```

### Context Providers

#### AuthContext
```typescript
import { useAuth } from '@/app/contexts/AuthContext'

function MyComponent() {
  const { user, login, logout, isAdmin } = useAuth()
  
  return (
    <div>
      {isAdmin && <AdminPanel />}
      {user ? <UserDashboard /> : <LoginForm />}
    </div>
  )
}
```

#### CartContext
```typescript
import { useCart } from '@/app/contexts/CartContext'

function ShopComponent() {
  const { 
    items, 
    addItem, 
    removeItem, 
    updateQuantity, 
    total,
    itemCount 
  } = useCart()
  
  return (
    <div>
      <button onClick={() => addItem(product)}>Add to Cart</button>
      <span>Items: {itemCount} | Total: ${total}</span>
    </div>
  )
}
```

### Custom Hooks

#### useSWR for Data Fetching
```typescript
import useSWR from 'swr'

// Fetch books with auto-refresh
const { data: books, error, mutate } = useSWR('/api/admin/books', fetcher)

// Fetch characters with filtering
const { data: characters } = useSWR(
  `/api/characters?search=${search}&status=${status}`,
  fetcher
)
```

## 🤝 Contributor Guidelines

### Getting Started

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/novel-worldbuilding-hub.git
   cd novel-worldbuilding-hub
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or yarn install / pnpm install / bun install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env.local
   # Fill in your Supabase credentials
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

### Development Workflow

#### Branch Naming Convention
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation changes
- `refactor/component-name` - Code refactoring
- `test/test-description` - Test additions/updates

#### Commit Message Format
```
type(scope): description

Optional body explaining the change in detail.

Fixes #issue-number
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

#### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make Changes**
   - Follow existing code style and patterns
   - Add appropriate TypeScript types
   - Include tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   npm run test        # Unit tests
   npm run test:e2e    # End-to-end tests
   npm run lint        # Code linting
   ```

4. **Submit Pull Request**
   - Provide clear description of changes
   - Reference related issues
   - Include screenshots for UI changes
   - Ensure all checks pass

### Code Standards

#### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Prefer type inference where possible
- Use meaningful type names

```typescript
// Good
interface Character {
  id: number
  name: string
  status: 'active' | 'inactive' | 'deceased'
}

// Avoid
interface CharData {
  id: any
  name: any
  status: string
}
```

#### React Components
- Use functional components with hooks
- Implement proper prop types
- Use descriptive component names
- Keep components focused and reusable

```typescript
// Good
interface BookCardProps {
  book: Book
  onEdit: (book: Book) => void
  onDelete: (id: number) => void
}

export default function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  // Component implementation
}
```

#### CSS/Styling
- Use Tailwind CSS utility classes
- Follow the established design system
- Use glassmorphism effects for UI elements
- Maintain consistent spacing and typography

```tsx
// Good - consistent with app styling
<div className="glass-dark rounded-2xl border border-white/20 p-6">
  <h3 className="text-xl font-bold text-white mb-4">Title</h3>
</div>
```

#### API Routes
- Follow RESTful conventions
- Include proper error handling
- Use appropriate HTTP status codes
- Validate input data
- Return consistent JSON structure

```typescript
// Good API route structure
export async function GET(request: NextRequest) {
  try {
    // Validation
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    
    // Database query
    const { data, error } = await supabase
      .from('table')
      .select('*')
      .limit(limit)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Testing Guidelines

#### Unit Tests
- Test all utility functions
- Test component rendering and interactions
- Test API route handlers
- Aim for 80%+ code coverage

```typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react'
import BookCard from '@/components/BookCard'

test('renders book card with title', () => {
  const mockBook = { id: 1, title: 'Test Book', status: 'published' }
  render(<BookCard book={mockBook} onEdit={jest.fn()} onDelete={jest.fn()} />)
  
  expect(screen.getByText('Test Book')).toBeInTheDocument()
})
```

#### E2E Tests
- Test critical user journeys
- Test admin functionality
- Test responsive design
- Include accessibility testing

```typescript
// Example E2E test
import { test, expect } from '@playwright/test'

test('admin can create new book', async ({ page }) => {
  await page.goto('/admin')
  await page.click('text=Add New Book')
  await page.fill('[data-testid=book-title]', 'New Test Book')
  await page.click('text=Save')
  
  await expect(page.locator('text=New Test Book')).toBeVisible()
})
```

### Database Contributions

#### Migration Guidelines
- Create new migration files for schema changes
- Include both `up` and `down` migrations
- Test migrations thoroughly
- Document breaking changes

#### Adding New Tables
1. Create migration file
2. Define TypeScript interfaces
3. Create API routes
4. Add admin components (if needed)
5. Include tests
6. Update documentation

### Documentation Requirements

- Update README for new features
- Add JSDoc comments for complex functions
- Include API documentation for new endpoints
- Provide component usage examples
- Update type definitions

### Security Guidelines

- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Implement proper input validation
- Follow Row Level Security (RLS) patterns
- Sanitize user input
- Use HTTPS in production

### Performance Considerations

- Optimize images and assets
- Use appropriate caching strategies
- Implement proper loading states
- Minimize bundle size
- Use lazy loading where appropriate
- Monitor Core Web Vitals

### Questions or Issues?

- Check existing issues before creating new ones
- Use discussions for general questions
- Tag maintainers for urgent issues
- Provide detailed reproduction steps
- Include relevant logs and screenshots

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**

*Explore 1,700 years of history. Discover five interconnected books. Experience the ZOROASTER universe like never before.*
