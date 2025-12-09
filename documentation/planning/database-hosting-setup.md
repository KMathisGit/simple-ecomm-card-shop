# Database Hosting Setup Guide

## Overview

This guide walks you through setting up PostgreSQL database hosting for your Pokémon card e-commerce store. We'll cover multiple hosting options with step-by-step instructions.

## Recommended Setup: Neon

### Why Neon?

- **Best free tier**: 0.5 GB storage, 3 GB data transfer/month
- **Serverless**: Automatic scaling and sleep when inactive
- **Branching**: Create database branches like Git branches
- **Connection pooling**: Built-in for optimal performance
- **Vercel integration**: Easy deployment

### Setup Steps

#### 1. Create Neon Account

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub, Google, or email
3. Verify your email

#### 2. Create Project

1. Click "Create Project"
2. Choose settings:
   - **Name**: `pokemon-card-shop`
   - **Region**: Choose closest to your users (e.g., US East for North America)
   - **PostgreSQL Version**: 15 or higher
3. Click "Create Project"

#### 3. Get Connection String

1. After project creation, you'll see connection details
2. Copy the connection string (looks like):

   ```
   postgresql://username:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

3. Add to your `.env.local`:

   ```bash
   DATABASE_URL="postgresql://username:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

#### 4. Test Connection

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio to verify
npx prisma studio
```

#### 5. Run Migrations

```bash
# Create initial migration
npx prisma migrate dev --name init

# Seed database
npx prisma db seed
```

### Neon Dashboard Features

- **Branches**: Create dev/staging branches from main database
- **Monitoring**: View connection stats and query performance
- **Backups**: Automatic backups included
- **SQL Editor**: Run queries directly in dashboard

## Alternative: Vercel Postgres

### Setup Steps

#### 1. Link Vercel Project

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link
```

#### 2. Enable Postgres

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to "Storage" tab
4. Click "Create Database"
5. Select "Postgres"
6. Click "Create"

#### 3. Get Connection Strings

Vercel provides multiple connection strings:

- `POSTGRES_URL` - Direct connection (for Prisma)
- `POSTGRES_URL_NON_POOLING` - Non-pooled (for migrations)
- `POSTGRES_PRISMA_URL` - Optimized for Prisma

#### 4. Update Prisma Configuration

```prisma
// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_PRISMA_URL") // Uses connection pooling
  directUrl = env("POSTGRES_URL_NON_POOLING") // Direct for migrations
}
```

#### 5. Pull Environment Variables

```bash
# Pull env vars from Vercel to local
vercel env pull .env.local
```

## Alternative: Supabase

### Setup Steps

#### 1. Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Create new organization

#### 2. Create Project

1. Click "New Project"
2. Fill in details:
   - **Name**: `pokemon-card-shop`
   - **Database Password**: Strong password (save this!)
   - **Region**: Choose closest region
   - **Pricing Plan**: Free
3. Wait for project to provision (~2 minutes)

#### 3. Get Connection String

1. Go to Project Settings → Database
2. Find "Connection string" section
3. Choose "URI" format
4. Copy connection string
5. Replace `[YOUR-PASSWORD]` with your database password
6. Add to `.env.local`:

   ```bash
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
   ```

#### 4. Configure Connection Pooling (Recommended)

1. In Supabase dashboard, go to Database → Connection Pooling
2. Enable connection pooling
3. Use the pooled connection string for production:

   ```bash
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:6543/postgres?pgbouncer=true"
   ```

### Supabase Extras

Supabase includes features you might use later:

- **Auth**: User authentication (we use NextAuth, but you could switch)
- **Storage**: File storage for card images
- **Realtime**: Live data updates
- **Edge Functions**: Serverless functions

## Alternative: Railway

### Setup Steps

#### 1. Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Verify email

#### 2. Create New Project

1. Click "New Project"
2. Select "Provision PostgreSQL"
3. Railway will create database instantly

#### 3. Get Connection Details

1. Click on PostgreSQL service
2. Go to "Connect" tab
3. Copy "Postgres Connection URL"
4. Add to `.env.local`:

   ```bash
   DATABASE_URL="postgresql://postgres:password@containers-xxx.railway.app:7432/railway"
   ```

#### 4. Enable External Access

1. In PostgreSQL service settings
2. Click "Settings" → "Public Networking"
3. Enable public access

