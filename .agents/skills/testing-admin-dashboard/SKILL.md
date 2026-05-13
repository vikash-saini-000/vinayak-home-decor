---
name: testing-admin-dashboard
description: Test the Vinayak Home Decor admin dashboard end-to-end. Use when verifying product CRUD, gallery uploads, testimonial management, or image upload functionality.
---

# Testing Admin Dashboard

## Prerequisites

### Start Services

1. **MongoDB** — Start a local instance if not running:
   ```bash
   mongod --dbdir /tmp/mongodb-test --port 27017 --fork --logpath /tmp/mongod.log
   ```

2. **Backend** (port 5000):
   ```bash
   cd backend
   # Ensure .env has: MONGO_URI=mongodb://localhost:27017/vinayak, JWT_SECRET=<any-string>, ADMIN_EMAIL/ADMIN_PASSWORD
   npm run dev
   ```
   Verify: `curl http://localhost:5000/api/health` should return `{"status":"ok"}`

3. **Frontend** (port 5173):
   ```bash
   cd frontend
   npm run dev
   ```
   Note: Vite proxies `/api` and `/uploads` to localhost:5000.

4. **Seed admin user** — Login once to trigger seeding:
   ```bash
   curl -s -X POST http://localhost:5000/api/auth/login \
     -H 'Content-Type: application/json' \
     -d '{"email":"admin@vinayakhomedecor.com","password":"admin123"}'
   ```

### Devin Secrets Needed

No external secrets required — the app uses local MongoDB and local file storage for images.

## Test Images

Generate test images with Python PIL:
```python
from PIL import Image, ImageDraw
img = Image.new('RGB', (800, 600), color='#8B4513')
draw = ImageDraw.Draw(img)
draw.rectangle([100, 200, 700, 500], fill='#CD853F')
draw.text((300, 50), 'TEST IMAGE', fill='white')
img.save('/tmp/test_image.jpg')
```

## File Upload via Playwright

The admin forms use hidden `<input type="file">` elements inside drag-drop zones. Use Playwright CDP to set files:

```python
import asyncio
from playwright.async_api import async_playwright

async def upload_files(file_paths):
    async with async_playwright() as p:
        browser = await p.chromium.connect_over_cdp('http://localhost:29229')
        context = browser.contexts[0]
        page = context.pages[0]
        await page.wait_for_load_state('networkidle')
        file_input = await page.query_selector('input[type="file"]')
        if file_input:
            await file_input.set_input_files(file_paths)

asyncio.run(upload_files(['/tmp/test_image.jpg']))
```

**Important**: The Playwright execution context may be destroyed if the page navigates (e.g., loading animation). If you get `Execution context was destroyed` errors, wait for `networkidle` before interacting.

## Key Test Flows

### Product CRUD
1. Navigate to `/admin` → login → Products tab
2. Click "Add Product" → fill title, description, category (dropdown), price, toggle Featured
3. Upload images via Playwright `set_input_files`
4. Click "Create Product" → verify toast "Product created" (NOT browser alert)
5. Verify product card shows: title, category, price, Featured badge, "N photos" badge, image thumbnail
6. Navigate to public homepage → scroll to Featured Products → verify product appears with image
7. Delete product → confirm dialog → toast "Product deleted" → stat=0

### Gallery Upload
1. Gallery tab → "Upload Images" → fill title (optional), select category from dropdown
2. Upload images via Playwright
3. Click "Upload" → verify toast and gallery cards
4. Edit: hover card → Edit → change title/category → Update → verify toast
5. Navigate to `/gallery` on public site → verify images render

### Testimonial with Photo
1. Testimonials tab → "Add Testimonial" → fill name, role, text
2. Click star buttons for rating (clicking 4th star = 4 stars)
3. Upload optional photo via Playwright
4. Create → verify card shows uploaded photo (not letter initial)

### Form Validation
1. Open Add Product form → click Create with empty fields
2. Verify inline errors: "Title is required", "Description is required", "Valid price is required", "At least one image is required"
3. Form should stay open, no network request made

## Common Pitfalls

- **Browser `confirm()` dialogs**: Delete operations use `window.confirm()` which blocks the page and causes computer tool timeouts. Take a screenshot after clicking Delete to see the dialog, then click OK.
- **Category dropdowns**: Use Playwright `select_option()` or click the dropdown in the UI to change categories. The computer tool can also interact with native `<select>` dropdowns.
- **Loading animation**: The site has a luxury loading screen that plays on navigation. Wait 2-3 seconds after navigating before interacting.
- **Port conflicts**: If port 5000 is already in use, kill the existing process: `lsof -ti:5000 | xargs kill -9`
- **Gallery Edit button**: Hidden behind CSS hover overlay — use Playwright `force=True` click or use the computer tool to click directly on the button area.
- **Frontend port**: The frontend runs on port 5173 (not 5000). The Vite config proxies `/api` and `/uploads` to the backend.

## Verification Checklist

- [ ] Product created with all fields + multiple images
- [ ] Product appears on public homepage with image
- [ ] Gallery images uploaded and appear on public `/gallery` page
- [ ] Gallery edit changes title/category
- [ ] Form validation shows inline errors
- [ ] Product deletion removes card and updates stats
- [ ] Testimonial with photo shows avatar (not initial)
- [ ] Toast notifications appear (not browser alerts) for create/update/delete
