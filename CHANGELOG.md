# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2025-01-31

### Fixed
- **Component Export Issues**: Resolved all component default export mismatches causing Vercel deployment failures
  - Fixed missing default exports in review components (StarRating, InlineRating, ReviewPanel, ReviewList, ReviewForm, RatingDistribution)
  - Fixed missing default exports in UI components (InlineEditableField, Newsletter, LevelProgressBar)
  - Fixed missing default exports in admin components (ArcModal, BookModal, CharacterModal, IssueModal, EasterEgg, EasterEggAdminToggle, EasterEggContainer)
  - Fixed missing default exports in shop components (BookStore, BookNavigator, GridView, HierarchicalShopTree)
  - Updated all component index.ts files to properly export default components

- **Build Dependencies**: Added missing utility functions to prevent build errors
  - Added placeholder rate limiting functions in `src/lib/rateLimit.ts`
  - Added placeholder validation functions in `src/lib/validation.ts`
  - Ensured all imports have corresponding implementations

- **Build Status**: ✅ Build now passes successfully
  - Resolved all "does not contain a default export" errors in Vercel deployment
  - All TypeScript compilation issues resolved
  - Static generation and optimization working correctly

### References
- Fixes build deployment issues that were causing CI/CD pipeline failures
- Related to commit: 6a3f974 "Fix component export issues for build deployment"

### Notes
This release focuses on resolving deployment-blocking issues and ensuring the codebase builds cleanly across all environments. All previously failing builds should now pass.

---

## [0.2.0] - 2025-01-27

### Added
- **Beta Program System**: Complete beta program functionality with application form
- **Global Cosmic Background System**: Implemented unified background design across all pages
  - Added high-resolution cosmic image (`/public/bg.jpg`) as global background
  - Enhanced `globals.css` with 6px backdrop blur filter for glass overlay effect
  - Implemented dark overlay (rgba(0, 0, 0, 0.7)) for improved text readability
  - Added floating particle animations for enhanced cosmic atmosphere

### Changed
- **Background Architecture**: Migrated from individual page backgrounds to global system
  - Removed redundant inline background styles from main pages
  - Centralized background management in `globals.css` for better performance
  - Updated background image path from `/background.jpg` to `/bg.jpg`

### Fixed
- **Dependency Resolution**: Added missing `react-markdown` dependency to resolve build errors
- **Build Performance**: Eliminated duplicate background image loading across pages

---

*This changelog will be updated with each release to track all significant changes to the project.*
