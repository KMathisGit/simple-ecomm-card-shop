# Technology Stack - Pokémon Card Store

## Frontend Stack

### Next.js 15+

- **Framework**: React-based full-stack framework with App Router
- **Why**:
  - Server-side rendering for SEO
  - Built-in API routes
  - Excellent performance with React Server Components
  - Image optimization
  - File-based routing

### Shadcn/UI

- **Component Library**: Accessible, customizable UI components
- **Built on**: Radix UI + Tailwind CSS
- **Why**:
  - Copy-paste components (no package bloat)
  - Fully customizable
  - Accessible by default
  - Modern design system
  - Great TypeScript support

### Additional Frontend Tools

- **TypeScript**: Type safety across the application
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management for cart
- **React Hook Form**: Form handling
- **Zod**: Schema validation
- **TanStack Query (React Query)**: Server state management and caching

## Backend Stack

### GraphQL

- **API Type**: Query language for APIs
- **Implementation**: Apollo Server or Pothos GraphQL
- **Why**:
  - Flexible data fetching
  - Single endpoint
  - Strongly typed
  - Perfect for product variations (conditions)
  - Efficient querying of related data

### PostgreSQL

- **Database**: Relational database
- **Why**:
  - ACID compliance for orders
  - Complex queries for filtering
  - JSON support for flexible data
  - Excellent for inventory management
  - Strong data relationships

### Prisma

- **ORM**: Type-safe database client
- **Why**:
  - Auto-generated TypeScript types
  - Easy migrations
  - Intuitive query API
  - Great developer experience
  - Schema-first approach

### NextAuth.js

- **Authentication**: OAuth provider integration
- **Why**:
  - Easy Google OAuth setup
  - Built for Next.js
  - Secure session management
  - Role-based access control
  - Active community support

## Development Tools

### Version Control

- **Git**: Source control
- **GitHub**: Repository hosting

### Code Quality

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **TypeScript**: Static type checking

### Testing

- **Jest**: Unit testing
- **React Testing Library**: Component testing
- **Playwright** (optional): E2E testing

### Development Environment

- **VS Code**: Recommended IDE
- **Node.js**: 18+ required
- **npm/pnpm**: Package management

## Deployment & Hosting

### Application Hosting

- **Vercel**: (Recommended) Optimal for Next.js
  - Automatic deployments
  - Preview URLs for PRs
  - Edge functions
  - Zero configuration

### Database Hosting

#### Recommended Options

**1. Neon (Recommended for Development & Small-Scale Production)**

- **Why**: Serverless PostgreSQL with generous free tier
- **Pros**:
  - Free tier includes 0.5 GB storage, 3 GB data transfer
  - Automatic scaling and branching
  - Built-in connection pooling
  - Easy integration with Vercel
  - Pay-as-you-go pricing after free tier
- **Cons**: Relatively new platform
- **Setup**: Sign up at neon.tech, create project, copy connection string
- **Cost**: Free for hobby projects, ~$19/month for production

**2. Vercel Postgres (Best Vercel Integration)**

- **Why**: Native Vercel integration, serverless
- **Pros**:
  - Seamless Vercel deployment
  - Automatic scaling
  - Edge-compatible
  - Built-in connection pooling
- **Cons**: More expensive, smaller free tier
- **Setup**: Enable in Vercel dashboard
- **Cost**: Free tier 256 MB, Pro starts at $20/month

**3. Supabase (Feature-Rich Alternative)**

- **Why**: PostgreSQL with additional features (auth, storage, realtime)
- **Pros**:
  - Generous free tier (500 MB, 2 GB bandwidth)
  - Built-in features you might use later
  - pgAdmin-like interface
  - Good documentation
- **Cons**: Extra features you may not need
- **Setup**: Sign up at supabase.com, create project
- **Cost**: Free tier, Pro $25/month

**4. Railway (Simple & Developer-Friendly)**

- **Why**: Easy setup, fair pricing
- **Pros**:
  - $5 free credit monthly
  - Simple UI and setup
  - Good performance
  - No credit card required for free tier
- **Cons**: Smaller free tier than others
- **Setup**: Sign up at railway.app, provision PostgreSQL
- **Cost**: $5 free credit/month, then usage-based

