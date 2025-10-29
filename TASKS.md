# Caelum Development Tasks

Actionable tasks organized by implementation phase. Check off tasks as they are completed.

---

## 🎯 QUICK WINS (Can Be Done Today)

- [ ] Expose `update_grade` remote function in `grades.remote.ts`
- [ ] Connect grade edit UI to `update_grade()` database method
- [ ] Replace manual JWT parsing with `jwt.verify()` in `src/lib/auth.ts`
- [ ] Create password complexity validation schema in `src/lib/schemas.ts`
- [ ] Apply password validation to registration and password change forms
- [ ] Add basic rate limiting middleware for authentication routes

---

## 🔴 Phase 1: Security & Critical Fixes

### Authentication Security

- [ ] Fix JWT verification in `src/lib/auth.ts:23-26`
  - [ ] Replace `JSON.parse(Buffer.from(...))` with `jwt.verify()`
  - [ ] Add JWT_SECRET validation
  - [ ] Add expiration checking
  - [ ] Handle verification errors properly
- [ ] Implement password complexity requirements
  - [ ] Create `password_schema` with min 8 chars, uppercase, lowercase, number, special char
  - [ ] Apply to staff registration form
  - [ ] Apply to password change functionality
  - [ ] Add password strength indicator in UI
- [ ] Add authentication rate limiting
  - [ ] Install rate limiting package (express-rate-limit or custom)
  - [ ] Create rate limiter middleware
  - [ ] Apply to `/auth/login` endpoint
  - [ ] Apply to `/auth/register` endpoint
  - [ ] Set limit: 5 attempts per 15 minutes
- [ ] Implement session invalidation
  - [ ] Add logout functionality that clears token
  - [ ] Add token blacklist mechanism (Redis or database table)
  - [ ] Invalidate all sessions on password change
- [ ] Add refresh token system
  - [ ] Create refresh token generation function
  - [ ] Store refresh tokens in database
  - [ ] Add refresh endpoint
  - [ ] Update client to use refresh tokens

### Input Validation & Sanitization

- [ ] Sanitize Tiptap rich text content
  - [ ] Install DOMPurify: `npm install isomorphic-dompurify`
  - [ ] Create sanitization utility function
  - [ ] Apply to announcements before saving
  - [ ] Apply to assignments before saving
  - [ ] Sanitize on display as well
- [ ] Add file upload validation
  - [ ] Add file size limit (e.g., 10MB max)
  - [ ] Create file type whitelist (pdf, docx, images only)
  - [ ] Add MIME type verification
  - [ ] Add malicious file detection
  - [ ] Update `src/lib/upload.ts` with validations
- [ ] Implement secure temp directories
  - [ ] Create dedicated temp directory for uploads
  - [ ] Add cleanup function for old temp files
  - [ ] Use OS temp directory with restricted permissions
- [ ] Standardize on Valibot
  - [ ] Find all Zod usages: `grep -r "from 'zod'" src/`
  - [ ] Replace Zod schemas with Valibot equivalents
  - [ ] Update imports across all files
  - [ ] Remove Zod from dependencies
- [ ] Add file type whitelist enforcement
  - [ ] Define allowed extensions in constants
  - [ ] Validate file extensions on upload
  - [ ] Validate MIME types match extensions

### Permission System Enforcement

- [ ] Create permission checking utility function
  - [ ] Add `check_permission(user, permission)` helper
  - [ ] Add `ensure_permission(user, permission)` that throws error
- [ ] Enforce permissions in student remote functions
  - [ ] Check `students:view` in get operations
  - [ ] Check `students:create` in add operations
  - [ ] Check `students:edit` in update operations
  - [ ] Check `students:delete` in delete operations
- [ ] Enforce permissions in staff remote functions
  - [ ] Check `staff:view` in get operations
  - [ ] Check `staff:create` in add operations
  - [ ] Check `staff:edit` in update operations
  - [ ] Check `staff:delete` in delete operations
- [ ] Enforce permissions in classes remote functions
- [ ] Enforce permissions in subjects remote functions
- [ ] Add UI-level permission checks
  - [ ] Hide create buttons if user lacks permission
  - [ ] Hide edit buttons if user lacks permission
  - [ ] Hide delete buttons if user lacks permission

