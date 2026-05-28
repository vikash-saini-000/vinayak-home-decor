# Campus Crush

Anonymous mutual crush matching platform exclusively for college students. Built with the MERN stack, featuring a premium dark luxury aesthetic.

## Features

- **Anonymous Crushing** — Add crushes secretly. No one knows unless it's mutual.
- **Mutual Detection** — Automatic matching when two users add each other.
- **Consent-Based Reveal** — Identities hidden until both users explicitly agree.
- **College-Only Access** — Only verified educational emails allowed.
- **Privacy First** — No tracking, no data selling. Complete anonymity.
- **Anti-Harassment** — Block and report systems with rate limiting.
- **Admin Panel** — Monitor users, manage reports, disable accounts.
- **Email Notifications** — Beautiful HTML emails for matches and reveals.
- **Premium UI** — Dark luxury design with glassmorphism and Framer Motion.

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion
- React Router DOM
- Axios
- Lucide Icons
- React Hot Toast

### Backend
- Node.js + Express.js
- MongoDB Atlas (Mongoose)
- Passport.js (Google OAuth 2.0)
- JWT Authentication
- Nodemailer
- Helmet, CORS, Rate Limiting

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Google Cloud Console project with OAuth 2.0 credentials

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Set Authorized redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy Client ID and Client Secret

### MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP
5. Get the connection string

### Backend Setup
```bash
cd server
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

### Environment Variables

```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
ADMIN_EMAILS=admin@college.edu
SESSION_SECRET=your_session_secret
```

## API Routes

### Authentication
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/auth/google` | Initiate Google OAuth |
| GET | `/auth/google/callback` | Google OAuth callback |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Get current user |

### Users
| Method | Route | Description |
|--------|-------|-------------|
| PUT | `/api/user/update` | Update profile |
| GET | `/api/user/search` | Search students |
| POST | `/api/user/block/:userId` | Block user |
| POST | `/api/user/unblock/:userId` | Unblock user |

### Crushes
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/crush/add` | Add crush |
| DELETE | `/api/crush/remove` | Remove crush |
| GET | `/api/crush/my` | Get my crushes |

### Matches
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/matches` | Get matches |
| POST | `/api/matches/:id/confirm` | Confirm match (reveal) |
| POST | `/api/matches/:id/decline` | Decline match |

### Notifications
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/notifications` | Get notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |
| PUT | `/api/notifications/read-all` | Mark all as read |

### Reports
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/reports` | Submit report |

### Admin
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/users` | List users |
| POST | `/api/admin/users/:id/disable` | Disable user |
| POST | `/api/admin/users/:id/enable` | Enable user |
| GET | `/api/admin/reports` | List reports |
| PUT | `/api/admin/reports/:id` | Update report |

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import to [Vercel](https://vercel.com)
3. Set root directory: `client`
4. Build command: `npm run build`
5. Output directory: `dist`

### Backend (Render)
1. Push code to GitHub
2. Create Web Service on [Render](https://render.com)
3. Set root directory: `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables

## Privacy & Security

- Crush data is never exposed to other users
- Identities revealed only with mutual consent
- Rate limiting (10 crushes/day, 30 searches/min)
- Input sanitization and XSS prevention
- MongoDB injection prevention
- Helmet security headers
- HTTP-only JWT cookies

## License

MIT