### Railway CLI (Optional)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# View database logs
railway logs
```

## Local PostgreSQL Setup

### For Development Only

#### Windows

1. Download PostgreSQL installer from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer
3. Choose PostgreSQL 15 or higher
4. Set password for `postgres` user
5. Keep default port `5432`

#### macOS

```bash
# Using Homebrew
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Create database
createdb pokemon_cards
```

#### Linux (Ubuntu/Debian)

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql

# Create user and database
sudo -u postgres createuser --interactive
sudo -u postgres createdb pokemon_cards
```

#### Connection String for Local

```bash
# .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/pokemon_cards"
```

## Database Configuration Best Practices

### Connection Pooling

For production, always use connection pooling:

**With Prisma + Neon/Supabase:**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Neon includes connection pooling by default. For others, add `?pgbouncer=true` or use a pooling service.

### Environment-Specific Databases

**Best Practice**: Use different databases for each environment

```bash
# Development
DATABASE_URL="postgresql://...dev_db"

# Staging
DATABASE_URL="postgresql://...staging_db"

# Production
DATABASE_URL="postgresql://...prod_db"
```

### SSL Configuration

Most hosted databases require SSL:

```bash
# Add sslmode=require to connection string
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

## Migration Strategy

### Development to Production

1. **Test migrations locally:**

   ```bash
   npx prisma migrate dev
   ```

2. **Deploy migration to production:**

   ```bash
   # Set production DATABASE_URL
   npx prisma migrate deploy
   ```

3. **Seed production database:**

   ```bash
   npx prisma db seed
   ```

### Database Branching (Neon)

Create a branch for testing:

```bash
# In Neon dashboard, create branch "dev"
# Use branch connection string for development
# Merge to main when ready
```

## Backup and Recovery

### Automatic Backups

- **Neon**: Automatic backups, point-in-time recovery
- **Vercel Postgres**: Automatic backups included
- **Supabase**: Daily backups on free tier
- **Railway**: Automatic backups, snapshots available

### Manual Backup

```bash
# Export database
pg_dump DATABASE_URL > backup.sql

# Restore database
psql DATABASE_URL < backup.sql
```

## Monitoring and Performance

### Tools to Monitor

1. **Database dashboard** (Neon/Supabase/Railway)
2. **Prisma Studio** for data inspection
3. **Vercel Analytics** for API performance
4. **Slow query logs** in database settings

### Optimization Tips

1. **Indexes**: Ensure all foreign keys and search fields are indexed
2. **Connection limits**: Monitor active connections
3. **Query optimization**: Use Prisma's query analyzer
4. **Caching**: Implement Redis for frequently accessed data (optional)

## Cost Comparison

| Provider | Free Tier | Paid Starts At | Best For |
|----------|-----------|----------------|----------|
| **Neon** | 0.5 GB storage, 3 GB transfer | $19/month | Development & small production |
| **Vercel Postgres** | 256 MB storage | $20/month | Vercel-integrated apps |
| **Supabase** | 500 MB storage, 2 GB bandwidth | $25/month | Apps needing extra features |
| **Railway** | $5 credit/month | Usage-based (~$5-20) | Simple setup |
| **Local** | Free | Free | Development only |

## Recommended Setup Path

### Phase 1: Development (Week 1-6)

- **Use**: Local PostgreSQL or Neon free tier
- **Why**: Fast iteration, no cost concerns

### Phase 2: Staging/Testing (Week 7)

- **Use**: Neon branch or separate Neon project
- **Why**: Test migrations before production

### Phase 3: Production (Week 8+)

- **Use**: Neon paid plan or Vercel Postgres
- **Why**: Reliable, scalable, monitored

## Troubleshooting

### Connection Refused

```bash
# Check if host is reachable
ping your-db-host.com

# Verify SSL requirement
# Add ?sslmode=require to connection string
```

### Too Many Connections

```bash
# Enable connection pooling
# Or increase connection limit in database settings
```

### Migration Fails

```bash
# Reset local database
npx prisma migrate reset

# Push schema without migration
npx prisma db push
```

### Slow Queries

```bash
# Check query performance in database dashboard
# Add indexes to frequently queried fields
# Use Prisma's query optimization tools
```

## Security Checklist

- [ ] Use strong database passwords
- [ ] Enable SSL/TLS connections
- [ ] Restrict database access to application only
- [ ] Store connection strings in environment variables (never commit)
- [ ] Use separate databases for dev/staging/prod
- [ ] Enable automatic backups
- [ ] Monitor for unusual query patterns
- [ ] Regularly update database software

## Quick Start Command

Once you have your `DATABASE_URL` in `.env.local`:

```bash
# Initialize database
npx prisma generate
npx prisma db push
npx prisma db seed

# Verify setup
npx prisma studio
```

Your database is ready! 🎉
