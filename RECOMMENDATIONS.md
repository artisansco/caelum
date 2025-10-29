# Caelum Project Recommendations & TODO List

This document contains all identified issues and improvement recommendations for the Caelum school management system, organized by criticality and category.

## 🔴 CRITICAL PRIORITY (Fix Immediately)

### Security Vulnerabilities

- [ ] **FIX JWT VERIFICATION** - `src/lib/auth.ts:23-26` manually parses JWT without signature verification! Anyone can forge tokens. Use `jwt.verify()` with secret validation
- [ ] **Add password complexity requirements** - No password policies enforced (min 8 chars, uppercase, lowercase, number, special char)
- [ ] **Add rate limiting on authentication** - No protection against brute force attacks on login endpoints
- [ ] **Fix JWT expiration checking** - Token decoded but expiration never verified
- [ ] **Add session invalidation mechanism** - No way to invalidate tokens on logout or password change
- [ ] **Implement refresh token system** - Current tokens expire after 1 day with no refresh mechanism

### Input Validation & Sanitization

- [ ] **Sanitize Tiptap rich text content** - XSS vulnerability in announcements and assignments (add DOMPurify)
- [ ] **Add file upload validation** - No size limits, type checking, or malicious file detection
- [ ] **Implement secure temp directories** - File uploads don't use secure temporary storage
- [ ] **Standardize validation libraries** - Mixed use of Valibot and Zod across codebase (standardize on Valibot)
- [ ] **Add comprehensive file type whitelist** - Only allow safe file types for uploads

### Core Missing Features (README Requirements)

- [ ] **Student Portal & Result Viewing** - Students cannot search/view results by admission number (core README requirement)
- [ ] **Student Authentication System** - No login/auth for students, only staff
- [ ] **PDF Export Functionality** - Cannot generate PDF reports for results (README requires this)
- [ ] **Excel Export Functionality** - Cannot export results to Excel format (README requires this)

### Code Issues

- [ ] **Expose grade edit functionality** - `update_grade()` exists in database layer but not in remote functions (grades.remote.ts)
- [ ] **Fix Dialog component state binding** - Dialog component needs optional `bind:open` prop for proper state management
- [ ] **Fix permission system enforcement** - Permissions stored but NEVER checked in UI or remote functions

## 🟡 HIGH PRIORITY

### Security & Access Control

- [ ] **Enforce permission checks in all remote functions** - Check user permissions before allowing CRUD operations
- [ ] **Implement audit logging system** - Track who created/modified/deleted students, grades, payments
- [ ] **Add account lockout mechanism** - Lock accounts after N failed login attempts
- [ ] **Implement CSRF protection** - Use SvelteKit's server hooks for centralized CSRF protection
- [ ] **Add IP address tracking** - Log IP addresses for security audit trail

### Database Schema Enhancements

- [ ] **Add database indexes** - Index frequently queried fields (admission_number, school_id, student_id, etc.)
- [ ] **Create guardians/parents table** - Students have no parent/guardian contact information
- [ ] **Add attendance tracking table** - No way to track daily student attendance
- [ ] **Create timetable/schedule table** - No class scheduling or timetable management
- [ ] **Implement assignment submissions table** - Students can't submit assignments digitally
- [ ] **Add audit_logs table** - Store all sensitive operations with user, timestamp, changes

### Missing CRUD Operations

- [ ] **Complete grade edit functionality** - UI shows "TODO" alerts when trying to edit grades
- [ ] **Add bulk operations UI** - Import students from CSV/Excel, bulk grade entry, mass updates
- [ ] **Implement grade edit remote function** - Connect UI to existing `update_grade()` database method
- [ ] **Add student batch import** - Allow CSV/Excel upload for student enrollment

### Enhanced Reporting

- [ ] **Replace mock dashboard data** - Dashboard shows fake data, integrate real grade analytics
- [ ] **Student performance reports** - Average grades per subject, term-over-term progress
- [ ] **Class performance comparisons** - Compare class averages and distributions
- [ ] **Payment collection reports** - Outstanding fees, payment history, revenue tracking
- [ ] **Attendance reports** - Absence rates, late arrivals, excused vs unexcused
- [ ] **Grade distribution charts** - Visualize grade spreads across classes/subjects

## 🟠 MEDIUM PRIORITY

### Feature Enhancements

