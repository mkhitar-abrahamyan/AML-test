# Expense Tracker

Full-stack expense tracking application with NestJS backend and Next.js frontend.

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git
- Bash (Git Bash on Windows)

## Quick Setup

```bash
git clone https://github.com/mkhitar-abrahamyan/AML-test
```

```bash
git clone https://github.com/mkhitar-abrahamyan/AML-test
cd AML-test
```
```bash
git clone https://github.com/mkhitar-abrahamyan/AML-test
./setup.sh
```

This will:
- Create `.env` files from examples
- Install dependencies
- Start Docker containers
- Run database migrations

## Manual Setup

### 1. Clone & create env files

```bash
git clone https://github.com/mkhitar-abrahamyan/AML-test
cd AML
cp expense-tracker-backend/.env.example expense-tracker-backend/.env
cp expense-tracker-frontend/.env.example expense-tracker-frontend/.env
```

### 2. Start services

```bash
docker-compose up -d
```

### 3. Install dependencies & run

```bash
cd expense-tracker-backend && npm install && npm run start:dev
cd ../expense-tracker-frontend && npm install && npm run dev
```

## URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000

## Usage

1. Open http://localhost:3000
2. Register a new account
3. Login and start tracking expenses!

## Tech Stack

- **Backend**: NestJS, Prisma, PostgreSQL, JWT
- **Frontend**: Next.js, React, TypeScript
- **Database**: PostgreSQL (Docker)