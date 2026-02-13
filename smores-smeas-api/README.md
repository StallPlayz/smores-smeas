# Smores Smeas

Full-stack e-commerce platform.

## Stack
- Laravel (API & transactions)
- Next.js (Frontend)
- Prisma (Read-only ORM)
- Supabase (PostgreSQL)
- Koyeb (Backend Hosting)
- Vercel (Frontend Hosting)

## Project Structure

backend/ # Laravel API
frontend/ # Next.js frontend

## Setup

### Backend

cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate

### Frontend

cd frontend
npm install