# Changelog

## Overview

This changelog provides a history of the changes to the frontend documentation. This will help contributors track the evolution of the guidelines and understand the context for updates.

---

## [0.1.0] - YYYY-MM-DD
### Added
- Initial version of the frontend documentation
- Added README with purpose, stack, and folder map
- Created `style-guide.md` with coding standards and best practices
- Developed `components.md` for component patterns
- Implemented `navigation.md` for routing and navigation patterns
- Drafted `changelog.md` for recording documentation changes

## [0.1.1] - YYYY-MM-DD
### Fixed
- Corrected typos in `style-guide.md` and `components.md`
- Updated examples in `navigation.md`

## [0.2.0] - 2025-01-27
### Added
- **Global Cosmic Background System**: Implemented unified background design across all pages
  - Added high-resolution cosmic image (`/public/bg.jpg`) as global background
  - Enhanced `globals.css` with 6px backdrop blur filter for glass overlay effect
  - Implemented dark overlay (rgba(0, 0, 0, 0.7)) for improved text readability
  - Added floating particle animations for enhanced cosmic atmosphere

### Changed
- **Background Architecture**: Migrated from individual page backgrounds to global system
  - Removed redundant inline background styles from main pages (`page.tsx`, `overview/page.tsx`, `profile/page.tsx`)
  - Centralized background management in `globals.css` for better performance
  - Updated background image path from `/background.jpg` to `/bg.jpg`

### Fixed
- **Dependency Resolution**: Added missing `react-markdown` dependency to resolve build errors
- **Build Performance**: Eliminated duplicate background image loading across pages

### Documentation
- Updated `background.md` with new background design system details
- Added layer structure documentation (cosmic background + blur overlay + content)
- Documented performance benefits of global background approach

---

*Note: Dates and details will be added as changes occur in the documentation. This changelog grows as each version updates.*