**5. Local Development**

- **Why**: Full control, no cost
- **Pros**: Free, fast, complete control
- **Cons**: Need to manage PostgreSQL installation, not for production
- **Setup**: Install PostgreSQL locally (PostgreSQL 15+)

#### Our Recommendation

**For This Project**: Start with **Neon** for both development and production

- Best free tier for hobby projects
- Easy to scale when needed
- Simple connection string setup
- Good performance

**Alternative Path**:

- **Local PostgreSQL** for development
- **Neon or Vercel Postgres** for production

### Image Storage

- **Local Storage**: Images stored in `/public` folder
- **Future**: Could migrate to Cloudinary or AWS S3

## Architecture Decisions

### Why This Stack?

1. **Next.js 15+**:
   - Latest App Router for better performance
   - React Server Components reduce client bundle
   - Built-in optimization

2. **Shadcn over Component Libraries**:
   - No dependency bloat
   - Complete customization control
   - Copy components into codebase

3. **GraphQL over REST**:
   - Complex product variants (conditions) require flexible queries
   - Avoid over-fetching
   - Single request for related data (card + conditions)

4. **Zustand over Redux**:
   - Lightweight for simple cart state
   - No boilerplate
   - Perfect for local storage sync

5. **PostgreSQL over NoSQL**:
   - Inventory management needs ACID compliance
   - Complex filtering requires relational queries
   - Order integrity is critical

6. **Prisma ORM**:
   - Excellent TypeScript integration
   - Simple migrations
   - Type-safe queries

## Project Structure

```
pokemon-card-shop/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   └── images/
│       └── cards/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (shop)/
│   │   ├── admin/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   └── graphql/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/              # Shadcn components
│   │   ├── admin/
│   │   ├── cart/
│   │   ├── product/
│   │   └── layout/
│   ├── lib/
│   │   ├── graphql/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── hooks/
│   ├── stores/              # Zustand stores
│   ├── types/
│   └── validations/
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Environment Variables

### Development (.env.local)

```bash
# Database (choose one based on your hosting choice)

# Option 1: Neon
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/pokemon_cards?sslmode=require"

# Option 2: Local PostgreSQL
# DATABASE_URL="postgresql://postgres:password@localhost:5432/pokemon_cards"

# Option 3: Vercel Postgres (from Vercel dashboard)
# POSTGRES_URL="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb"

# Option 4: Supabase
# DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App
NODE_ENV="development"
```

### Production (Vercel Environment Variables)

Set these in Vercel Dashboard → Project Settings → Environment Variables:

- `DATABASE_URL` - Your production database connection string
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - Same secret or generate new one
- `GOOGLE_CLIENT_ID` - Production OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Production OAuth client secret

## Package Dependencies

### Core Dependencies

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.0.0"
}
```

### Authentication

```json
{
  "next-auth": "^5.0.0"
}
```

### Database

```json
{
  "@prisma/client": "^5.0.0",
  "prisma": "^5.0.0"
}
```

### GraphQL

```json
{
  "@apollo/server": "^4.0.0",
  "@apollo/client": "^3.0.0",
  "graphql": "^16.0.0",
  "graphql-tag": "^2.0.0"
}
```

### UI & Styling

```json
{
  "tailwindcss": "^3.4.0",
  "@radix-ui/react-*": "latest",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0"
}
```

### State & Forms

```json
{
  "zustand": "^4.0.0",
  "react-hook-form": "^7.0.0",
  "@hookform/resolvers": "^3.0.0",
  "zod": "^3.0.0"
}
```

### Utilities

```json
{
  "date-fns": "^3.0.0",
  "lucide-react": "latest"
}
```

## Development Workflow

1. **Local Setup**: Clone repo, install dependencies
2. **Database Setup**: Create PostgreSQL database, run migrations
3. **Environment**: Configure `.env.local` with credentials
4. **Development**: Run `npm run dev`
5. **Testing**: Write tests as features are built
6. **Deployment**: Push to GitHub, auto-deploy via Vercel

## Technology Version Requirements

- **Node.js**: 18.17 or higher
- **npm**: 9.0 or higher (or pnpm 8+)
- **PostgreSQL**: 14 or higher
- **TypeScript**: 5.0 or higher
