# API Documentation

Welcome to the Novel Worldbuilding Hub API documentation. This section provides comprehensive information about our REST API endpoints, authentication, and integration guides.

## Quick Start

The Novel Worldbuilding Hub API is built on Next.js API routes and provides RESTful endpoints for managing worldbuilding data.

### Base URL

```
http://localhost:3000/api  (Development)
https://your-domain.com/api  (Production)
```

### Authentication

All API endpoints require authentication via session cookies or JWT tokens. See the [Authentication Guide](../development/authentication-guide.md) for details.

## Available Endpoints

*Note: API endpoint documentation is currently being developed. Please check back soon for detailed endpoint specifications.*

### Core Resources

- **Characters**: CRUD operations for character management
- **Locations**: Geographic and spatial data management
- **Events**: Timeline events and historical data
- **Relationships**: Entity relationship management

### Planned Endpoints

```
GET    /api/characters          # List all characters
POST   /api/characters          # Create new character
GET    /api/characters/:id      # Get character details
PUT    /api/characters/:id      # Update character
DELETE /api/characters/:id      # Delete character

GET    /api/events              # List timeline events
POST   /api/events              # Create new event
GET    /api/events/:id          # Get event details
PUT    /api/events/:id          # Update event
DELETE /api/events/:id          # Delete event

GET    /api/locations           # List all locations
POST   /api/locations           # Create new location
GET    /api/locations/:id       # Get location details
PUT    /api/locations/:id       # Update location
DELETE /api/locations/:id       # Delete location
```

## Error Handling

The API returns standard HTTP status codes and JSON error responses:

```json
{
  "error": "Resource not found",
  "code": 404,
  "message": "The requested character does not exist"
}
```

## Rate Limiting

API requests are rate-limited to prevent abuse. Current limits:
- 100 requests per hour for unauthenticated users
- 1000 requests per hour for authenticated users

## Coming Soon

- GraphQL endpoint
- Webhook support
- Bulk operations
- Advanced filtering and search
- Real-time subscriptions

For questions about the API, please refer to our [Development Guide](../development/README.md) or create an issue on GitHub.
