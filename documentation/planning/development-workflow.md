# Development Workflow & Implementation Plan

## Overview

This document outlines the step-by-step process for building the Pokémon card e-commerce store, from initial setup to deployment.

## Phase 1: Project Setup (Week 1)

### 1.1 Initialize Project

```bash
# Create Next.js project
npx create-next-app@latest pokemon-card-shop --typescript --tailwind --app --src-dir

# Navigate to project
cd pokemon-card-shop

# Install dependencies
npm install @prisma/client @auth/prisma-adapter next-auth@beta
npm install @apollo/server @apollo/client @as-integrations/next graphql graphql-tag
npm install zustand zod react-hook-form @hookform/resolvers
npm install date-fns lucide-react sonner

# Install dev dependencies
npm install -D prisma @types/node
```

### 1.2 Configure Shadcn/UI

```bash
# Initialize shadcn
npx shadcn@latest init

# Install required components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add badge
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add label
npx shadcn@latest add separator
npx shadcn@latest add slider
npx shadcn@latest add avatar
npx shadcn@latest add sheet
```

### 1.3 Setup Environment Variables

```bash
# Create .env.local file
touch .env.local
```

Add the following:
```
DATABASE_URL="postgresql://user:password@localhost:5432/pokemon_cards"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 1.4 Setup Database

```bash
# Initialize Prisma
npx prisma init

# Copy schema from documentation/planning/database-schema.md
# into prisma/schema.prisma

# Create initial migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 1.5 Project Structure

Create the following directory structure:
```
src/
├── app/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── product/
│   ├── cart/
│   ├── search/
│   ├── checkout/
│   ├── admin/
│   └── providers/
├── lib/
│   ├── graphql/
│   ├── stores/
│   ├── hooks/
│   └── utils/
└── types/
```

## Phase 2: Core Infrastructure (Week 2)

### 2.1 Authentication Setup

**Tasks:**
- [ ] Configure NextAuth.js with Google OAuth
- [ ] Create auth API routes
- [ ] Setup Prisma adapter
- [ ] Create sign-in page
- [ ] Implement middleware for protected routes
- [ ] Add AuthProvider to root layout

**Files to create:**
- `src/lib/auth.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/(auth)/auth/signin/page.tsx`
- `src/middleware.ts`
- `src/components/providers/AuthProvider.tsx`

### 2.2 Database Utilities

**Tasks:**
- [ ] Create Prisma client singleton
- [ ] Create seed script
- [ ] Seed initial data (categories, sample cards)

**Files to create:**
- `src/lib/prisma.ts`
- `prisma/seed.ts`

### 2.3 GraphQL API Setup

**Tasks:**
- [ ] Setup Apollo Server
- [ ] Define GraphQL schema
- [ ] Implement resolvers (queries and mutations)
- [ ] Create context with auth
- [ ] Setup GraphQL API route

**Files to create:**
- `src/lib/graphql/schema.ts`
- `src/lib/graphql/resolvers/index.ts`
- `src/lib/graphql/resolvers/Query.ts`
- `src/lib/graphql/resolvers/Mutation.ts`
- `src/lib/graphql/context.ts`
- `src/app/api/graphql/route.ts`

### 2.4 Apollo Client Setup

**Tasks:**
- [ ] Configure Apollo Client
- [ ] Create GraphQL queries
- [ ] Create GraphQL mutations
- [ ] Setup Apollo Provider

**Files to create:**
- `src/lib/graphql/client.ts`
- `src/lib/graphql/queries.ts`
- `src/lib/graphql/mutations.ts`
- `src/components/providers/ApolloProvider.tsx`

## Phase 3: Core Features (Weeks 3-4)

### 3.1 Product Catalog

**Tasks:**
- [ ] Create Card components (CardItem, CardGrid)
- [ ] Implement product listing page
- [ ] Create product detail page with condition selector
- [ ] Add price display logic
- [ ] Implement image optimization

