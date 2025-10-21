# Caelum Project Recommendations & TODO List

This document contains all identified issues and improvement recommendations for the Caelum school management system, organized by priority and category.

## Critical Errors (Fix Immediately)

### TypeScript & Code Issues

- [X] **Fix TypeScript error handling** - Access `.message` on unknown error types in `announcements.remote.ts`, `grades.remote.ts`, `payments.remote.ts`, `transactions.remote.ts`
- [X] **Fix subscription_id schema issues** - Resolve optional vs required inconsistency in transaction operations
- [ ] **Fix component property errors** - Update Dialog component to accept an optional `bind:open` prop (using Melt UI's `open` state) and bind `toggle_dialog` in staff/student detail pages
- [X] **Fix undefined password variable** - Resolve undefined `password` variable in staff detail page
- [X] **Remove unused variables** - Clean up unused variables (e.g., `school_id` in `transactions.remote.ts`)
- [ ] **Fix inconsistent validation libraries** - Standardize on Valibot for all schemas and remote functions (currently mixed with Zod)

### Security & Production Readiness

- [ ] **Enhance input validation** - Strengthen validation for file uploads and user inputs with size limits and type checking
- [ ] **Add automated backup system** - Implement automated database backup system with restore functionality
- [ ] **Set up CI/CD pipeline** - Implement automated testing and deployment workflows
- [ ] **Add migration strategy** - Implement proper database migration strategy for production schema changes
- [ ] **Ensure compliance** - Add GDPR/CCPA compliance checks for student data handling

## Testing Infrastructure

- [ ] **Add unit tests** - Create unit tests for business logic, especially grade calculations and payment processing using Vitest (SvelteKit compatible)
- [ ] **Add integration tests** - Implement integration tests for database operations and API endpoints
- [ ] **Configure test coverage** - Set up test coverage reporting and aim for 80%+ coverage on critical paths

## Code Quality, Architecture & Security

- [ ] **Standardize error handling** - Implement consistent error handling with proper TypeScript typing across all files
- [ ] **Enable strict TypeScript** - Configure strict TypeScript settings and eliminate `any` types in favor of proper interfaces
- [X] **Separate business logic** - Refactor to separate business logic from UI components using service/repository patterns
- [ ] **Centralize validation** - Centralize and strengthen input validation schemas with comprehensive error messages
- [ ] **Standardize Database Method Development** - Create development guidelines and templates for adding new database operations following the established Direct Database Methods Pattern
- [ ] **Create Database Methods API Reference** - Comprehensive API documentation for all database methods with examples and usage patterns
- [ ] **Add Database Method Integration Tests** - Specific tests for the database query layer to ensure data integrity and operation reliability
- [ ] **Optimize Database Method Organization** - Evaluate if the current entity-based file organization is optimal or if further reorganization would improve maintainability
- [ ] **Add password policies** - Implement password complexity requirements and password history checks
- [ ] **Improve session management** - Add proper session invalidation and JWT refresh token functionality
- [ ] **Implement audit logging** - Add audit logging for sensitive operations (user creation, deletions, grade changes)
- [ ] **Use SvelteKit's server hooks for centralized authentication** - Provides better session handling and CSRF protection
- [ ] **Add input sanitization for rich text** - Sanitize Tiptap editor content and ensure file uploads use secure temp directories

## Svelte 5 & SvelteKit Adoption

- [X] **Fully adopt Svelte 5 runes** - Replace legacy Svelte patterns (e.g., `$$:` reactive statements) with runes (`$state`, `$effect`) for better performance and consistency
- [X] **Ensure SvelteKit 2.x compatibility** - Utilize enhanced forms, server actions, and modern SvelteKit features
- [X] **Migrate legacy Svelte patterns to runes** - Update any remaining `$:` reactive statements in components to use `$effect` and `$state`
- [X] **Implement SvelteKit's +page.server.ts** - Use server data loading to reduce client-side fetches and improve hydration
- [ ] **Add SvelteKit's built-in caching** - Implement query caching via `invalidateAll()` and SWR-like patterns for real-time data
- [ ] **Optimize bundle size** - Add lazy-loading for routes and components (e.g., student portal as separate route group)
- [X] **Integrate SvelteKit's error boundaries** - Add client/server error logging and boundaries for better error handling
- [ ] **Audit Melt UI usage for accessibility** - Ensure Dialog, Select, and other components follow ARIA standards and keyboard navigation

## Feature Enhancements

### Critical Missing Features (Core Requirements)

- [ ] **Student Portal & Result Viewing** - Create public student portal for searching/viewing results by admission number (core README requirement)
- [ ] **PDF/Excel Export** - Install and implement PDF (puppeteer) and Excel (xlsx) generation for grade reports and student results
- [ ] **Student Authentication** - Build separate authentication system for students (vs staff admin login)
- [ ] **Complete CRUD Operations** - Implement edit/delete functionality for grades (add/delete implemented, edit shows "TODO" alerts) using SvelteKit forms
- [ ] **Assignment Management** - Complete assignment creation, file uploads, and submission tracking (creation and uploads implemented, submission tracking not yet)
- [ ] **Integrate Tiptap for rich-text editing** - Use Tiptap for rich-text announcements and assignments (already in dependencies)
- [ ] **Enhanced Reporting & Analytics** - Replace mock dashboard data with real grade analytics, student performance reports, and attendance tracking
- [ ] **Course/Curriculum Management** - Define courses, learning objectives, and curriculum mapping
- [ ] **Class Scheduling/Timetable** - Automated timetable generation and conflict resolution
- [ ] **Attendance Tracking System** - Daily attendance recording with absence reasons and automated notifications
- [ ] **Parent Portal** - Separate authentication for parents to view children's progress and communicate with teachers
- [ ] **Grade Calculation Rules** - Weighted grades, GPA calculations, and custom grading scales
- [ ] **Transcript Generation** - Official transcript creation with seals and signatures

### Additional Feature Enhancements

#### Communication & Collaboration

- [ ] **SMS Integration** - Bulk SMS notifications for urgent announcements and payment reminders
- [ ] **Parent-Teacher Conferences** - Online scheduling system for parent-teacher meetings with calendar integration
- [ ] **Emergency Alert System** - Instant multi-channel notifications for emergencies or school closures
- [ ] **Group Messaging** - Class-specific or role-based communication groups with read receipts

#### Library Management System

- [ ] **Digital Book Catalog** - Comprehensive catalog with search, reservation, and recommendation features
- [ ] **Circulation Management** - Automated check-out/check-in with due date tracking and renewals
- [ ] **Fine Management System** - Automated fine calculations with payment integration and overdue notices

#### Extracurricular Management

- [ ] **Sports Team Management** - Team registration, practice schedules, and performance tracking
- [ ] **Club & Activity Management** - Activity clubs with membership management and event planning
- [ ] **Achievement Tracking** - Awards, certificates, and recognition system with digital badges

#### Health & Safety Management (Future Features)

- [ ] **Medical Records System** - Health history, allergies, medications, and emergency contacts management (Future Feature)
- [ ] **Medical Alerts & Notifications** - Automated notifications for medical conditions or medication schedules (Future Feature)
- [ ] **Incident Reporting System** - Bullying, accidents, or behavioral incident tracking and management (Future Feature)
- [ ] **Health Screening Tracking** - Immunization records, vision/hearing tests, and health assessments (Future Feature)

#### Technical Infrastructure

- [ ] **Database Optimization** - Query optimization, indexing strategy, and performance monitoring
- [X] **Multi-tenancy Support** - Support for multiple schools on the same instance with data isolation

#### User Experience Enhancements

- [ ] **Bulk Operations** - Mass updates for grades, attendance, communications, and data imports
- [ ] **Responsive Design** - Ensure the application is responsive across different screen sizes
  - [ ] Mobile responsiveness
  - [ ] Tablet responsiveness
  - [ ] Desktop optimization
- [ ] **Add email service** - Implement transactional email service for notifications (password reset, announcements)
- [ ] **Add cloud storage** - Implement cloud storage (AWS S3, Cloudinary) for avatars and document uploads

## Deployment, DevOps & Documentation

- [ ] **Add Drizzle migration scripts** - Create migration scripts for schema changes
- [ ] **Create user guides** - Write user guides and documentation for admins and students
- [ ] **Add developer docs** - Create code documentation, contribution guidelines, and architecture overview
- [ ] **Create developer onboarding guide** - Document covering Svelte 5 runes, SvelteKit file structure, and AGENTS.md usage
- [ ] **Implement data retention** - Define clear data retention and deletion policies for student/grade data

## Priority Legend

- **High**: Critical for production readiness and security
- **Medium**: Important for performance and maintainability
- **Low**: Nice-to-have features and optimizations

## Implementation Notes

1. **Start with high-priority items** - Fix critical errors and security issues first
2. **Test thoroughly** - Each change should include appropriate tests
3. **Document changes** - Update this file as items are completed
4. **Review dependencies** - Regularly update packages for security patches
5. **Monitor performance** - Track metrics before and after optimizations
6. **Reference AGENTS.md** - Use AGENTS.md for build/lint commands and style guidelines during fixes
7. **Audit dependencies** - Update dependencies (e.g., Valibot, Drizzle) for Svelte 5 compatibility and security patches

---

_Last updated: October 21, 2025_
_Total items: 69_