### Grade Edit Functionality

- [ ] Export `update_grade` remote function in `grades.remote.ts`
- [ ] Create edit grade form component
- [ ] Add edit button to grades list
- [ ] Handle form submission
- [ ] Test edit functionality end-to-end
- [ ] Remove "TODO" alerts from UI

---

## 🟡 Phase 2: Core Feature Completion

### Student Portal

- [ ] Design student portal UI/UX
- [ ] Create new route group: `src/routes/(student-portal)/`
- [ ] Add student login page
- [ ] Implement student authentication
  - [ ] Add `student_password` field to students table
  - [ ] Create student registration/password setup
  - [ ] Add student JWT token generation
  - [ ] Create `get_current_student()` function
- [ ] Create result search page
  - [ ] Add search by admission number form
  - [ ] Query grades for matched student
  - [ ] Display grade results in table
  - [ ] Show term and academic year filters
- [ ] Add result viewing page
  - [ ] Display student information
  - [ ] Show grades grouped by subject
  - [ ] Calculate and display averages
  - [ ] Show term and year breakdown

### PDF Export

- [ ] Choose PDF library (puppeteer vs jsPDF)
- [ ] Install chosen library: `npm install puppeteer` or `npm install jspdf`
- [ ] Create PDF generation utility in `src/lib/pdf.ts`
- [ ] Design student result PDF template
  - [ ] Header with school logo and info
  - [ ] Student details section
  - [ ] Grades table by subject
  - [ ] Summary statistics (average, GPA if implemented)
  - [ ] Footer with generation date
- [ ] Create PDF generation remote function
- [ ] Add "Download PDF" button to result view
- [ ] Test PDF generation with various data
- [ ] Handle errors gracefully

### Excel Export

- [ ] Install xlsx library: `npm install xlsx`
- [ ] Create Excel generation utility in `src/lib/excel.ts`
- [ ] Create student result Excel template
  - [ ] Header row with column names
  - [ ] Student info rows
  - [ ] Grades data rows
  - [ ] Formatting (bold headers, borders, etc.)
- [ ] Create Excel generation remote function
- [ ] Add "Download Excel" button to result view
- [ ] Test Excel export with various data
- [ ] Implement bulk export (all students in class)

### Audit Logging System

- [ ] Design audit log schema
  - [ ] Create `audit_logs` table in schema.ts
  - [ ] Fields: id, user_id, action, entity_type, entity_id, changes, ip_address, user_agent, timestamp
- [ ] Create audit log database methods
  - [ ] `create_audit_log()`
  - [ ] `get_audit_logs(filters)`
  - [ ] `get_audit_logs_by_entity()`
- [ ] Create audit logging utility function
  - [ ] `log_audit(user, action, entity_type, entity_id, changes)`
- [ ] Add audit logging to student operations
  - [ ] Log on student creation
  - [ ] Log on student update
  - [ ] Log on student deletion
- [ ] Add audit logging to grade operations
  - [ ] Log on grade creation
  - [ ] Log on grade update
  - [ ] Log on grade deletion
- [ ] Add audit logging to payment operations
- [ ] Add audit logging to staff operations
- [ ] Create audit log viewer page
  - [ ] Filter by user, entity type, date range
  - [ ] Display changes (before/after)
  - [ ] Export audit logs to CSV

---

## 🟠 Phase 3: Database & Architecture

### Database Indexes

- [ ] Add index on `students.admission_number`
- [ ] Add index on `students.school_id`
- [ ] Add index on `students.class_id`
- [ ] Add index on `grades.student_id`
- [ ] Add index on `grades.subject_id`
- [ ] Add index on `grades.school_id`
- [ ] Add index on `payments.student_id`
- [ ] Add index on `payments.school_id`
- [ ] Add index on `staff.school_id`
- [ ] Add index on `staff.email`
- [ ] Run database migration with new indexes
- [ ] Test query performance before/after

### Guardians/Parents Table

- [ ] Design guardians schema
  - [ ] Fields: id, first_name, last_name, email, phone, relationship, student_id
  - [ ] Add is_primary_contact boolean
  - [ ] Add emergency_contact boolean
