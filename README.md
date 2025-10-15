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

### Configure Database Connection

Edit your `.env` file and add your database connection string:

```
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

Replace with your actual database credentials. Prisma supports PostgreSQL, MySQL, SQLite, SQL Server, MongoDB, and CockroachDB.

### Common Prisma Commands

1. **Create a new table**  
   Edit your `schema.prisma` file to add a new model, then run:

   ```
   npx prisma migrate dev --name add_table_name
   ```

2. **Generate Prisma Client**  
   After modifying your schema, regenerate the client:

   ```
   npx prisma generate
   ```

3. **View your database**  
   Open Prisma Studio to browse and edit data:

   ```
   npx prisma studio
   ```

4. **Reset database**  
   Drop all data and re-run migrations:

   ```
   npx prisma migrate reset
   ```

5. **Push schema changes without migration**  
   Useful for prototyping:
   ```
   npx prisma db push
   ```
