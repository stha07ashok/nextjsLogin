# AuthApp

A full-stack authentication application built with Next.js and Express featuring email/password login, Google OAuth, email verification, and password reset.

## Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, next-themes (dark mode), react-hook-form, Axios, SweetAlert2

**Backend:** Express, TypeScript, Sequelize ORM, MySQL, JWT, bcrypt, Nodemailer

## Features

- Email & password registration with email verification (6-digit OTP)
- Login with verified email enforcement
- Google OAuth (client-side, using Google Identity Services)
- Password reset via email
- JWT-based authentication with HTTP-only cookies
- Dark mode support
- Responsive design
- Loading states on form submissions

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL

### Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repo-url>
   cd authapp
   npm install --prefix client && npm install --prefix server
   ```

2. **Configure environment variables**

   **server/.env**
   ```env
   PORT=4000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_DATABASE=nextJs-Login
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:3000
   ```

   **client/.env.local**
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

3. **Set up the database**
   ```sql
   CREATE DATABASE IF NOT EXISTS nextJs-Login;
   ```

4. **Run the app**
   ```bash
   # Terminal 1 - Server
   cd server && npm start

   # Terminal 2 - Client
   cd client && npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project, enable the **Google+ API** and **Identity Services API**
3. Configure the OAuth consent screen and create credentials (Web application)
4. Add `http://localhost:3000` to **Authorized JavaScript origins**
5. Copy the Client ID to `client/.env.local`

### Email Setup

Update `server/src/nodemailer/nodemailer.config.ts` with a valid Gmail App Password (requires 2FA enabled on your Google account).

## Project Structure

```
├── client/              # Next.js frontend
│   ├── src/
│   │   ├── app/         # Pages (login, register, profile, reset-password)
│   │   ├── components/  # Navbar, Footer, GoogleSignIn, Loader, DarkMode
│   │   ├── types/       # TypeScript type definitions
│   │   └── utils/       # Theme provider
│   └── ...
├── server/              # Express backend
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── database/    # Sequelize connection
│   │   ├── middleware/   # JWT verification
│   │   ├── models/      # User model
│   │   ├── nodemailer/  # Email templates and config
│   │   ├── routes/      # API routes
│   │   ├── types/       # Type definitions
│   │   └── utils/       # JWT helpers
│   └── ...
└── README.md
```

## API Endpoints

| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| POST   | `/api/register`        | Create account           |
| POST   | `/api/verify-email`    | Verify email with OTP    |
| POST   | `/api/login`           | Login                    |
| POST   | `/api/logout`          | Logout                   |
| POST   | `/api/forgetpassword`  | Request password reset   |
| POST   | `/api/resetpassword/:token` | Reset password      |
| GET    | `/api/profile`         | Get user profile         |