- [ ] Add guardians table to schema.ts
- [ ] Create guardian database methods
  - [ ] `get_guardians(student_id)`
  - [ ] `create_guardian(data)`
  - [ ] `update_guardian(id, data)`
  - [ ] `delete_guardian(id)`
- [ ] Create guardian remote functions
- [ ] Add guardian management UI to student detail page
  - [ ] List guardians
  - [ ] Add guardian form
  - [ ] Edit guardian functionality
  - [ ] Delete guardian confirmation
- [ ] Update student forms to include guardian info

### Attendance Tracking System

- [ ] Design attendance schema
  - [ ] Table: id, student_id, date, status, notes, marked_by, school_id
  - [ ] Status enum: present, absent, late, excused
- [ ] Add attendance table to schema.ts
- [ ] Create attendance database methods
  - [ ] `mark_attendance(student_id, date, status)`
  - [ ] `get_attendance(class_id, date)`
  - [ ] `get_student_attendance(student_id, date_range)`
  - [ ] `get_attendance_stats(class_id, date_range)`
- [ ] Create attendance remote functions
- [ ] Build attendance UI
  - [ ] Daily attendance marking page (class view)
  - [ ] Student attendance history view
  - [ ] Attendance statistics dashboard
  - [ ] Export attendance report
- [ ] Add attendance notifications
  - [ ] Notify guardians of absences
  - [ ] Weekly attendance summary

### Class Timetable

- [ ] Design timetable schema
  - [ ] Table: id, class_id, subject_id, staff_id, day_of_week, start_time, end_time, room
- [ ] Add timetable table to schema.ts
- [ ] Create timetable database methods
  - [ ] `create_timetable_entry(data)`
  - [ ] `get_timetable(class_id)`
  - [ ] `get_staff_timetable(staff_id)`
  - [ ] `update_timetable_entry(id, data)`
  - [ ] `delete_timetable_entry(id)`
  - [ ] `check_timetable_conflicts()`
- [ ] Create timetable remote functions
- [ ] Build timetable UI
  - [ ] Weekly grid view
  - [ ] Add/edit timetable entries
  - [ ] Teacher assignment to time slots
  - [ ] Conflict detection
  - [ ] Print/export timetable

### Assignment Submission Workflow

- [ ] Design assignment submissions schema
  - [ ] Table: id, assignment_id, student_id, file_url, submission_date, status, grade_id
  - [ ] Status enum: submitted, late, graded, returned
- [ ] Add submissions table to schema.ts
- [ ] Create submission database methods
  - [ ] `submit_assignment(assignment_id, student_id, file_url)`
  - [ ] `get_submissions(assignment_id)`
  - [ ] `get_student_submissions(student_id)`
  - [ ] `update_submission_status(id, status)`
  - [ ] `link_grade_to_submission(submission_id, grade_id)`
- [ ] Build student submission UI
  - [ ] View assigned assignments
  - [ ] Upload submission file
  - [ ] View submission status
  - [ ] View graded submissions
- [ ] Build teacher grading UI
  - [ ] View all submissions for assignment
  - [ ] Download submitted files
  - [ ] Add grade and link to submission
  - [ ] Mark as graded/returned

### Real Dashboard Analytics

- [ ] Create analytics database methods
  - [ ] `get_student_count_by_status(school_id)`
  - [ ] `get_grade_averages_by_class(school_id)`
  - [ ] `get_grade_distribution(school_id)`
  - [ ] `get_payment_statistics(school_id)`
  - [ ] `get_attendance_statistics(school_id)`
  - [ ] `get_student_growth_over_time(school_id)`
- [ ] Replace mock data in dashboard +page.server.ts
- [ ] Update dashboard charts with real data
  - [ ] Student growth line chart
  - [ ] Grade distribution doughnut chart
  - [ ] Attendance trends
  - [ ] Payment collection rates
- [ ] Add filters to dashboard
  - [ ] Date range selector
  - [ ] Class filter
  - [ ] Term filter
- [ ] Add exportable reports
  - [ ] Export dashboard as PDF
  - [ ] Export data as Excel

---

## 🟢 Phase 4: Enhanced Features

### Grade Weighting & GPA

- [ ] Design grade weighting configuration
  - [ ] Add weight field to grades table
  - [ ] Create grade_weights config table (subject_id, grade_type, weight_percentage)
