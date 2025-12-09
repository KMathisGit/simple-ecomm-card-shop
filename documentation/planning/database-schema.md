# Database Schema - Pokémon Card Store

## Overview

The database schema is designed to handle Pokémon cards with multiple condition variants, user authentication, orders, and admin capabilities. The key complexity is managing card conditions as separate inventory items.

## Core Design Concept

**Important**: A single Pokémon card (e.g., "Pikachu from Base Set") can have multiple conditions (Mint, Good, etc.). Each condition variant has its own:

- Price
- Quantity in stock
- Separate inventory tracking

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User model for authentication
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  role          UserRole  @default(CUSTOMER)
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts      Account[]
  sessions      Session[]
  orders        Order[]

  @@map("users")
}

enum UserRole {
  CUSTOMER
  ADMIN
}

// NextAuth models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// Pokemon Card model (base card info)
model Card {
  id          String   @id @default(cuid())
  name        String
  imageUrl    String
  rarity      String
  set         String   // e.g., "Base Set", "Jungle", "Fossil"
  series      String?  // e.g., "Original Series", "Sun & Moon"
  cardNumber  String?  // Card number in set (e.g., "25/102")
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Each card can have multiple condition variants
  inventoryItems CardInventory[]

  @@index([name])
  @@index([set])
  @@index([rarity])
  @@map("cards")
}

// Card Inventory - Represents a card with a specific condition
model CardInventory {
  id        String          @id @default(cuid())
  cardId    String
  condition CardCondition
  price     Decimal         @db.Decimal(10, 2)
  quantity  Int             @default(0)
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt

  card       Card        @relation(fields: [cardId], references: [id], onDelete: Cascade)
  orderItems OrderItem[]

  // Each card can only have one entry per condition
  @@unique([cardId, condition])
  @@index([cardId])
  @@index([condition])
  @@index([price])
  @@map("card_inventory")
}

enum CardCondition {
  MINT
  NEAR_MINT
  EXCELLENT
  GOOD
  LIGHT_PLAYED
  PLAYED
  POOR
}

