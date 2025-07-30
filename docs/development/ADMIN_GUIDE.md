# ZOROASTER Admin System Guide

## Overview

The ZOROASTER Novel Worldbuilding Hub now includes a comprehensive admin system that allows you to manage content without touching code. This system provides full CRUD (Create, Read, Update, Delete) capabilities for shop items, timeline events, and other content.

## Admin Access

### Login Credentials
To access the admin panel, use these credentials:
- **Email:** `admin@zoroaster.com`
- **Password:** `password123`

### Admin User Details
- **Username:** SinaPanahi
- **Role:** Admin
- **Avatar:** 👑 (Crown - indicates admin status)

## Features

### 1. Admin Dashboard (`/admin`)
- Overview of site statistics
- Quick access to all management sections
- Direct links to common actions

### 2. Shop Management (`/admin/shop`)
- View all shop items in a table format
- Add new books, volumes, arcs, and issues
- Edit existing items (coming soon)
- Delete items with confirmation
- Set pricing, descriptions, cover images
- Manage publication status

### 3. Timeline Management (`/admin/timeline`)
- Manage historical events for the timeline
- Create events with full metadata (characters, locations, connections)
- Set spoiler levels and importance
- Publish/unpublish events
- Organize by categories (magical, political, technological, etc.)

### 4. Content Management (Planned)
- Book descriptions and metadata
- Character profiles
- Location details
- World-building content

## How to Use

### Adding a New Shop Item

1. Navigate to `/admin/shop`
2. Click "➕ Add New Item"
3. Fill out the form:
   - **Title:** Name of the book/volume/arc/issue
   - **Description:** Detailed description
   - **Price:** Numerical price
   - **Type:** book/volume/arc/issue
   - **Cover Image:** URL to cover image
   - **Status:** draft/published/archived
   - **Release Date:** Publication date

4. Click "Create Item"

### Adding a Timeline Event

1. Navigate to `/admin/timeline`
2. Click "➕ Add New Event"
3. Fill out the comprehensive form:
   - **Basic Info:** Title, description, year
   - **Categorization:** Category, importance level
   - **Connections:** Related events, characters, locations
   - **Media:** Image URL
   - **Metadata:** Tags, spoiler level
   - **Publishing:** Immediate publish option

4. Click "Create Event"

## API Endpoints

The admin system uses these API endpoints:

### Shop Management
- `GET /api/admin/shop` - Fetch all shop items
- `POST /api/admin/shop` - Create new item
- `PUT /api/admin/shop` - Update existing item
- `DELETE /api/admin/shop?id={id}` - Delete item

### Timeline Management
- `GET /api/admin/timeline` - Fetch all timeline events
- `POST /api/admin/timeline` - Create new event
- `PUT /api/admin/timeline` - Update existing event
- `DELETE /api/admin/timeline?id={id}` - Delete event

## Security Features

- **Role-based access:** Only users with `isAdmin: true` can access admin pages
- **Authentication required:** Must be logged in to access admin functions
- **Automatic redirects:** Non-admin users are redirected away from admin pages

## Data Storage

Currently using mock/temporary data storage in memory. In production, this would be connected to a database like:
- PostgreSQL
- MongoDB
- MySQL
- Supabase
- Firebase

## Future Enhancements

1. **Media Upload System:** Direct file uploads for covers and images
2. **User Management:** Admin panel for managing user accounts
3. **Site Settings:** Global configuration management
4. **Analytics Dashboard:** User engagement and content metrics
5. **Content Scheduling:** Publish content at specific dates/times
6. **Bulk Operations:** Import/export content in bulk
7. **Version History:** Track changes to content over time

## Troubleshooting

### Can't Access Admin Panel
- Ensure you're logged in with admin credentials
- Check that the user has `isAdmin: true` in the database
- Clear browser cache and try again

### API Errors
- Check browser developer console for error messages
- Verify API endpoints are responding
- Ensure proper data format is being sent

### Form Submission Issues
- Verify all required fields are filled
- Check for proper data types (numbers for prices, etc.)
- Look for validation errors in the form

## Development Notes

- All admin pages use `'use client'` directive for React state
- Forms include loading states and error handling
- Data validation on both frontend and backend
- Responsive design for desktop and mobile use

---

This admin system provides a solid foundation for content management that can be extended and enhanced as needed. The mock data system makes it perfect for development and testing, with easy migration to a real database when ready for production.
