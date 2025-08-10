# Micro Tech Center Dashboard

A Firebase-powered role-based institutional management dashboard for Micro Tech Center.

## Setup

1. Serve the `public` directory (e.g., `firebase hosting` or any static server).
2. Fill in `public/src/firebase-config.js` with your Firebase project config values.
3. Create initial `users` documents for Admin/Counselor with fields:
   - `role`: one of `Admin`, `Counselor`
4. Open `/public/login.html` to sign in.

## Authentication
- Firebase Authentication (email/password) is used.
- Only `Admin` and `Counselor` roles are allowed initially.

## Firestore Structure (collections)
- `users` (doc id = auth uid)
  - `uid`, `email`, `displayName`, `role`, `createdAt`
- `students`
  - `studentId`, `name`, `phone`, `email`, `division`, `course`, `batch`, `joinDate`, `feesPaid`, `feesOutstanding`, `documents[]`, `createdAt`
- `staff`
  - `staffId`, `name`, `role`, `salary`, `paymentSchedule` (monthly|biweekly), `attendance[]`, `createdAt`
- `finance`
  - `date`, `type` (revenue|expense), `division`, `category` (fees|salaries|rent|utilities|ads|supplies|other), `amount`, `notes`, `createdAt`
- `fees`
  - `studentId`, `division`, `amount`, `method` (cash|card|UPI|online), `status` (Paid|Pending|Overdue), `forMonth`, `notes`, `date`, `createdAt`
- `fees_CAPT`, `fees_LBS`, `fees_Gama_Abacus`, `fees_Micro_Computers`, `fees_Other`
  - Mirrored entries from `fees` with `feeId`
- `ads`
  - `platform`, `start`, `end`, `budget`, `leads`, `createdAt`
- `alumni`
  - `name`, `email`, `phone`, `year`, `course`, `createdAt`
- `scholarships`
  - `title`, `discountPercent`, `expiry`, `appliedCount`, `notes`, `createdAt`
- `scholarshipApplications`
  - `scholarshipId`, `studentId`, `percent`, `appliedAt`
- `referrals`
  - `code`, `reward`, `uses`, `rewardPaid`, `createdAt`
- `notifications`
  - `name`, `channel` (email|whatsapp|push), `body`, `scheduleAt`, `createdAt`
- `documents`
  - `name`, `url`, `path`, `createdAt`
- `leads`
  - `name`, `phone`, `interest`, `division`, `source`, `createdAt`
- `courses` (optional)
  - Define course catalogs as needed

## Storage Structure
- `students/{studentId}/...` for per-student documents
- `documents/...` for general documents

## Pages
- Admin Dashboard: KPIs, charts, filters, backup export
- Students: CRUD, CSV import/export, document uploads
- Staff: CRUD, salary/schedule, attendance tracking
- Finance: revenue/expenses CRUD and export
- Fees: payments, receipts, WhatsApp/email links, division mirrors
- Marketing: campaigns, ROI, export
- Alumni: portal data CRUD
- Scholarships: CRUD and manual apply
- Referral: codes and rewards tracking
- Notifications: templates and schedule stubs
- Counselor: quick tools and leads
- Documents: general storage browser

## Exports
- CSV exports on most list pages; JSON backup from dashboard.

## Notes
- Real-time updates via Firestore snapshot listeners.
- Scheduling and actual sends for notifications require Cloud Functions or external integrations; current implementation provides manual send links.