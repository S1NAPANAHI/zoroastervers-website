# Admin System Guide

## Overview

The ZOROASTER Novel Worldbuilding Hub features a comprehensive admin management system that allows you to control all aspects of your novel universe content. This guide covers the complete admin functionality including the hierarchical content management, database operations, and API endpoints.

## Access & Authentication

### Admin Access
- **URL**: `/admin`
- **Authentication**: Role-based authentication required
- **Permissions**: Only users with `isAdmin: true` can access the admin dashboard

### Setting Up Admin Access
1. Log in with your user account
2. Update your user role in the Supabase database:
   ```sql
   UPDATE users SET role = 'admin' WHERE id = 'your-user-id';
   ```

## Admin Dashboard Overview

The admin dashboard provides a unified interface for managing all content types:

### Navigation Sidebar
- **Overview**: Dashboard statistics and analytics
- **Books**: Manage top-level book series
- **Volumes**: Organize volumes within books
- **Sagas**: Control story sagas within volumes
- **Arcs**: Manage story arcs within sagas
- **Issues**: Handle individual issues and releases
- **Timeline**: Manage historical events
- **Shop**: Legacy hierarchical shop management

## Hierarchical Content Management

### Database Structure
```
Books (Top Level)
├── Volumes (Book → Volume relationship)
    ├── Sagas (Volume → Saga relationship)
        ├── Arcs (Saga → Arc relationship)
            └── Issues (Arc → Issue relationship)
```

### Content Flow
1. **Books**: Create the main book series
2. **Volumes**: Add volumes to books with ordering
3. **Sagas**: Create story sagas within volumes
4. **Arcs**: Develop story arcs within sagas
5. **Issues**: Publish individual issues within arcs

## Books Manager

### Features
- Create and edit book series
- Set pricing, descriptions, and metadata
- Track completion status and word counts
- Manage physical/digital availability
- View associated volumes

### Fields
- **Title**: Book series name (required)
- **Description**: Detailed book description
- **Author**: Author name (defaults to 'S1NAPANAHI')
- **Price**: Base price for the book
- **Cover Image URL**: Link to cover image
- **Status**: Draft, Published, or Archived
- **Total Word Count**: Aggregate word count
- **Is Complete**: Whether the book is finished
- **Physical Available**: Physical copy availability
- **Digital Bundle**: Include in digital bundles
- **Publication Date**: Release date

### Operations
- **Add New Book**: Create new book series
- **Edit Book**: Modify existing book details
- **Delete Book**: Remove book and all associated content
- **Status Management**: Change publication status
- **Search & Filter**: Find books by title, description, or status

## Volumes Manager

### Features
- Organize volumes within books
- Set ordering and pricing
- Manage physical/digital options
- Track associated sagas

### Fields
- **Book**: Parent book selection (required)
- **Title**: Volume name (required)
- **Description**: Volume description
- **Price**: Volume pricing
- **Order Index**: Sequential ordering within book (required)
- **Status**: Draft, Published, or Archived
- **Physical Available**: Physical copy option
- **Digital Bundle**: Digital bundle inclusion

### Operations
- **Add New Volume**: Create volume within selected book
- **Edit Volume**: Modify volume details
- **Delete Volume**: Remove volume and associated content
- **Reorder**: Change volume order within book
- **Filter by Book**: View volumes for specific books

## Sagas Manager

### Features
- Manage story sagas within volumes
- Track word counts and descriptions
- Control saga ordering
- View associated arcs

### Fields
- **Volume**: Parent volume selection (required)
- **Title**: Saga name (required)
- **Description**: Saga description
- **Order Index**: Sequential ordering within volume (required)
- **Status**: Draft, Published, or Archived
- **Word Count**: Saga word count

### Operations
- **Add New Saga**: Create saga within selected volume
- **Edit Saga**: Modify saga details
- **Delete Saga**: Remove saga and associated content
- **Filter by Volume**: View sagas for specific volumes
- **Word Count Tracking**: Monitor saga length

## Arcs Manager

### Features
- Control story arcs within sagas
- Manage detailed descriptions
- Track word counts
- Monitor associated issues

### Fields
- **Saga**: Parent saga selection (required)
- **Title**: Arc name (required)
- **Description**: Arc description
- **Order Index**: Sequential ordering within saga (required)
- **Status**: Draft, Published, or Archived
- **Word Count**: Arc word count

### Operations
- **Add New Arc**: Create arc within selected saga
- **Edit Arc**: Modify arc details
- **Delete Arc**: Remove arc and associated content
- **Filter by Saga**: View arcs for specific sagas
- **Hierarchical Display**: See full book → volume → saga → arc path

## Issues Manager

### Features
- Handle individual issues and releases
- Set release dates and content URLs
- Manage pricing and availability
- Control publication workflow

### Fields
- **Arc**: Parent arc selection (required)
- **Title**: Issue name (required)
- **Description**: Issue description
- **Price**: Individual issue price
- **Word Count**: Issue word count (required)
- **Order Index**: Sequential ordering within arc (required)
- **Status**: Draft, Published, Pre-order, or Coming Soon
- **Release Date**: Publication date
- **Content URL**: Link to actual content
- **Cover Image URL**: Issue cover image
- **Tags**: Searchable tags array

