# dead-frequencey

Vanilla setup for:
- Next.js (App Router, TypeScript)
- Better Auth (email/password auth)
- Drizzle ORM
- PostgreSQL in Docker

## 1) Install dependencies

```bash
npm install
```

## 2) Start PostgreSQL with Docker

```bash
docker compose up -d
```

## 3) Configure environment

Copy `.env.example` to `.env` and set values:

```bash
cp .env.example .env
```

- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: random secret (32+ chars)
- `BETTER_AUTH_URL`: app URL (usually `http://localhost:3000`)
- `NEXT_PUBLIC_APP_URL`: app URL for auth client

## 4) Create database tables

```bash
npm run db:generate
npm run db:migrate
```

## 5) Run the app

```bash
npm run dev
```

## Auth routes/pages

- Better Auth API: `/api/auth/[...all]`
- Login page: `/login`
- Register page: `/register`
- Protected page: `/dashboard`


## Other
### Generate Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Open DB Studio

```bash
npm run db:studio
```

### Create Admin

```bash
npx auth@latest create-admin --email admin@email.com --name "admin" --password "password"
```

### Kill Docker and remove old instances

```bash
docker compose down -v
docker ps
docker stop <old-container-name>
docker compose up -d
docker exec -it dead-frequency-postgres-1 psql -U postgres -l
```


### Install dependencies when copying repo
```bash
npm install
npm install drizzle-orm postgres
npm install -D drizzle-kit tsx dotenv
npm install auth
```