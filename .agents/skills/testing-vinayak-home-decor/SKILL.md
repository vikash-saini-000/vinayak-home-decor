---
name: testing-vinayak-home-decor
description: End-to-end testing of the Vinayak Home Decor MERN luxury furniture website. Use when verifying frontend customer journey, admin dashboard, or API changes.
---

# Testing Vinayak Home Decor

## Environment Setup

1. **Start MongoDB** (local instance for testing):
   ```bash
   mongod --dbdir /home/ubuntu/mongo-data --port 27017 &
   ```

2. **Seed admin user** (required for admin dashboard access):
   ```bash
   cd /home/ubuntu/repos/vinayak-home-decor/backend
   node -e "
   import('mongoose').then(m => m.default.connect('mongodb://localhost:27017/vinayak-home-decor'))
   .then(() => import('bcryptjs'))
   .then(b => b.default.hash('admin123', 10))
   .then(hash => import('./models/User.js').then(U => U.default.findOneAndUpdate(
     { email: 'admin@vinayakhomedecor.com' },
     { name: 'Admin', email: 'admin@vinayakhomedecor.com', password: hash },
     { upsert: true, new: true }
   )))
   .then(() => { console.log('Admin seeded'); process.exit(0); })
   .catch(e => { console.error(e); process.exit(1); });
   "
   ```

3. **Start backend**:
   ```bash
   cd /home/ubuntu/repos/vinayak-home-decor/backend
   MONGODB_URI=mongodb://localhost:27017/vinayak-home-decor JWT_SECRET=test-secret-key PORT=5000 node server.js &
   ```

4. **Start frontend**:
   ```bash
   cd /home/ubuntu/repos/vinayak-home-decor/frontend
   npm run dev &
   ```

5. Frontend runs on `localhost:5173`, backend on `localhost:5000`.

## Admin Credentials

- Email: `admin@vinayakhomedecor.com`
- Password: `admin123`
- Login path: `/admin`
- Dashboard path: `/admin/dashboard`

## Key Test Flows

### 1. Product Lifecycle
- Admin: Products tab → Add Product → fill all fields (title, description, category, price, material, dimensions, featured toggle, image upload) → Create
- Verify: Toast "Product created" (NOT a browser alert)
- Public: `/collections` → product card visible → click to `/product/:id` → verify material & dimensions fields render

### 2. Inquiry CRM
- Public: `/contact` → fill name, email, phone, message → Submit
- Verify: Success message "Thank you! Your inquiry has been submitted successfully."
- Admin: Inquiries tab → verify inquiry with "NEW" badge → change status via dropdown (New/Contacted/Negotiating/Closed) → verify toast

### 3. Website Settings
- Admin: Site Settings tab → change WhatsApp number → Update Settings
- Verify: Toast "Settings updated"
- Public: Navigate to any page → scroll down → floating WhatsApp button href should contain updated number

### 4. Dashboard Overview
- Admin: Overview tab → verify stats cards match actual DB counts (products, inquiries, reviews, gallery)
- Verify status breakdown counts and recent items lists

### 5. Collections Search & Filter
- Public: `/collections` → type in search bar → verify filtered results
- Click category tabs → verify products filter by category
- Sort dropdown works (newest, price low/high, name A-Z)

### 6. Floating WhatsApp Button
- Appears after scrolling 300px on any public page
- Uses WhatsApp number from admin settings (fetched via API)

## Known Gotchas

- **Stale server**: If material/dimensions fields aren't saving, the backend might be running old code. Kill with `pkill -f "node.*server.js"` and restart.
- **Image upload via browser testing**: Use JavaScript `DataTransfer` API to programmatically set files on the hidden file input, since drag-and-drop is hard to automate.
- **Browser alerts**: Some older code paths might use `window.alert()`. Current code uses toast notifications — if you see alerts, the wrong server version may be running.
- **Demo fallback**: Frontend gracefully falls back to demo data if API is unreachable. When testing with real backend, ensure the backend is actually running or you'll only see demo content.
- **Image uploads use local multer storage** (not Cloudinary). Images are stored in `backend/public/uploads/` and served at `/uploads/filename.jpg`.
- The loading screen animation takes ~2-3 seconds on each page navigation.
- Vite dev server on port 5173 proxies `/api` to `http://localhost:5000` and `/uploads` to `http://localhost:5000`.

## Devin Secrets Needed

None — testing uses local MongoDB with no external dependencies.
