# WAD03_trinity

## How to Install and Run Express

1. **Install dependencies**  
   Open your terminal and run:

   ```
   npm install
   ```

2. **Set up environment variables**  
   Copy the `.env.example` file and rename it to `.env`.

3. **Start the development server**  
   In your terminal, run:
   ```
   npm run dev
   ```

This will start your Express application in development mode.

## Prisma ORM (Database)

This project can use Prisma as the ORM to manage database schema, migrations, and a type-safe client.

Quick steps

1. Install Prisma CLI and the client:

   ```
   npm install prisma --save-dev
   npm install @prisma/client
   ```

2. Initialize Prisma (creates `prisma/` and `.env` entries):

   ```
   npx prisma init
   ```

3. Set your DATABASE_URL in `.env`. Examples:
   - Postgres:
     ```
     DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
     ```

Common commands

- Create initial migration and apply (recommended for SQL DBs):
  ```
  npx prisma migrate dev --name init
  ```
- Push schema changes directly (no migrations):
  ```
  npx prisma db push
  ```
- Introspect an existing DB:
  ```
  npx prisma db pull
  ```
- Generate the Prisma Client (usually run automatically after migrate/push):
  ```
  npx prisma generate
  ```
- Open Prisma Studio (web GUI):
  ```
  npx prisma studio
  ```
