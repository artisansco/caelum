# Caelum Implementation Guide

**Last Updated:** October 29, 2025
**Version:** 2.0
**Status:** Major Features Implemented

This guide covers all implemented features, pending work, and step-by-step instructions for completing the Caelum school management system.

---

## Table of Contents

1. [Overview](#overview)
2. [What's Implemented](#whats-implemented)
3. [Critical Next Steps](#critical-next-steps)
4. [Database Migration](#database-migration)
5. [Environment Configuration](#environment-configuration)
6. [Feature Implementation Status](#feature-implementation-status)
7. [API Services Setup](#api-services-setup)
8. [Database Query Patterns](#database-query-patterns)
9. [Authentication Flows](#authentication-flows)
10. [File Upload & Storage](#file-upload--storage)
11. [Testing & Deployment](#testing--deployment)

---

## Overview

Caelum is a modern school management system built with:
- **Frontend:** Svelte 5, SvelteKit 2, Tailwind CSS 4
- **Backend:** Node.js with SvelteKit server actions
- **Database:** SQLite with Drizzle ORM
- **Security:** JWT authentication, bcrypt password hashing, rate limiting

### Architecture
```
Frontend (Svelte 5) ←→ Remote Functions ←→ Database Methods ←→ SQLite
                              ↓
                        Service Layer
                    (Email, SMS, Storage)
```

---

## What's Implemented

### ✅ Security (CRITICAL - 100% Complete)

#### 1. JWT Verification Fix
**File:** `src/lib/auth.ts`

```typescript
// BEFORE (VULNERABLE):
const decoded = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());

// AFTER (SECURE):
const decoded = jwt.verify(token, config.JWT_SECRET) as CurrentUser;
```

**Impact:** Prevents token forgery attacks

#### 2. Password Complexity Requirements
**File:** `src/lib/schemas.ts`

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

**Applied to:** Staff registration, student registration (when implemented)

#### 3. Rate Limiting
**File:** `src/lib/rate-limit.ts`

- **Limit:** 5 attempts per 15 minutes
- **Lockout:** 30 minutes after exceeding limit
- **Storage:** In-memory (resets on server restart)
- **Applied to:** Login endpoints

**Usage Example:**
```typescript
const rate_limit = check_rate_limit(client_ip);
if (!rate_limit.allowed) {
  return { message: `Too many attempts. Try again in ${minutes} minutes.` };
}
```

#### 4. Permission System
**File:** `src/lib/auth.ts`

```typescript
// Check if user has permission
if (!check_permission(user, "students:delete")) {
  return { message: "Insufficient permissions" };
}

// Or redirect if missing permission
ensure_permission(user, "grades:edit");
```

**Permissions Available:**
- `students:view`, `students:create`, `students:edit`, `students:delete`
- `staff:view`, `staff:create`, `staff:edit`, `staff:delete`
- `classes:view`, `classes:create`, `classes:edit`, `classes:delete`
- `subjects:view`, `subjects:create`, `subjects:edit`, `subjects:delete`

### ✅ Input Sanitization (100% Complete)

#### HTML Sanitization
**File:** `src/lib/sanitize.ts`

```typescript
import { sanitize_html } from "$lib/sanitize";

// Before saving to database
const clean_content = sanitize_html(user_input);
```

**Use cases:**
- Announcements with Tiptap rich text
- Assignment descriptions
- Notes fields

#### File Upload Validation
**File:** `src/lib/file-validation.ts`

**Validations:**
- File size limits (2MB avatars, 5MB images, 10MB documents)
- MIME type checking
- Extension verification
- Malicious file detection

**Usage Example:**
```typescript
import { validate_avatar, validate_document } from "$lib/file-validation";

const validation = validate_avatar(file);
if (!validation.valid) {
  return { message: validation.error };
}
```

### ✅ Cloud Services Integration (100% Complete)

#### 1. Email Service (Resend)
**File:** `src/lib/services/email.ts`

**Setup:**
```bash
# Add to .env
RESEND_API_KEY=re_your_api_key_here
```

**Available Functions:**
- `send_email(options)` - Generic email sender
- `send_welcome_email(email, name)` - New user welcome
- `send_password_reset_email(email, token, base_url)` - Password reset
- `send_announcement_email(recipients, title, content)` - Announcements
- `send_grade_notification_email(parent_email, student_name, subject, grade, max_score)` - Grade alerts
- `send_payment_reminder_email(parent_email, student_name, amount, due_date)` - Payment reminders

**Usage Example:**
```typescript
import { send_grade_notification_email } from "$lib/services/email";

await send_grade_notification_email(
  "parent@example.com",
  "John Doe",
  "Mathematics",
  85,
  100
);
```

#### 2. SMS Service (Africa's Talking)
**File:** `src/lib/services/sms.ts`

**Setup:**
```bash
# Add to .env
AFRICAS_TALKING_API_KEY=your_api_key
AFRICAS_TALKING_USERNAME=your_username
```

**Available Functions:**
- `send_sms(options)` - Send single SMS
- `send_bulk_sms(recipients, message)` - Send to multiple recipients
- `send_absence_alert_sms(phone, student_name, date)` - Absence notifications
- `send_urgent_announcement_sms(recipients, title, content)` - Urgent alerts
- `send_payment_reminder_sms(phone, student_name, amount)` - Payment reminders
- `send_emergency_alert_sms(recipients, message)` - Emergency broadcasts

#### 3. Cloud Storage (Cloudinary)
**File:** `src/lib/services/storage.ts`

**Setup:**
```bash
# Add to .env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Available Functions:**
- `upload_file(file_path, folder, resource_type)` - Upload any file
- `delete_file(public_id, resource_type)` - Delete file
- `upload_avatar(file_path, user_id)` - Upload avatar with optimization
- `upload_school_logo(file_path, school_id)` - Upload school logo
- `upload_assignment(file_path, school_id)` - Upload assignment file
- `get_signed_url(public_id, expires_in)` - Generate signed URL for private files
- `get_optimized_image_url(public_id, options)` - Get optimized image URL

**Usage Example:**
```typescript
import { upload_avatar } from "$lib/services/storage";

const result = await upload_avatar(file_buffer, user.id);
if (result.success) {
  // Save result.url to database
}
```

### ✅ Database Schema (Ready for Migration)

#### New Tables Added

**1. guardians** - Parent/Guardian Information
```sql
- id, first_name, last_name
- email, phone_number
- relationship (parent/guardian/other)
- is_primary_contact, is_emergency_contact
- address, occupation
- student_id (FK), school_id (FK)
```

**2. attendance** - Daily Attendance Tracking
```sql
- id, student_id (FK)
- date, status (present/absent/late/excused)
- notes, marked_by (FK to staff)
- school_id (FK)
```

**3. timetable** - Class Schedules
```sql
- id, class_id (FK), subject_id (FK)
- staff_id (FK), day_of_week
- start_time, end_time, room
- school_id (FK)
```

**4. assignment_submissions** - Student Submissions
```sql
- id, assignment_id (FK), student_id (FK)
- file_url, file_name
- submission_date, status (submitted/late/graded/returned)
- grade_id (FK), feedback
- school_id (FK)
```

**5. audit_logs** - Action Tracking
```sql
- id, user_id (FK), action (create/update/delete)
- entity_type (student/staff/grade/payment/etc)
- entity_id, changes (JSON)
- ip_address, user_agent
- school_id (FK)
```

**6. notifications** - Real-time Notifications
```sql
- id, user_id (FK)
- type (announcement/grade_posted/payment_reminder/etc)
- title, message, link
- read (boolean)
- school_id (FK)
```

#### Enhanced Tables

**students** - Added `password` field for student portal authentication

### ✅ Quick Wins Completed

1. ✅ Grade edit functionality exposed
2. ✅ JWT verification fixed
3. ✅ Password validation added
4. ✅ Rate limiting implemented

---

## Critical Next Steps

### 🔴 Priority 1: Database Migration (REQUIRED)

**Run this command and confirm:**
```bash
npm run db:push
# Press "y" when prompted
```

This will create the 6 new tables and add the password field to students.

### 🟡 Priority 2: Create Database Query Methods

Need to create query methods for new tables in `src/lib/server/database/queries/`:

1. **guardians.ts** - CRUD for guardians
2. **attendance.ts** - Mark attendance, get records
3. **timetable.ts** - Manage class schedules
4. **submissions.ts** - Handle assignment submissions
5. **audit.ts** - Log and retrieve audit trails
6. **notifications.ts** - Create and manage notifications

### 🟡 Priority 3: Student Authentication & Portal

Files to create:
- `src/routes/(student-portal)/+layout.svelte` - Student portal layout
- `src/routes/(student-portal)/login/+page.svelte` - Student login
- `src/routes/(student-portal)/results/+page.svelte` - View results
- `src/lib/student-auth.ts` - Student authentication utilities

### 🟢 Priority 4: Export Functionality

Files to create:
- `src/lib/exports/pdf.ts` - PDF generation using pdfkit
- `src/lib/exports/excel.ts` - Excel generation using xlsx
- Remote functions to trigger exports

---

## Database Migration

### Step 1: Review Schema Changes

Open `src/lib/server/database/schema.ts` and review:
- New tables (6 added)
- Modified tables (students.password added)
- All foreign key relationships

### Step 2: Run Migration

```bash
cd /Users/local_server/marvelous/caelum
npm run db:push
```

When prompted:
```
❯ No, abort
  Yes, I want to execute all statements
```

Press **Down Arrow** then **Enter** to select "Yes"

### Step 3: Verify Migration

```bash
npm run db:studio
```

Navigate to `http://localhost:4983` and verify new tables exist.

### Step 4: Update Drizzle Relations (Optional)

Add table relations in schema.ts for better query joins.

---

## Environment Configuration

### Required Environment Variables

Create `.env` file in project root:

```bash
# Server
PORT=5000

# Database
DATABASE_URL=./caelum.db

# JWT Secret (generate a secure random string)
JWT_SECRET=your_jwt_secret_here_use_uuid_or_random_string

# Email Service (Resend)
RESEND_API_KEY=re_your_resend_api_key

# SMS Service (Africa's Talking)
AFRICAS_TALKING_API_KEY=your_at_api_key
AFRICAS_TALKING_USERNAME=your_at_username

# Cloud Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Getting API Keys

#### 1. Resend (Email)
1. Visit https://resend.com/
2. Sign up for free account
3. Go to API Keys section
4. Create new API key
5. Free tier: 100 emails/day

#### 2. Africa's Talking (SMS)
1. Visit https://africastalking.com/
2. Sign up and verify account
3. Go to Dashboard → API Key
4. Create sandbox or live app
5. Get username and API key

#### 3. Cloudinary (Storage)
1. Visit https://cloudinary.com/
2. Sign up for free account
3. Go to Dashboard
4. Copy Cloud Name, API Key, API Secret
5. Free tier: 25GB storage, 25GB bandwidth

---

## Feature Implementation Status

### Security & Authentication
- [x] JWT verification with signature checking
- [x] Password complexity requirements
- [x] Rate limiting on login
- [x] Permission system utilities
- [x] Session management (logout, clear tokens)
- [ ] Refresh token mechanism
- [ ] Password reset flow
- [ ] Two-factor authentication

### Student Management
- [x] CRUD operations for students
- [x] Class assignments
- [x] Student status tracking
- [ ] Student portal login
- [ ] Student result viewing
- [ ] Student password management
- [ ] Bulk student import from CSV/Excel

### Guardian Management
- [ ] CRUD operations for guardians
- [ ] Link guardians to students
- [ ] Primary contact designation
- [ ] Emergency contact management
- [ ] Guardian portal access

### Academic Management
- [x] Grade entry (add/delete)
- [x] Grade edit functionality
- [x] Subject management
- [x] Class management
- [ ] Attendance tracking
- [ ] Timetable management
- [ ] Assignment submissions
- [ ] Grade weighting & GPA calculation

### Reports & Analytics
- [ ] Real dashboard analytics (replace mock data)
- [ ] PDF export for student results
- [ ] Excel export for grades
- [ ] Attendance reports
- [ ] Payment reports
- [ ] Performance analytics

### Communication
- [x] Announcement system
- [ ] Email notifications integration
- [ ] SMS notifications integration
- [ ] Real-time notifications (SSE)
- [ ] Read receipts
- [ ] Parent-teacher messaging

### Audit & Compliance
- [ ] Audit log implementation
- [ ] Track all CRUD operations
- [ ] User action history
- [ ] IP address logging
- [ ] GDPR compliance features

---

## API Services Setup

### Email Service Usage

```typescript
// In any remote function or server code
import { send_grade_notification_email } from "$lib/services/email";

export const add_grade = form(grade_schema, async (parsed) => {
  // ... create grade

  // Send notification
  await send_grade_notification_email(
    guardian_email,
    student_name,
    subject_name,
    parsed.actual_score,
    parsed.max_score
  );
});
```

### SMS Service Usage

```typescript
import { send_absence_alert_sms } from "$lib/services/sms";

export const mark_attendance = form(attendance_schema, async (parsed) => {
  // ... mark attendance

  if (parsed.status === "absent") {
    await send_absence_alert_sms(
      guardian_phone,
      student_name,
      parsed.date
    );
  }
});
```

### Cloud Storage Usage

```typescript
import { upload_avatar } from "$lib/services/storage";

export const update_avatar = form(avatar_schema, async (parsed) => {
  // Upload to Cloudinary
  const result = await upload_avatar(parsed.file, user.id);

  if (result.success) {
    // Save URL to database
    await database.update_student(user.id, {
      avatar_url: result.url
    });
  }
});
```

---

## Database Query Patterns

All database methods follow this pattern:

```typescript
export async function get_entity(id: string) {
  try {
    const entity = await db.query.entity_table.findFirst({
      where: eq(entity_table.id, id),
    });

    return { success: true, data: entity };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Failed to get entity" };
  }
}

export async function create_entity(data: typeof entity_table.$inferInsert) {
  try {
    const [entity] = await db.insert(entity_table).values(data).returning();
    return { success: true, data: entity };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Failed to create entity" };
  }
}
```

### Implementing New Query Methods

**Example: guardians.ts**

```typescript
import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { guardians_table, students_table } from "../schema";

export async function get_guardians_by_student(student_id: string) {
  try {
    const guardians = await db.query.guardians_table.findMany({
      where: eq(guardians_table.student_id, student_id),
    });

    return { success: true, data: guardians };
  } catch (error) {
    console.error("Error getting guardians:", error);
    return { success: false, message: "Failed to get guardians" };
  }
}

export async function create_guardian(data: typeof guardians_table.$inferInsert) {
  try {
    const [guardian] = await db.insert(guardians_table).values(data).returning();
    return { success: true, data: guardian };
  } catch (error) {
    console.error("Error creating guardian:", error);
    return { success: false, message: "Failed to create guardian" };
  }
}

// Add update and delete methods...
```

---

## Authentication Flows

### Staff Authentication (Current)

1. User submits email + password
2. Check rate limit by IP
3. Query database for staff by email
4. Compare password with bcrypt
5. Generate JWT with user data
6. Set secure HTTP-only cookie
7. Redirect to dashboard

### Student Authentication (To Implement)

1. Student submits admission_number + password
2. Check rate limit
3. Query database for student by admission_number
4. Compare password with bcrypt
5. Generate student JWT
6. Set student cookie
7. Redirect to student portal

**Files to create:**
- `src/lib/student-auth.ts`
- `src/routes/(student-portal)/login/+page.svelte`

---

## File Upload & Storage

### Current Flow

1. **Upload to local filesystem** (`src/lib/upload.ts`)
2. **Process with Sharp** (resize, optimize)
3. **Save to static directory**

### Recommended Flow (With Cloudinary)

1. **Validate file** (`src/lib/file-validation.ts`)
2. **Upload to Cloudinary** (`src/lib/services/storage.ts`)
3. **Get CDN URL**
4. **Save URL to database**

### Migration Path

```typescript
// Before
const file_path = await save_locally(file);

// After
const result = await upload_avatar(file, user.id);
if (result.success) {
  const avatar_url = result.url; // CDN URL
}
```

---

## Testing & Deployment

### Local Development

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:push

# Seed database (optional)
npm run db:seed

# Start dev server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# The build outputs to ./build/

# Start production server
npm start
```

### Database Backup (Using Litestream)

Since you mentioned using Litestream:

```bash
# Install Litestream
# https://litestream.io/install/

# Configure litestream.yml
replicas:
  - url: s3://your-bucket/caelum.db

# Run with Litestream
litestream replicate caelum.db
```

### Environment-Specific Configs

```bash
# Development
NODE_ENV=development npm run dev

# Production
NODE_ENV=production npm start
```

---

## Quick Reference

### Key Files

| Purpose | File Path |
|---------|-----------|
| Auth utilities | `src/lib/auth.ts` |
| Rate limiting | `src/lib/rate-limit.ts` |
| HTML sanitization | `src/lib/sanitize.ts` |
| File validation | `src/lib/file-validation.ts` |
| Email service | `src/lib/services/email.ts` |
| SMS service | `src/lib/services/sms.ts` |
| Cloud storage | `src/lib/services/storage.ts` |
| Database schema | `src/lib/server/database/schema.ts` |
| Database queries | `src/lib/server/database/queries/*.ts` |
| Validation schemas | `src/lib/schemas.ts` |

### Common Commands

```bash
# Database
npm run db:push          # Push schema changes
npm run db:studio        # Open Drizzle Studio
npm run db:seed          # Seed database

# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run format           # Format code
npm run check            # Type check
```

### Troubleshooting

**Issue:** JWT verification fails
**Solution:** Check JWT_SECRET in .env matches the one used to sign tokens

**Issue:** Rate limiting not working
**Solution:** Ensure client IP is being captured correctly from headers

**Issue:** File uploads fail
**Solution:** Check file size limits and MIME type validations

**Issue:** Cloudinary uploads fail
**Solution:** Verify API credentials in .env

**Issue:** Database migration fails
**Solution:** Backup database, drop conflicting indexes, retry

---

## Next Implementation Steps

1. **Run database migration** (see Database Migration section)
2. **Create query methods** for new tables
3. **Implement student authentication**
4. **Build student portal UI**
5. **Add PDF/Excel export**
6. **Implement audit logging**
7. **Replace mock dashboard data**
8. **Add bulk import functionality**
9. **Set up SSE for real-time notifications**
10. **Mobile responsiveness audit**

---

**For questions or issues:**
- Check RECOMMENDATIONS.md for full feature list
- Check TASKS.md for detailed task breakdown
- Refer to this guide for implementation details