- [ ] Update schema with weighting fields
- [ ] Create GPA calculation functions
  - [ ] Calculate weighted average per subject
  - [ ] Calculate overall GPA
  - [ ] Map scores to letter grades (A, B, C, D, F)
  - [ ] Calculate class rank
- [ ] Update grade display to show weighted values
- [ ] Add GPA to student profile
- [ ] Create grade weighting configuration UI
  - [ ] Set weights by grade type
  - [ ] Configure grading scale
  - [ ] Set GPA calculation method

### Real-time Notifications

- [ ] Choose notification approach (SSE vs WebSockets)
- [ ] Install dependencies if needed
- [ ] Create notification schema
  - [ ] Table: id, user_id, type, title, message, read, link, timestamp
- [ ] Create notification database methods
  - [ ] `create_notification(user_id, data)`
  - [ ] `get_notifications(user_id)`
  - [ ] `mark_notification_read(id)`
  - [ ] `mark_all_read(user_id)`
- [ ] Implement server-side notification sending
  - [ ] SSE endpoint or WebSocket server
  - [ ] Send notification on new announcement
  - [ ] Send notification on new grade posted
  - [ ] Send notification on payment reminder
- [ ] Build notification UI component
  - [ ] Notification bell icon with count
  - [ ] Notification dropdown list
  - [ ] Mark as read functionality
  - [ ] Click to navigate to related content
- [ ] Add notification preferences
  - [ ] User settings for notification types
  - [ ] Email notification option
  - [ ] SMS notification option

### Email Service Integration

- [ ] Choose email service provider (Resend, SendGrid, AWS SES)
- [ ] Install email service SDK
- [ ] Create email configuration in `src/lib/config.ts`
- [ ] Create email utility functions in `src/lib/email.ts`
  - [ ] `send_welcome_email(user)`
  - [ ] `send_password_reset_email(user, token)`
  - [ ] `send_announcement_email(recipients, announcement)`
  - [ ] `send_grade_notification_email(student, grade)`
  - [ ] `send_payment_reminder_email(student, amount)`
- [ ] Create email templates
  - [ ] Welcome email template
  - [ ] Password reset template
  - [ ] Announcement template
  - [ ] Grade notification template
  - [ ] Payment reminder template
- [ ] Integrate email sending in workflows
  - [ ] Send welcome email on registration
  - [ ] Send announcement emails when published
  - [ ] Send grade notifications to parents
  - [ ] Schedule payment reminder emails

### Cloud Storage Integration

- [ ] Choose cloud storage provider (Cloudinary or AWS S3)
- [ ] Create account and get API credentials
- [ ] Install cloud storage SDK
  - [ ] Cloudinary: `npm install cloudinary`
  - [ ] AWS S3: `npm install @aws-sdk/client-s3`
- [ ] Create storage configuration in `src/lib/config.ts`
- [ ] Create storage utility functions in `src/lib/storage.ts`
  - [ ] `upload_file(file, folder)`
  - [ ] `delete_file(url)`
  - [ ] `get_signed_url(file_path)`
- [ ] Update file upload logic
  - [ ] Replace local storage with cloud storage
  - [ ] Update avatar upload to use cloud storage
  - [ ] Update assignment upload to use cloud storage
  - [ ] Update school logo upload to use cloud storage
- [ ] Add CDN integration
  - [ ] Configure CDN settings
  - [ ] Update image URLs to use CDN
  - [ ] Add image transformation (resize, compress)

### Advanced Search & Filtering

- [ ] Add search functionality to students page
  - [ ] Search by name (first, middle, last)
  - [ ] Search by admission number
  - [ ] Filter by class
  - [ ] Filter by status
  - [ ] Filter by enrollment date range
- [ ] Add search to grades page
  - [ ] Filter by term
  - [ ] Filter by academic year
  - [ ] Filter by subject
  - [ ] Filter by student
  - [ ] Filter by grade type
  - [ ] Filter by grade range
- [ ] Add search to payments page
  - [ ] Search by student name/admission
  - [ ] Filter by payment type
  - [ ] Filter by payment method
  - [ ] Filter by date range
  - [ ] Filter by amount range
