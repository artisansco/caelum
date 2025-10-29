# Implementation Plan: Freemium School Management System

## Phase 1: Foundation & Feature Audit (Week 1-2)

### 1.1 Database Schema Updates
- Add `subscription_tier` enum to schools table: 'free', 'standard', 'pro'
- Add `subscription_status`: 'active', 'expired', 'cancelled', 'trial'
- Add `subscription_expires_at` timestamp
- Add `storage_used` (bytes) to track file uploads
- Add `sms_quota_used` and `sms_quota_limit` fields
- Add `referral_code` (unique per school) - generated on signup
- Add `referred_by` (references another school's referral_code)
- Add `referral_credits` (months earned from successful referrals)
- Create `subscriptions` table with payment history
- Create `feature_usage` table to track usage metrics
- Create `referrals` table to track referral conversions

### 1.2 Feature Access Control System
- Create middleware/helper to check feature access by tier
- Map out every feature in the app and assign tier requirements
- Create `features.ts` config file defining tier capabilities:
  - Free: core CRUD, browser reports, CSV exports
  - Standard: file uploads (5GB), PDF generation, bulk imports, branding
  - Pro: SMS (150/month), email, extended storage (20GB), automation

### 1.3 Audit Current Codebase
- List all existing features and their current access levels
- Identify which features need gating
- Identify which features cost money (Cloudinary, SMS, email)
- Document technical debt that might block implementation

---

## Phase 2: Core Feature Gating (Week 3-4)

### 2.1 File Upload Restrictions
- Add tier check before Cloudinary upload endpoints
- Create upload quota tracking (per school)
- Show storage usage in school dashboard
- Block uploads for free tier with upgrade prompt
- Implement storage limits: Standard (5GB), Pro (20GB)

### 2.2 PDF Generation Gating
- Gate PDF report card generation routes
- Free tier: show "Upgrade to download PDF" message
- Free tier alternative: print from browser (HTML view)
- Track PDF generation count if using external service

### 2.3 Bulk Import Gating
- Block CSV bulk import for free tier
- Show manual entry option + upgrade prompt
- Standard+ can import students, teachers, grades, attendance

### 2.4 SMS/Email Gating
- Block SMS notification endpoints for free/standard tiers
- Block email notifications for free/standard tiers
- Add SMS quota tracking for Pro tier
- Show usage meter: "75/150 SMS used this month"

### 2.5 Parent Portal Gating
- Free tier: block parent portal routes entirely
- Standard+: parent can view data only
- Pro: parents receive SMS/email notifications

---

## Phase 3: Subscription Management UI (Week 5-6)

### 3.1 Billing/Subscription Page
- Create `/[school_id]/subscription` route
- Show current tier and features included
- Show usage metrics: storage used, SMS used, etc.
- Display "days remaining" for paid subscriptions
- Show payment history
- Display unique referral code with share buttons
- Show referral credits earned: "You have 2 free months from referrals"
- Show referrals made and their status (pending/converted)

### 3.2 Pricing Page
- Create public `/pricing` page
- 3-tier comparison table (Free, Standard, Pro)
- Highlight cost-based features (storage, SMS)
- Monthly vs Annual toggle (20% discount for annual)
- Clear CTA buttons
- Referral program explanation: "Get 1 free month for each paying school you refer"

### 3.3 Upgrade Flows
- In-app upgrade prompts when hitting tier limits
- "Upgrade to unlock" modals throughout app
- One-click upgrade buttons (redirect to payment)
- Trial period option: 14-day Pro trial for new schools
- Referral code input field on upgrade page (optional)
- Validate referral code before payment
- Apply referral bonus to referring school after successful payment

### 3.4 Downgrade/Cancellation Flows
- Self-service downgrade option (or just let subscription expire)
- Warning about losing access to features
- Export data before downgrade reminder
- Retain data but block access to paid features
- Keep referral credits for future use

---

## Phase 4: Payment Integration (Week 7-8)

### 4.1 Mobile Money Integration (Critical for SL)
- Research Africa's Talking payment API vs alternatives
- Orange Money Sierra Leone integration
- Africell Money integration
- Test mobile money payment flow in sandbox
- Handle payment callbacks/webhooks

### 4.2 Alternative Payment Methods
- Card payments (Stripe/Flutterwave) for international/diaspora
- Bank transfer instructions (manual verification)
- Cash payment tracking (offline schools)

### 4.3 Payment Flow Implementation
- Checkout page with tier selection
- Duration selection: 1 month, 3 months, 6 months, 12 months (discounts for longer)
- Referral code input field (optional)
- Payment method selection
- Success/failure pages
- Email receipt via Resend
- Update subscription status on successful payment
- Set `subscription_expires_at` based on duration paid
- If referral code used: add 1 month to referring school's `subscription_expires_at`
- Track referral conversion in referrals table

### 4.4 Subscription Lifecycle Management
- **Manual renewal system** (no auto-charge):
  - Cron job: check expired subscriptions daily
  - Email reminders: 7 days before expiry, 3 days before, at expiry, 3 days after
  - SMS reminder: 1 day before expiry (if Pro tier)
  - Grace period: 3 days after expiration (paid features still work)
  - Auto-downgrade to free after grace period
  - Schools must manually pay via mobile money to renew
  - Keep all data when downgrading, just block paid features
- Track payment history for each school
- Show renewal link in reminders

---

## Phase 5: Referral System (Week 9)

### 5.1 Referral Code Generation
- Generate unique referral code on school signup (8-char alphanumeric)
- Store in `referral_code` column
- Make referral code shareable from dashboard

### 5.2 Referral Tracking
- Accept referral code during signup (optional)
- Store in `referred_by` column
- Mark referral as "pending" until referred school makes first payment
- When referred school pays for Standard/Pro:
  - Mark referral as "converted"
  - Add 1 month to referring school's `subscription_expires_at`
  - Send notification to referring school: "You earned 1 free month!"
  - Track in referral_credits counter

### 5.3 Referral Dashboard
- Show referral stats:
  - Total schools referred
  - Pending referrals (signed up but not paid)
  - Converted referrals (paid)
  - Total free months earned
- Share options: WhatsApp, copy link, QR code
- Referral leaderboard (optional): top referrers get recognition

### 5.4 Referral Rules
- Bonus only applies when referred school pays for Standard or Pro
- Free tier signups don't count as conversions
- 1 free month per converted referral (extends current subscription)
- If on free tier and earn referral credit: can activate Standard for free month
- Referral credits don't expire
- No limit on referrals

---

## Phase 6: Usage Tracking & Limits (Week 10)

### 6.1 Storage Monitoring
- Calculate total storage per school (sum of file sizes)
- Block new uploads when quota exceeded
- Background job: cleanup deleted files from Cloudinary
- Admin dashboard: see storage usage across all schools

### 6.2 SMS Quota System
- Reset SMS quota monthly (on subscription anniversary or calendar month)
- Track sends per school per month
- Block SMS when quota exceeded (Pro tier)
- Option to buy SMS add-ons: $5/100 messages

### 6.3 Rate Limiting
- Prevent abuse on free tier (API rate limits)
- Stricter limits for free, relaxed for paid
- Block suspicious activity (mass signups, etc.)

---

## Phase 7: Admin Tools & Analytics (Week 11)

### 7.1 Admin Dashboard
- See all schools with their tier status
- MRR (Monthly Recurring Revenue) calculation
- Churn tracking (downgrades/cancellations)
- Usage analytics: most-used features by tier
- Schools approaching storage limits
- Payment issues flagged
- Referral analytics: conversion rates, top referrers
- Schools expiring soon (need renewal reminders)

### 7.2 School Analytics (for school admins)
- Feature usage heatmap: what do teachers use most
- Cost savings calculator: "PDF generation saved X hours"
- ROI metrics to justify upgrade

### 7.3 Manual Overrides
- Grant custom tiers/quotas for special cases
- Extend trial periods
- Manually extend subscription dates
- Refund/credit management
- Manually mark payments (for cash/bank transfers)
- Grant referral credits manually

---

## Phase 8: User Experience Polish (Week 12)

### 8.1 Onboarding Improvements
- Clear tier selection during school signup
- Free tier as default
- Referral code input field during signup (optional)
- Highlight what they get free vs paid
- Success email: welcome + feature overview + unique referral code

### 8.2 Contextual Upgrade Prompts
- When teacher tries to upload assignment → "Upgrade to Standard for $10/month"
- When generating 50+ PDFs → "This would be instant on Standard"
- When manually entering 200 students → "Import instantly on Standard"
- When parent asks for updates → "Enable SMS on Pro for $30/month"
- Show referral code option on upgrade prompts

### 8.3 Upgrade Incentives
- Limited-time offer: "First month 50% off"
- Referral program: free month for each paying school referred
- Annual discount: 2 months free (10 months price for 12 months)
- School association bulk deal: 20% off for 10+ schools

---

## Phase 9: Testing & Launch Prep (Week 13)

### 9.1 Test All Tiers
- Create test schools for each tier
- Test feature access enforcement
- Test upgrade/downgrade flows
- Test payment integration end-to-end
- Test expiration and manual renewal
- Test referral code generation and tracking
- Test referral bonus application

### 9.2 Edge Cases
- What happens when school downgrades with uploaded files?
  - Keep files but block access until upgrade
- What happens to SMS quota mid-month on downgrade?
  - Lose access immediately on downgrade
- Partial month refunds?
  - No refunds, subscription runs until expiry date
- Failed payment retry logic
  - School stays on current tier until expiry
- Referral code used by self
  - Block self-referrals
- Referral bonus when referring school is on free tier
  - Activate Standard for 1 free month

### 9.3 Documentation
- Help docs for each tier
- FAQ: payments, mobile money, upgrades, referrals
- Video tutorials: how to upgrade, payment methods, share referral code
- Support docs for common issues

---

## Phase 10: Soft Launch & Iteration (Week 14-16)

### 10.1 Beta Testing
- Invite 5-10 friendly schools to test
- Start everyone on Pro trial (14 days)
- Give each a referral code, encourage sharing
- Gather feedback on pricing
- Test payment flow with real money (small amounts)
- Test referral system with real referrals

### 10.2 Pricing Validation
- Are schools willing to pay $10/$30?
- Do they see value in tiered features?
- Is referral incentive motivating?
- Adjust pricing/features based on feedback
- Test messaging: "costs money to run" vs "premium features"

### 10.3 Marketing Prep
- Landing page updates with pricing
- Referral program landing page
- Social media posts for SL school groups
- WhatsApp marketing to headteachers with referral incentive
- School association partnerships

---

## Phase 11: Full Launch & Growth (Month 5+)

### 11.1 Public Launch
- Announce freemium model
- Free tier marketing: "Always free for basic features"
- Referral program marketing: "Get paid schools to join, earn free months"
- Target 50 free schools in first 3 months
- Target 5-10 paid schools in first 6 months

### 11.2 Growth Tactics
- Free school success stories
- Testimonials from paid schools
- Feature requests from paid users (priority)
- Community building: SL education tech group
- Referral contests: most referrals win prize
- Early adopter recognition

### 11.3 Optimization
- Track conversion rate: free → paid
- Track referral conversion rate
- A/B test pricing ($10 vs $12 for Standard)
- A/B test upgrade prompts
- Optimize for annual subscriptions (better cash flow)
- Optimize referral messaging

---

## Cron Job Implementation Details (Node.js)

### System Architecture

**Approach:** In-process cron jobs using `node-cron` library

**Why this approach:**
- SQLite is local (not serverless-friendly)
- Simple deployment on AWS EC2/Lightsail/ECS
- No extra infrastructure needed
- Starts automatically with app
- Works perfectly with SQLite + Litestream

### File Structure

```
src/lib/server/cron/
├── scheduler.ts                    # Main scheduler & job initialization
└── tasks/
    ├── subscriptions.ts           # Check expired subscriptions
    ├── reminders.ts               # Send renewal reminders
    └── sms.ts                     # Reset SMS quotas
```

### Cron Schedules

1. **check_expired_subscriptions** - `0 9 * * *` (Daily at 9 AM)
   - Finds schools past 3-day grace period
   - Downgrades to free tier
   - Logs results to cron_runs_table

2. **send_renewal_reminders** - `0 8 * * *` (Daily at 8 AM)
   - 7 days before expiry
   - 3 days before expiry
   - At expiry (grace period starts)
   - 3 days after expiry (final reminder)

3. **reset_sms_quotas** - `0 0 1 * *` (Monthly on 1st at midnight)
   - Resets SMS quota for all Pro tier schools

### Initialization

Cron jobs initialize in `src/hooks.server.ts` when server starts:

```typescript
import { initialize_cron_jobs, stop_cron_jobs } from "$lib/server/cron/scheduler";

// Initialize on startup
initialize_cron_jobs();

// Graceful shutdown
process.on("SIGTERM", stop_cron_jobs);
process.on("SIGINT", stop_cron_jobs);
```

### Monitoring & Logging

All cron job runs are tracked in `cron_runs_table`:
- job_name
- status (started/completed/failed)
- details (JSON with results/errors)
- timestamps

### Manual Triggering (Testing)

```typescript
import { trigger_cron_job } from "$lib/server/cron/scheduler";

// Manually run a job
await trigger_cron_job("check_expired_subscriptions");
```

### Production Deployment

**AWS EC2/Lightsail:**
- Cron jobs start with app (no extra setup)
- Use PM2 for process management
- Monitor logs: `pm2 logs`

**Docker:**
```dockerfile
# Cron jobs start automatically with Node.js process
CMD ["node", "build/index.js"]
```

**Failover:**
- If app restarts, cron jobs reinitialize
- Check `cron_runs_table` for missed runs
- Can manually trigger if needed

---

## Technical Dependencies Needed

**Before starting:**
1. ✅ Vercel deployment working
2. ✅ SQLite + Litestream backup configured
3. ✅ Cloudinary account + API keys
4. ✅ node-cron installed (in-process cron jobs)
5. ⚠️ Africa's Talking account (SMS + payments)
6. ⚠️ Resend email configured
7. ⚠️ Mobile money merchant accounts (Orange/Africell)

---

## Risk Mitigation

**Payment integration complexity:**
- Start with manual payment verification if API integration takes long
- Schools pay via mobile money, WhatsApp screenshot, you verify and activate

**Mobile money issues:**
- Have backup: bank transfer + manual activation
- Clear instructions with screenshots

**Free tier abuse:**
- Require phone verification for signup
- Rate limit signups per IP
- Monitor for suspicious activity
- Validate referral codes to prevent gaming

**Churn management:**
- Exit surveys when letting subscription expire
- Win-back campaigns for expired schools
- Annual discounts to lock in longer commitments
- Referral incentives reduce churn (social pressure)

**Referral fraud:**
- Block self-referrals
- Require referred school to make payment before bonus
- Monitor for suspicious referral patterns
- Limit referral bonuses if abuse detected

---

## Success Metrics to Track

- Free schools signed up
- Free → Paid conversion rate
- MRR (Monthly Recurring Revenue)
- Churn rate (expired subscriptions not renewed)
- Average revenue per school
- Storage costs vs revenue
- SMS costs vs Pro revenue
- Most common upgrade triggers
- Time to first payment
- Referral metrics:
  - Referral signups (pending)
  - Referral conversions (paid)
  - Referral conversion rate
  - Average referrals per school
  - Free months given via referrals
  - Viral coefficient (referrals per paying customer)

---

## Timeline Summary

- **Weeks 1-2**: Foundation (DB schema, feature mapping)
- **Weeks 3-4**: Feature gating implementation
- **Weeks 5-6**: Subscription UI
- **Weeks 7-8**: Payment integration (mobile money)
- **Weeks 9**: Referral system implementation
- **Weeks 10**: Usage tracking + limits
- **Weeks 11**: Admin tools + analytics
- **Weeks 12**: UX polish
- **Weeks 13**: Testing
- **Weeks 14-16**: Soft launch + iteration
- **Month 5+**: Full launch + growth

**Realistic timeline**: 3-4 months to launch with basic freemium + referral system, then iterate based on real school feedback.

---

## Subscription & Renewal Flow (Manual Payments)

### How It Works:
1. School signs up (free tier by default)
2. School upgrades by choosing tier + duration (1/3/6/12 months)
3. School pays via mobile money (Orange/Africell)
4. Payment confirmed → `subscription_expires_at` set
5. 7 days before expiry: email reminder to renew
6. 3 days before expiry: email + SMS reminder
7. On expiry: email reminder (grace period starts)
8. 3 days after expiry: final email reminder
9. After grace period: auto-downgrade to free tier
10. School can renew anytime by paying again

### No Auto-Renewal:
- Schools must manually pay each time
- No saved payment methods
- No automatic charges
- Clear expiry dates shown in dashboard
- Multiple reminder emails/SMS before expiry

### Referral Flow:
1. School A shares referral code with School B
2. School B signs up using School A's code
3. School B pays for Standard/Pro
4. School A's `subscription_expires_at` extended by 1 month
5. School A notified: "You earned 1 free month from referring School B!"
6. If School A is on free tier: activate Standard for 1 month automatically

---

## Key Business Rules

### Tier Features:
- **Free**: No file uploads, no SMS/email, no PDF downloads, no bulk imports
- **Standard**: File uploads (5GB), PDF generation, bulk imports, parent portal (view-only)
- **Pro**: Everything + SMS (150/month), email notifications, 20GB storage

### Pricing:
- **Standard**: $10/month or $100/year (2 months free)
- **Pro**: $30/month or $300/year (2 months free)

### Referral Rewards:
- 1 free month per converted referral
- Extends current subscription expiry date
- If on free tier: activates Standard for 1 month
- No limit on referrals
- Only applies when referred school pays (not free signups)

### Storage Limits:
- Free: 0GB (no uploads)
- Standard: 5GB
- Pro: 20GB

### SMS Quotas:
- Free/Standard: 0 SMS
- Pro: 150 SMS/month
- Add-on: $5/100 extra SMS

### Grace Period:
- 3 days after expiry before downgrade
- Paid features still work during grace
- Multiple reminders sent

### Subscription Duration Options:
- 1 month
- 3 months (5% discount)
- 6 months (10% discount)
- 12 months (20% discount = 2 months free)