// Order model
model Order {
  id              String      @id @default(cuid())
  userId          String
  orderNumber     String      @unique // Human-readable order number
  status          OrderStatus @default(PENDING)
  totalAmount     Decimal     @db.Decimal(10, 2)
  
  // Shipping information (stored as JSON for simplicity)
  shippingAddress Json
  
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  user       User        @relation(fields: [userId], references: [id])
  orderItems OrderItem[]

  @@index([userId])
  @@index([orderNumber])
  @@index([status])
  @@index([createdAt])
  @@map("orders")
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

// Order items - links orders to specific card inventory
model OrderItem {
  id                String   @id @default(cuid())
  orderId           String
  cardInventoryId   String
  quantity          Int
  priceAtPurchase   Decimal  @db.Decimal(10, 2) // Store price at time of purchase
  
  order         Order         @relation(fields: [orderId], references: [id], onDelete: Cascade)
  cardInventory CardInventory @relation(fields: [cardInventoryId], references: [id])

  @@index([orderId])
  @@index([cardInventoryId])
  @@map("order_items")
}
```

## Schema Explanation

### User Management

- **User**: Stores user information with role (CUSTOMER or ADMIN)
- **Account/Session/VerificationToken**: Required for NextAuth.js OAuth

### Product Structure

- **Card**: Base Pokémon card information (name, image, set, rarity)
- **CardInventory**: Specific condition variants with individual pricing and quantity
  - A "Pikachu Base Set" card might have 3 CardInventory records (Mint, Near Mint, Good)
  - Each inventory item has its own price and stock count

### Order Management

- **Order**: Customer orders with shipping information
- **OrderItem**: Links orders to specific CardInventory items
  - Stores price at purchase time (price history)
  - References CardInventory (not Card) for condition-specific orders

## Example Data Structure

```javascript
// Example: Charizard card with multiple conditions

Card {
  id: "card_123",
  name: "Charizard",
  imageUrl: "/images/cards/charizard-base.png",
  rarity: "Holo Rare",
  set: "Base Set",
  cardNumber: "4/102"
}

CardInventory [
  {
    id: "inv_1",
    cardId: "card_123",
    condition: "MINT",
    price: 49.99,
    quantity: 5
  },
  {
    id: "inv_2",
    cardId: "card_123",
    condition: "NEAR_MINT",
    price: 39.99,
    quantity: 12
  },
  {
    id: "inv_3",
    cardId: "card_123",
    condition: "GOOD",
    price: 19.99,
    quantity: 25
  }
]
```

## Key Relationships

```
User (1) → (Many) Orders
Order (1) → (Many) OrderItems
OrderItem (Many) → (1) CardInventory
CardInventory (Many) → (1) Card
```

## Indexes

### Performance Indexes

- `cards.name`: For search queries
- `cards.set`: For filtering by set
- `cards.rarity`: For filtering by rarity
- `card_inventory.cardId`: For joining cards with inventory
- `card_inventory.condition`: For filtering by condition
- `card_inventory.price`: For price range filtering
- `orders.userId`: For user order history
- `orders.createdAt`: For sorting orders
- `order_items.orderId`: For order details

## Migrations Strategy

### Initial Migration

```bash
# Create initial schema
npx prisma migrate dev --name init
```

### Future Migrations

```bash
# Add new fields or tables
npx prisma migrate dev --name add_description_to_cards
```

### Database Seed

```typescript
// prisma/seed.ts
import { PrismaClient, CardCondition } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  // Create sample cards
  const pikachu = await prisma.card.create({
    data: {
      name: 'Pikachu',
      imageUrl: '/images/cards/pikachu-base.png',
      rarity: 'Common',
      set: 'Base Set',
      series: 'Original Series',
      cardNumber: '58/102',
      inventoryItems: {
        create: [
          { condition: CardCondition.MINT, price: 15.99, quantity: 10 },
          { condition: CardCondition.NEAR_MINT, price: 12.99, quantity: 25 },
          { condition: CardCondition.GOOD, price: 8.99, quantity: 40 },
        ],
      },
    },
  })

  const charizard = await prisma.card.create({
    data: {
      name: 'Charizard',
      imageUrl: '/images/cards/charizard-base.png',
      rarity: 'Holo Rare',
      set: 'Base Set',
      series: 'Original Series',
      cardNumber: '4/102',
      inventoryItems: {
        create: [
          { condition: CardCondition.MINT, price: 499.99, quantity: 2 },
          { condition: CardCondition.NEAR_MINT, price: 399.99, quantity: 5 },
          { condition: CardCondition.EXCELLENT, price: 299.99, quantity: 8 },
          { condition: CardCondition.GOOD, price: 199.99, quantity: 15 },
        ],
      },
    },
  })

  console.log({ admin, pikachu, charizard })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

## Query Examples

### Get card with all condition variants

```typescript
const card = await prisma.card.findUnique({
  where: { id: cardId },
  include: {
    inventoryItems: {
      where: { quantity: { gt: 0 } }, // Only in-stock conditions
      orderBy: { price: 'desc' }
    }
  }
})
```

### Create order with inventory decrement

```typescript
const order = await prisma.$transaction(async (tx) => {
  // Create order
  const order = await tx.order.create({
    data: {
      userId,
      orderNumber: generateOrderNumber(),
      status: 'CONFIRMED',
      totalAmount,
      shippingAddress,
      orderItems: {
        create: items.map(item => ({
          cardInventoryId: item.inventoryId,
          quantity: item.quantity,
          priceAtPurchase: item.price,
        })),
      },
    },
  })

  // Decrement inventory
  for (const item of items) {
    await tx.cardInventory.update({
      where: { id: item.inventoryId },
      data: {
        quantity: { decrement: item.quantity },
      },
    })
  }

  return order
})
```

### Search and filter cards

```typescript
const cards = await prisma.card.findMany({
  where: {
    name: { contains: searchTerm, mode: 'insensitive' },
    set: setFilter ? setFilter : undefined,
    inventoryItems: {
      some: {
        condition: conditionFilter,
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
        quantity: { gt: 0 }, // Only show cards in stock
      },
    },
  },
  include: {
    inventoryItems: {
      where: { quantity: { gt: 0 } },
    },
  },
})
```

## Data Integrity

### Constraints

- Card names are not unique (different sets can have same card)
- CardInventory has unique constraint on (cardId, condition)
- Order numbers are unique and human-readable
- Foreign keys enforce referential integrity

### Validation Rules

- Quantity cannot be negative
- Price must be positive
- Order total must match sum of order items