- [ ] Add search to staff page
  - [ ] Search by name
  - [ ] Filter by role
  - [ ] Filter by employment type
  - [ ] Filter by status
- [ ] Optimize search queries with indexes

### Bulk Operations

- [ ] Student CSV/Excel import
  - [ ] Create import template with headers
  - [ ] Add CSV parsing (use papaparse)
  - [ ] Add Excel parsing (use xlsx)
  - [ ] Validate imported data
  - [ ] Show preview before import
  - [ ] Import button and progress indicator
  - [ ] Error handling and reporting
- [ ] Bulk grade entry
  - [ ] Create grid interface for class grades
  - [ ] Allow inline editing
  - [ ] Bulk save functionality
  - [ ] Validation before save
- [ ] Bulk student status update
  - [ ] Select multiple students
  - [ ] Change status dropdown
  - [ ] Confirmation dialog
  - [ ] Update in single transaction
- [ ] Bulk data export
  - [ ] Export all students to CSV/Excel
  - [ ] Export all grades to CSV/Excel
  - [ ] Export all payments to CSV/Excel
  - [ ] Add filters to export

---

## 🎨 Phase 5: Scale & Polish

### Mobile Responsiveness

- [ ] Audit all pages on mobile devices
- [ ] Fix navigation for mobile
  - [ ] Hamburger menu for sidebar
  - [ ] Collapsible navigation
  - [ ] Touch-friendly buttons
- [ ] Fix tables on mobile
  - [ ] Horizontal scroll or card view
  - [ ] Hide less important columns
  - [ ] Stack columns vertically
- [ ] Optimize forms for mobile
  - [ ] Larger input fields
  - [ ] Better keyboard handling
  - [ ] Touch-friendly date pickers
- [ ] Test on various screen sizes
  - [ ] iPhone (375px)
  - [ ] Android phones (360px)
  - [ ] Tablets (768px)
  - [ ] Small laptops (1024px)

### Progressive Web App (PWA)

- [ ] Create web app manifest
  - [ ] App name and short name
  - [ ] Icons (various sizes)
  - [ ] Theme color
  - [ ] Display mode
  - [ ] Start URL
- [ ] Create service worker
  - [ ] Cache static assets
  - [ ] Offline fallback page
  - [ ] Background sync for forms
- [ ] Add install prompt
  - [ ] Detect installability
  - [ ] Show install banner
  - [ ] Handle install event
- [ ] Test offline functionality
  - [ ] View cached pages offline
  - [ ] Queue actions when offline
  - [ ] Sync when back online

### Communication Hub

- [ ] Design messaging schema
  - [ ] conversations table
  - [ ] messages table
  - [ ] conversation_participants table
- [ ] Create messaging database methods
  - [ ] Create conversation
  - [ ] Send message
  - [ ] Get conversations
  - [ ] Get messages
  - [ ] Mark as read
- [ ] Build messaging UI
  - [ ] Conversation list
  - [ ] Chat interface
  - [ ] Message composition
  - [ ] Unread indicators
  - [ ] Real-time message updates
- [ ] Add direct messaging
  - [ ] Parent to teacher
  - [ ] Teacher to student
  - [ ] Admin to all
- [ ] Add group chats
  - [ ] Class-based groups
  - [ ] Subject-based groups
  - [ ] Staff groups

### SMS Integration