### Operations
- **Add New Issue**: Create issue within selected arc
- **Edit Issue**: Modify issue details
- **Delete Issue**: Remove issue
- **Release Management**: Control publication status
- **Content Linking**: Associate with actual content files
- **Pricing Control**: Set individual and bundle pricing

## Timeline Manager

### Features
- Manage historical events for your universe
- Categorize events by type
- Associate events with books
- Control event visibility

### Fields
- **Title**: Event name (required)
- **Date**: Event date in universe timeline (required)
- **Category**: Event type (political, magical, technological, cultural, catastrophic)
- **Description**: Event description (required)
- **Details**: Extended event details
- **Book Reference**: Associated book information

### Operations
- **Add New Event**: Create timeline events
- **Edit Event**: Modify event details
- **Delete Event**: Remove events
- **Category Management**: Organize by event types
- **Book Association**: Link events to books

## API Endpoints

### Books API
- `GET /api/admin/books` - List all books
- `POST /api/admin/books` - Create new book
- `GET /api/admin/books/[id]` - Get specific book
- `PUT /api/admin/books/[id]` - Update book
- `DELETE /api/admin/books/[id]` - Delete book

### Volumes API
- `GET /api/admin/volumes` - List all volumes
- `POST /api/admin/volumes` - Create new volume
- `GET /api/admin/volumes/[id]` - Get specific volume
- `PUT /api/admin/volumes/[id]` - Update volume
- `DELETE /api/admin/volumes/[id]` - Delete volume

### Sagas API
- `GET /api/admin/sagas` - List all sagas
- `POST /api/admin/sagas` - Create new saga
- `GET /api/admin/sagas/[id]` - Get specific saga
- `PUT /api/admin/sagas/[id]` - Update saga
- `DELETE /api/admin/sagas/[id]` - Delete saga

### Arcs API
- `GET /api/admin/arcs` - List all arcs
- `POST /api/admin/arcs` - Create new arc
- `GET /api/admin/arcs/[id]` - Get specific arc
- `PUT /api/admin/arcs/[id]` - Update arc
- `DELETE /api/admin/arcs/[id]` - Delete arc

### Issues API
- `GET /api/admin/issues` - List all issues
- `POST /api/admin/issues` - Create new issue
- `GET /api/admin/issues/[id]` - Get specific issue
- `PUT /api/admin/issues/[id]` - Update issue
- `DELETE /api/admin/issues/[id]` - Delete issue

## Database Schema

### Key Tables
```sql
-- Books (top level)
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author TEXT NOT NULL DEFAULT 'S1NAPANAHI',
  price DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  -- ... additional fields
);

-- Volumes (linked to books)
CREATE TABLE volumes (
  id SERIAL PRIMARY KEY,
  book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  -- ... additional fields
);

-- Sagas (linked to volumes)
CREATE TABLE sagas (
  id SERIAL PRIMARY KEY,
  volume_id INTEGER NOT NULL REFERENCES volumes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  -- ... additional fields
);

-- Arcs (linked to sagas)
CREATE TABLE arcs (
  id SERIAL PRIMARY KEY,
  saga_id INTEGER NOT NULL REFERENCES sagas(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  -- ... additional fields
);

-- Issues (linked to arcs)
CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  arc_id INTEGER NOT NULL REFERENCES arcs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  -- ... additional fields
);
```

### Row Level Security (RLS)
All tables have RLS enabled with policies that:
- Allow read access to published content for all users
- Allow full access to admin users
- Protect draft and archived content from unauthorized access

## Content Workflow

### Recommended Workflow
1. **Plan Structure**: Design your book → volume → saga → arc → issue hierarchy
2. **Create Books**: Start with top-level book series
3. **Add Volumes**: Organize content into volumes
4. **Develop Sagas**: Create story sagas within volumes
5. **Build Arcs**: Develop story arcs within sagas
6. **Publish Issues**: Release individual issues as ready

### Status Management
- **Draft**: Content in development, not visible to public
- **Published**: Live content visible to all users
- **Archived**: Deprecated content, hidden from public but preserved
- **Pre-order**: Issues available for pre-order
- **Coming Soon**: Announced but not yet available

## Best Practices

### Content Organization
- Use consistent naming conventions
- Maintain proper order indices
- Provide detailed descriptions
- Set appropriate pricing strategies

### Release Management
- Test in draft mode before publishing
- Use pre-order status for upcoming releases
- Maintain consistent release schedules
- Update content URLs when content is ready

### Data Management
- Regular backups of your database
- Monitor cascade delete operations
- Use bulk operations for efficiency
- Maintain data integrity

## Troubleshooting

### Common Issues
1. **Permission Denied**: Ensure user has admin role
2. **Database Connection**: Check Supabase configuration
3. **Cascade Deletes**: Understand hierarchical relationships
4. **Status Updates**: Verify RLS policies allow operations

### Error Handling
- All operations include proper error handling
- Failed operations show descriptive error messages
- Database constraints prevent invalid data entry
- Rollback mechanisms protect data integrity

## Security Considerations

### Authentication
- Role-based access control
- Secure session management
- Protected admin routes

### Data Protection
- Input validation on all forms
- SQL injection prevention
- XSS protection
- Environment variable security

### API Security
- Authentication required for all admin endpoints
- Rate limiting considerations
- Input sanitization
- Error message security

This comprehensive admin system provides complete control over your novel universe content while maintaining security, performance, and ease of use.
