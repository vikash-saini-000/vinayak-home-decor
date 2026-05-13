---
name: testing-vinayak-home-decor
description: Test the Vinayak Home Decor MERN stack app end-to-end. Use when verifying frontend UI, backend API, admin dashboard, or inquiry/testimonial/contact flows.
---

# Testing Vinayak Home Decor

## Prerequisites

- MongoDB must be running locally (or provide a MongoDB Atlas URI)
- Node.js installed
- No Cloudinary credentials needed for basic CRUD testing (only needed for image uploads)

## Environment Setup

1. **Install MongoDB locally** (if not available):
   ```bash
   curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
   echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
   sudo apt-get update -qq && sudo apt-get install -y -qq mongodb-org
   ```

2. **Start MongoDB**:
   ```bash
   sudo mkdir -p /data/db && sudo chown mongodb:mongodb /data/db
   sudo mongod --dbpath /data/db --fork --logpath /var/log/mongod.log
   ```

3. **Create backend `.env`**:
   ```bash
   cat > backend/.env << 'EOF'
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vinayak-home-decor
   JWT_SECRET=test_jwt_secret_for_local_dev_12345
   CLOUDINARY_CLOUD_NAME=placeholder
   CLOUDINARY_API_KEY=placeholder
   CLOUDINARY_API_SECRET=placeholder
   ADMIN_EMAIL=admin@vinayakhomedecor.com
   ADMIN_PASSWORD=admin123
   EOF
   ```

4. **Install dependencies and start servers**:
   ```bash
   cd backend && npm install && npm run dev &
   cd frontend && npm install && npm run dev &
   ```

5. **Verify**: Backend prints "MongoDB Connected: localhost" and "Admin user created". Frontend runs on port 5173 with proxy to port 5000.

## Default Admin Credentials

- Email: `admin@vinayakhomedecor.com`
- Password: `admin123`
- Admin login page: `/admin`
- Admin dashboard: `/admin/dashboard`

## Key Test Flows

### 1. Contact Form Inquiry (Public → DB → Admin)
- Navigate to `/contact`
- Fill name, email, phone, message
- Click "Send Inquiry"
- Expected: green success message, form fields clear
- Verify in admin: `/admin/dashboard` → Inquiries tab shows the inquiry with "NEW" badge

### 2. Admin Login
- Navigate to `/admin`
- Enter admin credentials
- Expected: redirect to `/admin/dashboard` with 5 tabs (Products, Testimonials, Gallery, Inquiries, Contact)

### 3. Contact Info Update (Admin → Public)
- Admin dashboard → Contact tab
- Update phone/email/social links
- Click "Update Contact Info"
- Expected: alert "Contact info updated!"
- Verify: navigate to homepage, check footer shows updated values

### 4. Testimonial CRUD (Admin → Public)
- Admin dashboard → Testimonials tab → "Add Testimonial"
- Fill name, role, text, select star rating (no photo needed)
- Click "Create"
- Expected: modal closes, testimonial appears in admin list
- Verify: navigate to homepage, scroll to testimonials section, see the new testimonial in carousel

### 5. Inquiry Management
- Admin dashboard → Inquiries tab
- Click eye icon to mark as read → "NEW" badge disappears, unread count decrements
- Click trash icon to delete

## Known Limitations

- **Image uploads require real Cloudinary credentials** — product creation, gallery upload, and testimonial photo upload will fail with placeholder credentials
- **Product CRUD cannot be tested without Cloudinary** since images are mandatory for products
- The frontend uses a **demo fallback pattern**: if the API is unreachable, sections show hardcoded demo data instead
- The loading screen animation takes ~2-3 seconds on each page navigation
- The "Update Contact Info" button triggers a browser `alert()` dialog which may block automated tools — dismiss it to continue

## Frontend Architecture Notes

- Vite dev server on port 5173 proxies `/api` to `http://localhost:5000`
- All public sections (Products, Testimonials, Gallery, Contact) fetch from API with graceful demo fallback
- Admin routes are protected — JWT token stored in localStorage
- Cinematic loading screen appears on first visit and page transitions

## Devin Secrets Needed

- `MONGODB_URI` — MongoDB connection string (can use local MongoDB instead)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — only needed for image upload testing