- [ ] **Attendance Tracking System** - Daily attendance recording with absence reasons and notifications
- [ ] **Class Timetable Management** - Create and manage class schedules with teacher assignments
- [ ] **Assignment Submission Workflow** - Allow students to submit assignments, track status, link to grades
- [ ] **Grade Weighting & GPA Calculation** - Weighted grades (exams 40%, assignments 30%, etc.), automatic GPA
- [ ] **Parent Portal** - Separate authentication for parents to view children's progress
- [ ] **Course/Curriculum Management** - Define courses, learning objectives, curriculum mapping
- [ ] **Transcript Generation** - Official transcripts with seals and signatures

### Data Management

- [ ] **Cloud Storage Integration** - Integrate Cloudinary or AWS S3 for avatars and documents
- [ ] **Implement CDN for assets** - Serve images and documents via CDN for performance
- [ ] **Database backup automation** - Automated daily backups with restore functionality
- [ ] **Data export API** - Export all students, grades, payments to CSV/Excel
- [ ] **Add data retention policies** - Define and implement retention rules for student data

### Communication & Notifications

- [ ] **Real-time notification system** - New announcements, grade posted, payment reminders (SSE or WebSockets)
- [ ] **Email service integration** - Transactional emails for password reset, announcements (Resend, SendGrid)
- [ ] **SMS Integration** - Bulk SMS notifications for urgent announcements (Twilio, Africa's Talking)
- [ ] **Communication Hub** - Direct messaging between parents-teachers, group chats per class
- [ ] **Read receipts for announcements** - Track who has read important announcements

### Advanced Search & Filtering

- [ ] **Advanced student search** - Search by name, admission number, class, status, date range
- [ ] **Grade filtering** - Filter by term, year, subject, student, grade range
- [ ] **Payment history search** - Search and filter payment records for accounting
- [ ] **Staff directory search** - Search staff by name, role, employment type

### User Experience

- [ ] **Mobile responsiveness audit** - Ensure all pages work well on mobile devices
- [ ] **Tablet optimization** - Optimize layout and interactions for tablets
- [ ] **Progressive Web App (PWA)** - Add offline capabilities and install prompt
- [ ] **Touch-friendly interfaces** - Optimize forms and tables for touch input
- [ ] **Responsive tables** - Fix table overflow on mobile screens

## 🟢 LOW PRIORITY

### Additional Features

- [ ] **School Calendar & Events** - School calendar with holidays, exam dates, event management
- [ ] **Parent-Teacher Conference Scheduling** - Online scheduling system with calendar integration
- [ ] **Emergency Alert System** - Multi-channel notifications for emergencies or school closures
- [ ] **Digital Report Card Designer** - Visual template builder for custom report cards
- [ ] **Multi-language Support (i18n)** - Support for Krio, Mende, Temne, and other local languages
- [ ] **WhatsApp Business Integration** - Parent communication via WhatsApp API (high adoption in Africa)
- [ ] **Mobile Money Integration** - Orange Money, Airtel Money payment gateway for fees
- [ ] **Multi-currency Support** - Handle different currencies for international schools

### Library Management (Future)

- [ ] **Digital Book Catalog** - Search, reservation, and recommendation features
- [ ] **Circulation Management** - Check-out/check-in with due date tracking
- [ ] **Fine Management System** - Automated fine calculations with payment integration

### Extracurricular Management (Future)

- [ ] **Sports Team Management** - Team registration, practice schedules, performance tracking
- [ ] **Club & Activity Management** - Activity clubs with membership management
- [ ] **Achievement Tracking** - Awards, certificates, recognition system with digital badges

### Health & Safety (Future)

- [ ] **Medical Records System** - Health history, allergies, medications, emergency contacts
- [ ] **Medical Alerts & Notifications** - Automated notifications for medical conditions
- [ ] **Incident Reporting System** - Bullying, accidents, behavioral incident tracking
- [ ] **Health Screening Tracking** - Immunization records, vision/hearing tests

## 📋 Code Quality & Architecture

### TypeScript & Code Cleanup

- [X] **Fix TypeScript error handling** - Access `.message` on unknown error types
- [X] **Fix subscription_id schema issues** - Resolve optional vs required inconsistency
- [X] **Fix undefined password variable** - Resolve undefined `password` variable in staff detail page
- [X] **Remove unused variables** - Clean up unused variables
- [ ] **Standardize error handling** - Consistent error handling with proper TypeScript typing
- [ ] **Eliminate `any` types** - Replace with proper interfaces

### Svelte 5 & SvelteKit Optimization

- [X] **Fully adopt Svelte 5 runes** - Replace legacy patterns with `$state`, `$effect`
- [X] **Ensure SvelteKit 2.x compatibility** - Utilize enhanced forms and server actions
- [X] **Implement SvelteKit's +page.server.ts** - Use server data loading
- [X] **Integrate SvelteKit's error boundaries** - Add error logging and boundaries
- [ ] **Add SvelteKit's built-in caching** - Implement query caching via `invalidateAll()`
- [ ] **Optimize bundle size** - Lazy-loading for routes and components
- [ ] **Audit Melt UI accessibility** - Ensure ARIA standards and keyboard navigation

### Database & Performance

- [X] **Multi-tenancy Support** - Support for multiple schools with data isolation
- [ ] **Query optimization** - Optimize slow queries with proper indexes
- [ ] **Database performance monitoring** - Track query performance in production
- [ ] **Evaluate read replicas** - Consider read/write separation for scaling

### Architecture Improvements

- [X] **Separate business logic** - Refactor using service/repository patterns (Direct Database Methods)
- [ ] **Standardize Database Method Development** - Create guidelines and templates for new operations
- [ ] **Create Database Methods API Reference** - Document all database methods with examples
- [ ] **Centralize validation schemas** - Centralize all validation with comprehensive error messages
- [ ] **Consider Redis cache layer** - Cache frequently accessed data (student lists, grades)
- [ ] **Consider job queue system** - Background processing for exports and emails (BullMQ)

## 🚀 Deployment & DevOps

### Production Readiness

- [ ] **Set up CI/CD pipeline** - Automated deployment workflows (GitHub Actions)
- [ ] **Add Drizzle migration scripts** - Proper migration strategy for schema changes
- [ ] **Implement automated backups** - Database backup system with restore functionality
- [ ] **Add environment-based configuration** - Separate dev/staging/production configs
- [ ] **Ensure GDPR/CCPA compliance** - Data handling compliance checks

### Documentation

- [ ] **Create user guides** - Admin, teacher, and student manuals
- [ ] **Add developer documentation** - Code docs, contribution guidelines, architecture overview
- [ ] **Create developer onboarding guide** - Setup guide covering Svelte 5, SvelteKit structure
- [ ] **Document API endpoints** - Reference for all remote functions
- [ ] **Create deployment guide** - Production deployment checklist

## 📊 Priority Legend

- **🔴 CRITICAL** - Security vulnerabilities, authentication issues, core missing features - FIX IMMEDIATELY
- **🟡 HIGH** - Permission enforcement, audit logging, database improvements, missing CRUD - NEXT SPRINT
- **🟠 MEDIUM** - Feature enhancements, data management, communication tools - WITHIN 1-2 MONTHS
- **🟢 LOW** - Nice-to-have features, future enhancements - BACKLOG

## 🎯 Quick Wins (Can Be Done Today)

1. **Expose grade edit functionality** - Add `update_grade` remote function (15 minutes)
2. **Fix JWT verification** - Use `jwt.verify()` instead of manual parsing (30 minutes)
3. **Add password strength validation** - Implement password schema with complexity rules (20 minutes)
4. **Add basic rate limiting** - Prevent brute force on login endpoint (45 minutes)

## 📈 Implementation Strategy

### Phase 1: Security & Critical Fixes (Week 1-2)
1. Fix JWT verification with proper signature checking
2. Add password complexity requirements
3. Implement rate limiting on authentication
4. Sanitize Tiptap content (add DOMPurify)
5. Add file upload validation
6. Enforce permission checks in remote functions

### Phase 2: Core Feature Completion (Week 3-4)
1. Expose and implement grade edit functionality
2. Build student portal for result viewing
3. Implement PDF export (puppeteer or jsPDF)
4. Implement Excel export (xlsx library)
5. Add student authentication system
6. Implement audit logging system

### Phase 3: Database & Architecture (Week 5-6)
1. Add database indexes for performance
2. Create guardians/parents table and CRUD
3. Implement attendance tracking system
4. Add timetable/schedule management
5. Create assignment submission workflow
6. Replace mock dashboard with real analytics

### Phase 4: Enhanced Features (Week 7-8)
1. Grade weighting and GPA calculation
2. Real-time notification system
3. Email service integration
4. Cloud storage integration (Cloudinary/S3)
5. Advanced search and filtering
6. Bulk operations (import/export)

### Phase 5: Scale & Polish (Week 9-10)
1. Mobile responsiveness audit and fixes
2. PWA implementation with offline mode
3. Communication hub (messaging)
4. SMS integration
5. Parent portal
6. Multi-language support foundation

---

_Last updated: October 29, 2025_
_Total items: 125+_
_Critical items: 16_
_High priority items: 24_
_Medium priority items: 35+_
_Low priority items: 30+_
