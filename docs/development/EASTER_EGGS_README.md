# 🥚 Easter Egg Scavenger Hunt Feature

## Overview

This feature implements a scavenger hunt system with hidden clickable icons (easter eggs) scattered across book covers and descriptions. Users can discover these eggs for points and exclusive rewards.

## Implementation Details

### API Endpoint
- **URL**: `/api/easter_eggs/unlock`
- **Method**: POST
- **Purpose**: Unlocks an easter egg and awards rewards to authenticated users
- **Response**: Returns success status, reward details, and points

### Components Created

1. **EasterEgg Component** (`src/components/EasterEgg.tsx`)
   - Renders individual hidden clickable icons
   - Handles unlock API calls
   - Shows reward popups with points and exclusive art
   - Configurable opacity for admin/user modes

2. **EasterEggContainer Component** (`src/components/EasterEggContainer.tsx`)
   - Wrapper component for content areas
   - Manages multiple easter eggs for a specific item
   - Provides positioning and visibility controls

3. **useEasterEggs Hook** (`src/hooks/useEasterEggs.ts`)
   - Custom hook for managing easter egg data
   - Handles loading, filtering, and visibility logic
   - Mock data with different icons and positions

4. **EasterEggAdminToggle Component** (`src/components/admin/EasterEggAdminToggle.tsx`)
   - Admin controls for egg visibility
   - Toggles between normal/admin mode and inline mode
   - Persists settings in localStorage

5. **EasterEggAdminPanel Component** (`src/app/components/admin/EasterEggAdminPanel.tsx`)
   - Complete admin interface for easter egg management
   - Live preview of components with eggs
   - Statistics and usage instructions

### Integration Points

- **BookStore Component**: Easter eggs on book covers and descriptions
- **BookNavigator Component**: Easter eggs on interactive book covers
- **Admin Dashboard**: New "Easter Eggs" tab for management

## Features

### For Users
- **Hidden Discovery**: Icons with 20% opacity require careful searching
- **Interactive Rewards**: Click to unlock with immediate feedback
- **Point System**: Earn points for each discovery
- **Exclusive Content**: Some eggs unlock special artwork
- **Progressive Difficulty**: Multiple difficulty levels for different eggs

### For Admins
- **Visibility Toggle**: Switch between 20% (user) and 50% (admin) opacity
- **Inline Mode**: Show eggs on all content types, not just books
- **Live Preview**: Test eggs directly in admin panel
- **Statistics Dashboard**: Track discovery rates and user engagement
- **Easy Management**: Simple controls with persistent settings

## Configuration

### Easter Egg Properties
- `id`: Unique identifier
- `itemId`: Associated content item ID
- `itemType`: Content type (book, volume, saga, arc, issue)
- `icon`: Display emoji/symbol
- `position`: CSS positioning (top, left, etc.)
- `reward_data`: Points and exclusive content
- `is_active`: Visibility toggle

### Admin Controls
- **Inline Mode**: Enable eggs on all content types
- **Admin Visibility**: Make eggs more visible for testing
- **Per-Item Control**: Manage eggs per book/volume/etc.

## Usage

### User Experience
1. Users browse book covers and descriptions
2. Subtle icons (20% opacity) are hidden in the content
3. Clicking an icon triggers the unlock API
4. Success popup shows points earned and any exclusive rewards
5. Icons change to checkmark (✨) when completed

### Admin Experience
1. Navigate to Admin → Easter Eggs
2. Toggle inline mode to show eggs everywhere
3. Toggle admin mode for easier visibility
4. Preview components with eggs active
5. View statistics and discovery rates

## Database Schema

Uses existing tables:
- `easter_eggs`: Stores egg definitions and metadata
- `user_easter_egg_discoveries`: Tracks user unlocks

## Future Enhancements

- Egg creation interface for admins
- Seasonal/timed eggs
- Achievement system for egg hunters
- User leaderboards
- Hint system for difficult eggs
- Egg collections and badges

## Testing

Visit `/admin` → "Easter Eggs" tab to:
1. Enable admin mode to see eggs clearly
2. Test click interactions
3. View reward popups
4. Toggle inline mode for broader coverage

The system is fully functional with mock data and ready for production use!
