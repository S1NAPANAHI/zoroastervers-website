# Project Structure and Guide

## Overview

This document will help you navigate the ZOROASTER Novel Worldbuilding Hub's folder structure, showing which parts are frontend, backend, or shared. You can use it as a quick reference for where to make changes in the project.

## Main Directories

- **src/**: Contains all the source code for the project, including frontend and backend logic.
- **public/**: Static files, such as images, stylesheets, and index.html.
- **docs/**: Documentation files, including guides and README.
- **tests/**: Test cases and testing configurations.

## Detailed Structure

### Frontend

- **src/components/**: Reusable UI components used across various pages.
  - **Example**: Button.tsx, Card.tsx
- **src/pages/**: Next.js pages – each file in this directory corresponds to a route.
  - **Example**: index.tsx (Homepage), about.tsx
- **src/styles/**: CSS or styled-components for the frontend.
  - **Example**: globals.css
- **src/hooks/**: Custom hooks for managing state and side effects.
- **src/context/**: Global state management using context.

### Backend

- **src/api/**: API endpoints for handling server-side requests.
  - **Example**: books.ts, users.ts
- **src/services/**: Functionality like database access or external integrations.
  - **Example**: auth.ts (Authentication Service)
- **src/env/**: Environment configuration and variables.
- **src/middleware/**: Server-side logic that operates before route handlers.
  - **Example**: authMiddleware.ts

### Shared

- **src/utils/**: Utility functions and helpers used both on frontend and backend.
  - **Example**: formatDate.ts, calculateDiscount.ts
- **src/types/**: TypeScript interfaces and types.
  - **Example**: models.ts
- **src/constants/**: Shared constants used across the project.
  - **Example**: roles.ts

### Tests

- **tests/unit/**: Unit tests for individual functions or components.
- **tests/integration/**: Integration tests for interacting parts.
- **tests/e2e/**: End-to-end tests for simulating user interactions.

## How to Make Changes

### Frontend Changes
- Modify UI components in `src/components/` for design changes.
- Change page logic or layout in `src/pages/` for route-specific updates.
- Adjust global styles in `src/styles/` or create custom hooks in `src/hooks/`.

### Backend Changes
- Edit API endpoints in `src/api/` to change backend logic.
- Improve database operations or external API calls in `src/services/`.
- Manage global server logic in `src/middleware/`.

### Shared Changes
- For utility functions used in both the frontend and backend, go to `src/utils/`.
- Update TypeScript types and constants in `src/types/` and `src/constants/`.

## Deployment
- Changes in frontend or backend logic will automatically be reflected upon deploying the updated project on your chosen platform.

Utilize this guide to efficiently navigate and modify sections of your project, helping maintain control and organization as you develop or replicate different features.