- [ ] Choose SMS provider (Twilio, Africa's Talking)
- [ ] Create account and get API credentials
- [ ] Install SMS SDK
- [ ] Create SMS configuration in config.ts
- [ ] Create SMS utility functions
  - [ ] `send_sms(phone, message)`
  - [ ] `send_bulk_sms(phones, message)`
- [ ] Add SMS to notifications
  - [ ] SMS for urgent announcements
  - [ ] SMS for payment reminders
  - [ ] SMS for absence alerts
  - [ ] SMS for emergency alerts
- [ ] Add SMS preferences
  - [ ] User opt-in for SMS
  - [ ] SMS notification settings

### Parent Portal

- [ ] Design parent authentication
  - [ ] Link parent accounts to students (via guardians table)
  - [ ] Parent login page
  - [ ] Parent JWT generation
- [ ] Create parent dashboard
  - [ ] View linked children
  - [ ] View children's grades
  - [ ] View children's attendance
  - [ ] View payment history
  - [ ] View announcements
- [ ] Add parent-teacher messaging
  - [ ] Send message to teacher
  - [ ] View message history
- [ ] Add notifications for parents
  - [ ] New grade posted
  - [ ] Absence alert
  - [ ] Payment reminder
  - [ ] Announcement notification

### Multi-language Support Foundation

- [ ] Choose i18n library (svelte-i18n)
- [ ] Install and configure i18n: `npm install svelte-i18n`
- [ ] Create translation files
  - [ ] en.json (English)
  - [ ] kri.json (Krio - Sierra Leone)
  - [ ] Add placeholders for future languages
- [ ] Wrap all text in translation function
  - [ ] Page headings
  - [ ] Form labels
  - [ ] Button text
  - [ ] Error messages
  - [ ] Validation messages
- [ ] Add language selector
  - [ ] Dropdown in header
  - [ ] Save preference to user profile
  - [ ] Load user's language on login
- [ ] Translate key pages first
  - [ ] Login page
  - [ ] Dashboard
  - [ ] Student list
  - [ ] Grade entry

---

## 📚 Documentation

- [ ] Create user guide for admins
  - [ ] School setup
  - [ ] Staff management
  - [ ] Student enrollment
  - [ ] Grade entry
  - [ ] Reports and analytics
- [ ] Create user guide for teachers
  - [ ] Login and navigation
  - [ ] Managing classes
  - [ ] Recording grades
  - [ ] Creating assignments
  - [ ] Viewing reports
- [ ] Create user guide for students
  - [ ] Login process
  - [ ] Viewing grades
  - [ ] Downloading results
  - [ ] Submitting assignments
- [ ] Create developer documentation
  - [ ] Architecture overview
  - [ ] Database schema documentation
  - [ ] API reference (remote functions)
  - [ ] Adding new features guide
  - [ ] Contribution guidelines
- [ ] Create deployment guide
  - [ ] Environment setup
  - [ ] Database migration
  - [ ] Production configuration
  - [ ] Monitoring setup
  - [ ] Backup procedures

---

## 🚀 Deployment & DevOps

### CI/CD Pipeline

- [ ] Set up GitHub Actions workflow
  - [ ] Create `.github/workflows/ci.yml`
  - [ ] Add build step
  - [ ] Add lint step
  - [ ] Add type check step
- [ ] Set up staging environment
  - [ ] Configure staging server
  - [ ] Set up staging database
  - [ ] Configure environment variables
  - [ ] Deploy to staging on main branch
- [ ] Set up production deployment
  - [ ] Configure production server
  - [ ] Set up production database
  - [ ] Configure environment variables
  - [ ] Manual approval for production
  - [ ] Deploy on release tags

### Database Migrations

- [ ] Create migration strategy document
- [ ] Set up migration workflow
  - [ ] Run migrations on deployment
  - [ ] Backup before migration
  - [ ] Rollback plan
- [ ] Create initial migration from current schema
- [ ] Test migrations on staging
- [ ] Document migration process

### Automated Backups

- [ ] Set up database backup script
  - [ ] Daily full backup
  - [ ] Weekly archive
  - [ ] Monthly long-term storage
- [ ] Configure backup storage
  - [ ] Cloud storage (S3, Google Cloud Storage)
  - [ ] Local backup retention (7 days)
  - [ ] Off-site backup retention (30 days)
- [ ] Create restore procedure
  - [ ] Document restore steps
  - [ ] Test restore process
  - [ ] Create restore script
- [ ] Set up backup monitoring
  - [ ] Alert on backup failure
  - [ ] Verify backup integrity
  - [ ] Test restore periodically

### Environment Configuration

- [ ] Create .env.example file with all variables
- [ ] Document all environment variables
- [ ] Set up dev environment config
- [ ] Set up staging environment config
- [ ] Set up production environment config
- [ ] Add environment validation on startup

---

## 📊 Progress Tracking

**Total Tasks:** ~250+

**Critical Priority:** 35+ tasks
**High Priority:** 60+ tasks
**Medium Priority:** 90+ tasks
**Low Priority:** 65+ tasks

---

_Last updated: October 29, 2025_
_Use this file to track implementation progress across all phases_
