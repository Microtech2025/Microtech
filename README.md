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

# 💻 Micro Computers

**Micro Computers** is a trusted computer dealership and service hub located in **Perambra, Kozhikode, Kerala**, operating under the **Micro Tech Center** group.  
We specialize in providing complete hardware, software, and technical solutions — from PC sales and servicing to networking, upgrades, and institutional support.

---

## 🧩 PC Sales & Custom Builds
We provide systems for every need — from student use to high-performance workstations.

- Custom-built PCs (Gaming, Editing, Design, Office)
- Branded Desktops & Laptops (HP, Dell, Lenovo, Asus, Acer)
- Refurbished systems
- Configuration & performance consultations

---

## ⚙️ Computer Components & Accessories
All major **PC parts and peripherals** available with installation support.

- Processors, Motherboards, RAM, SSDs, Power Supplies
- Graphics Cards, Cabinets, Monitors
- Keyboards, Mice, Headsets, Webcams, UPS, etc.

---

## 🔧 PC Service & Repairs
Professional repair and maintenance for all systems.

- Hardware & software troubleshooting
- OS installation, driver updates
- Virus removal, data backup
- Cleaning & performance tuning

---

## 🧰 Networking & System Setup
End-to-end **network solutions** for homes and offices.

- LAN/Wi-Fi installation and configuration
- Router, switch, and printer setup
- Network diagnostics and optimization

---

## 🏢 Institutional & Corporate Services
IT solutions designed for **schools, offices, and training centers**.

- Bulk computer setup for labs/classrooms
- Annual Maintenance Contracts (AMC)
- Institutional hardware supply
- On-site technical support

---

## 💽 Software Solutions
Licensed and educational software packages with installation support.

- Windows, MS Office, Adobe Suite, AutoCAD, Antivirus, etc.
- Educational and institutional licensing assistance

---

## 🖨️ Printing & Peripheral Solutions
All-in-one **printing and scanning services**.

- Printer sales & setup (Laser, Inkjet, All-in-One)
- Toner & cartridge refilling
- Scanners, copiers, maintenance

---

## 💡 Upgrades & Optimization
Upgrade your system for better performance.

- SSD & RAM upgrades
- GPU/CPU replacements
- OS optimization & cleanup

---

## ☁️ Data Recovery & Backup
Reliable data protection and recovery.

- Recovery from formatted/corrupted drives
- Cloud and local backup setup

---

## 🏆 Why Choose Micro Computers
- ✅ Trusted by hundreds of satisfied customers
- 🔧 Experienced technicians
- 💰 Affordable & transparent pricing
- ⚡ Fast service turnaround
- 🤝 Personalized customer support

---

## 📞 Contact Us

**📍 Address:** Perambra, Kozhikode, Kerala  
**📧 Email:** [microtechcenter@gmail.com](mailto:microtechcenter@gmail.com)  
**📞 Phone:** 9447332451  
**🌐 Part of:** Micro Tech Center

---

> “From everyday computing to advanced performance builds — Micro Computers delivers trusted technology with care.”

---

© 2025 Micro Computers. All Rights Reserved.
