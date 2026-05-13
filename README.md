# Vinayak Home Decor

A premium cinematic luxury furniture website built with the MERN stack. Designed with a dark luxury aesthetic, cinematic atmosphere, and immersive scroll-driven storytelling.

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion
- GSAP + ScrollTrigger
- Lenis smooth scrolling
- React Router
- Axios

### Backend
- Node.js + Express.js
- MongoDB Atlas
- JWT Authentication
- Cloudinary image uploads

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Cloudinary credentials
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

### Admin Dashboard
Navigate to `/admin` and sign in with the credentials set in your `.env` file.

## Features

- **Cinematic Hero** — Fullscreen parallax hero with animated text reveals
- **Categories** — Animated category cards with hover effects
- **Featured Products** — Premium product grid with WhatsApp inquiry
- **About Section** — Storytelling layout with parallax images and stats
- **Gallery** — Masonry grid with lightbox preview
- **Testimonials** — Auto-sliding testimonial carousel
- **Contact** — Glassmorphism form with WhatsApp integration and embedded map
- **Admin Dashboard** — JWT-protected dashboard for product/contact management
- **Smooth Scrolling** — Lenis-powered smooth scroll experience
- **Floating Particles** — Ambient canvas particle system
- **Loading Animation** — Premium branded loading screen
- **Responsive** — Mobile-first responsive design

## Color Palette
- Primary Dark: `#0A0A0A`, `#111111`
- Gold: `#C8A97E`
- Warm Orange: `#E8956A`
- White: `#FFFFFF`

## Folder Structure
```
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   └── src/
│       ├── animations/
│       ├── assets/
│       ├── components/
│       │   ├── sections/
│       │   └── ui/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       └── services/
```
