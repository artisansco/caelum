# Setup Guide

This guide will help you set up the Caelum school management system after the recent feature implementations.

## Step 1: Install Dependencies

All dependencies are already listed in `package.json`. They were added during implementation:

```bash
npm install
```

## Step 2: Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:

### Required Variables:
```env
JWT_SECRET="generate-a-random-secret-here"
```

**How to generate a secure JWT secret:**
```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Using openssl
openssl rand -hex 64
```

### Optional Service Variables:

**Email Service (Resend)** - For sending transactional emails
```env
RESEND_API_KEY="re_xxxxxxxxxxxxx"
```
- Sign up at: https://resend.com
- Get API key from Dashboard > API Keys

**SMS Service (Africa's Talking)** - For SMS notifications
```env
AFRICAS_TALKING_API_KEY="your-api-key"
AFRICAS_TALKING_USERNAME="your-username"
```
- Sign up at: https://africastalking.com
- Get credentials from Dashboard

**Cloud Storage (Cloudinary)** - For file uploads
```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```
- Sign up at: https://cloudinary.com
- Get credentials from Dashboard > Account Details

**Note:** The system will work without these optional services, but with limited functionality:
- Without Resend: Email features will be disabled
- Without Africa's Talking: SMS features will be disabled
- Without Cloudinary: File uploads will use local storage

## Step 3: Database Migration

**CRITICAL STEP:** Run the database migration to create new tables:

```bash
npm run db:push
```

When prompted with:
```
? Do you want to execute these statements on the database? (y/n)
```

Type `y` and press Enter to confirm.

**What this does:**
- Creates 6 new tables: guardians, attendance, timetable, assignment_submissions, audit_logs, notifications
- Adds password field to students table for student portal authentication
- All existing data will be preserved

## Step 4: Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at: http://localhost:5173

## Step 5: Seed the Database (Optional)

If you want to test with sample data:

```bash
npm run seed
```

This will create:
- Sample schools
- Test students and staff
- Classes and subjects
- Sample grades

## Step 6: Test New Features

### Test Student Portal:
1. Create a student through the admin dashboard
2. Set a password for the student (you'll need to update this manually in the database for now)
3. Login at: http://localhost:5173/student/login
4. Test PDF/Excel export from the student portal

### Test CSV Import:
1. Navigate to Imports section
2. Download the CSV template
3. Fill in student/staff data
4. Upload and preview
5. Import the data

### Test Real-Time Notifications:
1. Open the dashboard in two browser tabs
2. Create an announcement in one tab
3. The notification should appear in the other tab automatically

## Step 7: Production Setup

Before deploying to production:

1. **Change JWT_SECRET** to a secure random string
2. **Set NODE_ENV=production**
3. **Configure backup** using litestream (as mentioned by user)
4. **Set up HTTPS** for secure connections
5. **Configure rate limiting** thresholds if needed
6. **Set up monitoring** for errors and performance

## Troubleshooting

### Database Migration Fails:
```bash
# If migration fails, try resetting:
rm caelum.db
npm run db:push
npm run seed
```

### Permission Errors:
Ensure the application has write permissions to:
- `caelum.db` (SQLite database file)
- `uploads/` directory (for local file storage)

### SSE Not Working:
- Check browser console for connection errors
- Ensure cookies are enabled
- Check if rate limiting is blocking requests

## Next Steps

1. Review IMPLEMENTATION_GUIDE.md for detailed feature documentation
2. Check RECOMMENDATIONS.md for future improvements
3. Review TASKS.md for remaining optional features
4. Set up API service accounts (Resend, Cloudinary, etc.)
5. Configure school-specific settings in the admin dashboard
