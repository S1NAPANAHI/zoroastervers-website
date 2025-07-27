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

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**

*Explore 1,700 years of history. Discover five interconnected books. Experience the ZOROASTER universe like never before.*
