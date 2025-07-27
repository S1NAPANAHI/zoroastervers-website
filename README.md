# ZOROASTER - Novel Worldbuilding Hub

*by Sina Panahi*

An immersive digital experience for exploring the **ZOROASTER** universe - a fantasy saga spanning 1,700 years across five interconnected books. This comprehensive Next.js application features an interactive timeline, advanced e-commerce shop with hierarchical product structure, user authentication, progress tracking, countdown timer for upcoming releases, and integrated purchasing system with cart management.

## 🌟 Features

### Interactive Universal Timeline
- **1,700-year span**: Explore events from 500 CE to 2200 CE
- **Expandable event cards**: Click any event to reveal detailed descriptions, consequences, and related books
- **Smart navigation**: Book ribbons and smooth scrolling between eras
- **Dynamic backgrounds**: Progressive gradients that change as you scroll through different time periods
- **Date ruler**: Visual timeline indicator showing your current position in history
- **Progress tracking**: Real-time scroll progress with user analytics

### Advanced E-Commerce Shop
- **Hierarchical Product Structure**: 5 Books → 4 Volumes per Book → Sagas → Arcs → Issues
- **Multi-Level Purchasing**: Buy individual issues, volumes, or complete books with bundle discounts
- **Dynamic Filtering**: Filter by product level (all, books, volumes, sagas, arcs, issues)
- **Flexible Sorting**: Sort by release date, price, title, or popularity
- **Dual View Modes**: Tree view for hierarchical browsing, grid view for quick selection
- **Smart Cart System**: Add individual items or bundles with automatic discount calculation
- **Cart Drawer**: Slide-out cart accessible from header with item management
- **Progressive Purchase Modal**: Multi-tier recommendations with bundle suggestions
- **Bundle Pricing**: Automatic discounts for volume and book purchases

### Release Management & Countdown
- **Integrated Countdown Timer**: Live countdown in navigation header showing time until next issue
- **Smart Timer Display**: Compact format (91d:18h:44m) integrated next to ZOROASTER title  
- **Release Notifications**: Automatic switch to "New Issue Available!" when countdown expires
- **Quarterly Schedule**: Configured for 3-month release cycles
- **Cross-Platform Visibility**: Timer appears on all pages for constant awareness

### Book Integration & Commerce
- **5 interconnected books**: The Awakening, Shattered Realms, Convergence, The Crystal War, Infinite Paths
- **Direct purchase links**: Buy buttons integrated into timeline events
- **Chapter references**: Specific chapter citations for each historical event
- **Relevance descriptions**: Contextual explanations of why each book matters to specific events
- **Dynamic pricing**: $2.99 - $18.99 with bundle discounts and volume pricing

### User Experience
- **Authentication system**: Login/signup with progress tracking
- **Responsive design**: Works seamlessly on desktop and mobile
- **Glassmorphism UI**: Modern glass effects with neon accents
- **Elegant typography**: Optimized Google Fonts (Playfair Display, Crimson Text, EB Garamond)
- **Dark theme**: Immersive sci-fi aesthetic with glowing elements

### Technical Excellence
- **Next.js 14**: App Router with TypeScript
- **Optimized fonts**: Next.js font optimization for Google Fonts
- **Smooth animations**: 60fps scroll-based animations and transitions
- **Performance**: Efficient rendering with React hooks and optimized re-renders
- **SEO ready**: Proper meta tags and semantic HTML structure

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
│   │   ├── Header.tsx              # Navigation with countdown timer
│   │   ├── EnhancedTimeline.tsx     # Main timeline component
│   │   ├── InteractiveTimelineEvent.tsx  # Expandable event cards
│   │   ├── AuthForm.tsx            # Login/signup forms
│   │   └── shop/                   # Shop component directory
│   │       ├── BundleRecommendations.tsx    # Bundle suggestions
│   │       ├── CartDrawer.tsx               # Slide-out cart component
│   │       ├── GridView.tsx                 # Grid display for products
│   │       ├── HierarchicalShopTree.tsx     # Tree view for hierarchical browsing
│   │       └── ProgressivePurchaseModal.tsx # Multi-tier purchase modal
│   ├── contexts/
│   │   ├── AuthContext.tsx         # User authentication state
│   │   └── CartContext.tsx         # Shopping cart management
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
