# Quick Reference Guide

## Project Overview

**Pokémon Card E-Commerce Store** - A full-stack web application for buying and selling Pokémon cards with multiple condition variants.

## Tech Stack Summary

- **Frontend**: Next.js 15, React 19, TypeScript, Shadcn/UI, Tailwind CSS
- **State Management**: Zustand (cart), React Query (server state)
- **Backend**: GraphQL (Apollo Server), Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with Google OAuth
- **Deployment**: Vercel (recommended)

## Key Features

✅ Product catalog with search and filtering  
✅ Condition-based pricing and inventory  
✅ Shopping cart (localStorage)  
✅ Google OAuth authentication  
✅ Mock checkout process  
✅ Order history  
✅ Admin panel for inventory management  
✅ Role-based access control  

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── (auth)/          # Auth pages
│   ├── (shop)/          # Shop pages
│   ├── admin/           # Admin pages
│   └── api/             # API routes
├── components/          # React components
│   ├── ui/             # Shadcn components
│   ├── product/        # Product components
│   ├── cart/           # Cart components
│   └── admin/          # Admin components
├── lib/                # Utilities
│   ├── graphql/        # GraphQL setup
│   ├── stores/         # Zustand stores
│   └── hooks/          # Custom hooks
└── types/              # TypeScript types
```

## Quick Start Commands

```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed

# Start development server
npm run dev

# Open Prisma Studio
npx prisma studio

# Build for production
npm run build
```

## Environment Variables

```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Database Schema Quick Reference

### Main Tables
- **users**: User accounts with roles (CUSTOMER, ADMIN)
- **cards**: Base Pokémon card information
- **card_inventory**: Condition variants with price and quantity
- **orders**: Customer orders
- **order_items**: Order line items

### Key Relationship
`Card (1) → (Many) CardInventory (Many) → (Many) OrderItem`

## GraphQL API Endpoints

**Endpoint**: `/api/graphql`

### Common Queries

```graphql
# Get cards with filters
query GetCards($filters: CardFilters) {
  cards(filters: $filters) {
    edges {
      node {
        id
        name
        imageUrl
        availableInventory {
          id
          condition
          price
          quantity
        }
      }
    }
  }
}

# Get single card
query GetCard($id: ID!) {
  card(id: $id) {
    id
    name
    imageUrl
    set
    rarity
    allInventory {
      id
      condition
      price
      quantity
    }
  }
}
```

### Common Mutations

```graphql
# Create order
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    orderNumber
    totalAmount
  }
}

# Create card (Admin)
mutation CreateCard($input: CreateCardInput!) {
  createCard(input: $input) {
    id
    name
  }
}
```

## Component Usage Examples

### Add to Cart

```tsx
import { useCartStore } from '@/lib/stores/cart'

const addItem = useCartStore(state => state.addItem)

addItem({
  cardInventoryId: '123',
  cardId: '456',
  cardName: 'Pikachu',
  cardImage: '/pikachu.png',
  condition: 'MINT',
  price: 15.99,
}, 1)
```

### Check Authentication

```tsx
import { auth } from '@/lib/auth'

// Server Component
const session = await auth()
if (session?.user?.role === 'ADMIN') {
  // Show admin content
}

// Client Component
import { useSession } from 'next-auth/react'
const { data: session } = useSession()
```

### GraphQL Query

```tsx
import { useQuery } from '@apollo/client'
import { GET_CARDS } from '@/lib/graphql/queries'

const { data, loading, error } = useQuery(GET_CARDS, {
  variables: {
    filters: {
      search: 'Pikachu',
      inStockOnly: true,
    },
  },
})
```

## Routing Structure

### Public Routes
- `/` - Homepage/landing
- `/search` - Search results
- `/cards/[id]` - Product detail

### Protected Routes (Auth Required)
- `/checkout` - Checkout page
- `/orders` - Order history
- `/orders/[id]` - Order detail

### Admin Routes (Admin Role Required)
- `/admin` - Dashboard
- `/admin/cards` - Card management
- `/admin/orders` - Order management

## Common Patterns

### Condition-Based Pricing
Each card has multiple inventory items (conditions):
- Each condition has separate price and quantity
- Users select condition on product page
- Cart stores cardInventoryId (not just cardId)

### Cart Persistence
- Cart stored in localStorage via Zustand
- Persists across page refreshes
- Preserved during login flow
- Cleared on logout

### Inventory Management
- Inventory decremented atomically in transaction
- Stock checked before order creation
- Admin can update quantities per condition

## Common Issues & Solutions

### Issue: Database connection failed
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env.local
# Run: npx prisma generate
```

### Issue: Google OAuth not working
```bash
# Verify redirect URIs match exactly
# Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
# Ensure NEXTAUTH_URL is correct
```

### Issue: Cart not persisting
```bash
# Check Zustand persist middleware
# Verify localStorage is enabled
# Clear localStorage and test
```

## File Locations

### Configuration Files
- `prisma/schema.prisma` - Database schema
- `src/lib/auth.ts` - Authentication config
- `src/lib/graphql/schema.ts` - GraphQL schema
- `tailwind.config.js` - Tailwind configuration

### Important Components
- `src/lib/stores/cart.ts` - Cart state management
- `src/components/product/ConditionSelector.tsx` - Condition picker
- `src/components/cart/CartDrawer.tsx` - Cart UI
- `src/middleware.ts` - Route protection

## Testing Checklist

### User Flow
- [ ] Browse products as anonymous user
- [ ] Search and filter products
- [ ] Add items to cart
- [ ] View cart
- [ ] Attempt checkout (redirects to login)
- [ ] Login with Google
- [ ] Complete checkout
- [ ] View order confirmation
- [ ] Check order history
- [ ] Logout (cart cleared)

### Admin Flow
- [ ] Login as admin
- [ ] Access admin panel
- [ ] Create new card with conditions
- [ ] Edit existing card
- [ ] Update inventory quantities
- [ ] View all orders
- [ ] Update order status

## Performance Tips

1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Leverage dynamic imports for large components
3. **Caching**: Use React Query for API response caching
4. **Database Indexing**: Ensure proper indexes on search fields
5. **Bundle Size**: Monitor with `@next/bundle-analyzer`

## Security Checklist

- [ ] Environment variables not committed
- [ ] Admin routes protected with middleware
- [ ] GraphQL resolvers check user roles
- [ ] Input validation on all forms
- [ ] HTTPS in production
- [ ] OAuth secrets secure
- [ ] Database credentials secure

## Documentation Files

All detailed documentation is in `documentation/planning/`:

1. `project-overview.md` - Project scope and requirements
2. `tech-stack.md` - Technology decisions and setup
3. `database-schema.md` - Complete database design
4. `api-design.md` - GraphQL schema and resolvers
5. `frontend-guide.md` - Component architecture
6. `authentication.md` - Auth implementation
7. `development-workflow.md` - Build process and timeline
8. `quick-reference.md` - This file

## Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Shadcn/UI Components](https://ui.shadcn.com)
- [Apollo GraphQL](https://www.apollographql.com/docs)
- [NextAuth.js](https://next-auth.js.org)
- [Zustand](https://docs.pmnd.rs/zustand)

## Getting Help

1. Check documentation files in `documentation/planning/`
2. Review code comments in source files
3. Check console for error messages
4. Use Prisma Studio to inspect database
5. Test GraphQL queries in Apollo Playground

---

**Ready to start building?** Begin with Phase 1 in `development-workflow.md`!