**Files to create:**
- `src/components/product/CardItem.tsx`
- `src/components/product/CardGrid.tsx`
- `src/components/product/CardDetail.tsx`
- `src/components/product/ConditionSelector.tsx`
- `src/app/(shop)/page.tsx`
- `src/app/(shop)/cards/[id]/page.tsx`

### 3.2 Search and Filtering

**Tasks:**
- [ ] Create SearchBar component
- [ ] Implement SearchFilters component
- [ ] Create search results page
- [ ] Add filter logic (set, series, condition, price)
- [ ] Implement search query handling

**Files to create:**
- `src/components/search/SearchBar.tsx`
- `src/components/search/SearchFilters.tsx`
- `src/components/search/SearchResults.tsx`
- `src/app/(shop)/search/page.tsx`

### 3.3 Shopping Cart

**Tasks:**
- [ ] Create Zustand cart store
- [ ] Implement CartButton with badge
- [ ] Create CartDrawer/CartSheet
- [ ] Add CartItem component
- [ ] Implement cart persistence
- [ ] Add cart summary

**Files to create:**
- `src/lib/stores/cart.ts`
- `src/components/cart/CartButton.tsx`
- `src/components/cart/CartDrawer.tsx`
- `src/components/cart/CartItem.tsx`
- `src/components/cart/CartSummary.tsx`

### 3.4 Checkout Process

**Tasks:**
- [ ] Create checkout page (protected route)
- [ ] Implement ShippingForm
- [ ] Create OrderSummary component
- [ ] Implement order creation mutation
- [ ] Add inventory decrement logic
- [ ] Create order success page

**Files to create:**
- `src/app/(shop)/checkout/page.tsx`
- `src/components/checkout/CheckoutForm.tsx`
- `src/components/checkout/ShippingForm.tsx`
- `src/components/checkout/OrderSummary.tsx`
- `src/app/(shop)/checkout/success/page.tsx`

### 3.5 Order History

**Tasks:**
- [ ] Create orders list page
- [ ] Implement order detail page
- [ ] Add order status display

**Files to create:**
- `src/app/(shop)/orders/page.tsx`
- `src/app/(shop)/orders/[id]/page.tsx`
- `src/components/order/OrderCard.tsx`

## Phase 4: Admin Panel (Week 5)

### 4.1 Admin Layout

**Tasks:**
- [ ] Create admin layout with sidebar
- [ ] Implement admin route protection
- [ ] Create admin dashboard

**Files to create:**
- `src/app/admin/layout.tsx`
- `src/components/layout/AdminSidebar.tsx`
- `src/app/admin/page.tsx`

### 4.2 Card Management

**Tasks:**
- [ ] Create card list page
- [ ] Implement add new card form
- [ ] Create edit card form
- [ ] Add inventory management UI
- [ ] Implement delete card functionality

**Files to create:**
- `src/app/admin/cards/page.tsx`
- `src/app/admin/cards/new/page.tsx`
- `src/app/admin/cards/[id]/edit/page.tsx`
- `src/components/admin/CardForm.tsx`
- `src/components/admin/InventoryManager.tsx`

### 4.3 Order Management

**Tasks:**
- [ ] Create all orders list page
- [ ] Implement order detail view
- [ ] Add order status update functionality

**Files to create:**
- `src/app/admin/orders/page.tsx`
- `src/app/admin/orders/[id]/page.tsx`
- `src/components/admin/OrdersList.tsx`

## Phase 5: UI/UX Polish (Week 6)

### 5.1 Layout Components

**Tasks:**
- [ ] Create Header component
- [ ] Implement Navbar with search
- [ ] Create Footer component
- [ ] Add UserMenu component
- [ ] Implement responsive design

**Files to create:**
- `src/components/layout/Header.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/UserMenu.tsx`

### 5.2 Loading States

**Tasks:**
- [ ] Add loading skeletons
- [ ] Implement loading spinners
- [ ] Create suspense boundaries

