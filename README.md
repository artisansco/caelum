# Caelum

A comprehensive school management system built with SvelteKit, TypeScript, and SQLite. Teachers can manage classes, students, subjects, grades, assignments, and announcements. The system features multi-tenancy for multiple schools, direct database methods pattern for clean architecture, and a modern web interface.

## Features

- **Multi-tenant Architecture**: Support for multiple schools with isolated data
- **Staff Management**: Complete CRUD operations for school staff
- **Student Management**: Student enrollment, profiles, and class assignments
- **Academic Management**: Subjects, classes, grades, and assignments
- **Communication**: Announcements and notifications system
- **Financial Tracking**: Payment records and transaction management
- **Modern UI**: Built with Svelte 5, Melt UI components, and Tailwind CSS
- **Type Safety**: Full TypeScript implementation with Drizzle ORM

## Development Status

For detailed information about implemented features and planned enhancements, see [RECOMMENDATIONS.md](RECOMMENDATIONS.md).

### Current Capabilities
- Staff authentication and school management
- CRUD operations for students, classes, subjects
- Grade entry and management (add/delete)
- Assignment creation and file uploads
- Announcement system
- Payment and transaction tracking
- Responsive web interface

### Planned Features
- Student portal for result viewing
- PDF/Excel export functionality
- Enhanced reporting and analytics
- Parent portal
- Attendance tracking
- Course curriculum management

## Architecture

This project uses a **Direct Database Methods Pattern** where database operations are wrapped in functions that return consistent result objects. This approach provides clean error handling, type safety, and eliminates unnecessary abstraction layers while maintaining separation of concerns.

### Architecture Layers

```
┌─────────────────────────────────────────────┐
│         Remote Functions (.remote.ts)       │
│   (Handle HTTP requests, validation, auth)  │
└──────────────────┬──────────────────────────┘
│
▼
┌─────────────────────────────────────────────┐
│     Database Methods Layer (queries/)       │
│  (Database operations, result objects)      │
└──────────────────┬──────────────────────────┘
│
▼
┌─────────────────────────────────────────────┐
│           Database (Drizzle ORM)            │
└─────────────────────────────────────────────┘
```

### Directory Structure

```
src/lib/server/database/
├── queries/               # Database methods layer
│   ├── students.ts        # Student database operations
│   ├── staff.ts           # Staff database operations
│   └── ...
├── schema.ts              # Database schema definitions
├── drizzle.ts             # Database connection & configuration
└── seed.ts                # Database seeding scripts
```

### Key Principles

- **Direct Database Access**: No unnecessary abstraction layers
- **Consistent Result Objects**: All operations return `{ success: boolean, data?: T, message?: string }`
- **Type Safety**: Full TypeScript support with Drizzle ORM inferred types
- **Clean Separation**: Database operations vs HTTP handling
- **Error Handling**: Try/catch in database methods, result objects for consistency

### Layer Responsibilities

#### Database Methods Layer
- Execute database queries with proper error handling
- Perform CRUD operations
- Return consistent result objects
- Use Drizzle ORM types for type safety

#### Remote Functions Layer
- Handle HTTP requests and responses
- Handle authentication/authorization
- Call database methods directly
- Perform request/response validation

### Best Practices

- One file per entity/domain
- Function names: `get_*`, `create_*`, `update_*`, `delete_*`
- All database operations wrapped in try/catch
- Result objects for consistent error handling

### The challenge

Admin should be able to:

- Add new classes, students, subjects
- Update classes, students, subjects
- Delete classes, students, subjects

Students should be able to:

- Search for their result using their ID
- Download their result in different format (Excel & PDF)