**Files to create:**
- `src/components/ui/skeleton.tsx`
- `src/components/loading/CardSkeleton.tsx`

### 5.3 Error Handling

**Tasks:**
- [ ] Create error boundaries
- [ ] Add error pages (404, 500, unauthorized)
- [ ] Implement toast notifications

**Files to create:**
- `src/app/error.tsx`
- `src/app/not-found.tsx`
- `src/app/unauthorized/page.tsx`

## Phase 6: Testing & Optimization (Week 7)

### 6.1 Testing

**Tasks:**
- [ ] Write unit tests for utilities
- [ ] Test cart store
- [ ] Test GraphQL resolvers
- [ ] Manual testing checklist
- [ ] Cross-browser testing

### 6.2 Performance Optimization

**Tasks:**
- [ ] Optimize images
- [ ] Implement lazy loading
- [ ] Add caching strategies
- [ ] Bundle size optimization
- [ ] Lighthouse audit

### 6.3 Security Review

**Tasks:**
- [ ] Review authentication flows
- [ ] Check authorization logic
- [ ] Validate input sanitization
- [ ] Test rate limiting
- [ ] Security headers check

## Phase 7: Deployment (Week 8)

### 7.1 Pre-Deployment

**Tasks:**
- [ ] Update environment variables for production
- [ ] Configure Google OAuth for production domain
- [ ] Setup production database
- [ ] Run migrations on production database
- [ ] Seed production data

### 7.2 Deployment

**Tasks:**
- [ ] Deploy to Vercel
- [ ] Configure custom domain (if applicable)
- [ ] Setup environment variables in Vercel
- [ ] Test production deployment
- [ ] Monitor for errors

### 7.3 Post-Deployment

**Tasks:**
- [ ] Setup error monitoring (Sentry)
- [ ] Configure analytics
- [ ] Create backup strategy
- [ ] Document deployment process
- [ ] Create runbook for common issues

## Development Best Practices

### Git Workflow

```bash
# Feature branch workflow
git checkout -b feature/card-catalog
# Make changes
git add .
git commit -m "feat: add card catalog page"
git push origin feature/card-catalog
# Create PR and merge
```

### Commit Message Convention

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

### Code Review Checklist

- [ ] Code follows TypeScript best practices
- [ ] Components are properly typed
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Responsive design is maintained
- [ ] Accessibility guidelines followed
- [ ] No console errors or warnings
- [ ] GraphQL queries are optimized

## Development Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint errors

# Database
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev     # Run migrations
npx prisma migrate reset   # Reset database
npx prisma generate        # Generate Prisma Client
npx prisma db seed         # Seed database

# Testing
npm run test               # Run tests
npm run test:watch         # Watch mode
```

## Troubleshooting Common Issues

### Database Connection Issues
```bash
# Check if PostgreSQL is running
pg_ctl status

# Restart PostgreSQL
pg_ctl restart

# Verify connection string in .env.local
```

### Authentication Issues
```bash
# Regenerate NEXTAUTH_SECRET
openssl rand -base64 32

# Verify Google OAuth credentials
# Check redirect URIs match exactly
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Timeline Summary

- **Week 1**: Project setup and configuration
- **Week 2**: Core infrastructure (auth, database, GraphQL)
- **Weeks 3-4**: Core features (catalog, search, cart, checkout)
- **Week 5**: Admin panel
- **Week 6**: UI/UX polish
- **Week 7**: Testing and optimization
- **Week 8**: Deployment

**Total Estimated Time**: 8 weeks for MVP

## Next Steps After MVP

1. Add email notifications
2. Implement product reviews
3. Add wishlist functionality
4. Advanced analytics dashboard
5. Bulk import for cards
6. Export order data
7. Customer support chat
8. Mobile app (React Native)

This workflow provides a structured approach to building the Pokémon card e-commerce store with clear milestones and deliverables at each phase.