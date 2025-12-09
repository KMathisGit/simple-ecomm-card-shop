# GraphQL API Design - Pokémon Card Store

## Overview

The GraphQL API provides a flexible interface for querying Pokémon cards with their condition variants, managing cart operations, and handling orders. The schema is designed to efficiently handle the unique inventory model where cards have multiple conditions.

## GraphQL Schema

### Type Definitions

```graphql
# Scalars
scalar DateTime
scalar Decimal

# Enums
enum UserRole {
  CUSTOMER
  ADMIN
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

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum SortOrder {
  ASC
  DESC
}

# User Types
type User {
  id: ID!
  email: String!
  name: String
  image: String
  role: UserRole!
  orders: [Order!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# Card Types
type Card {
  id: ID!
  name: String!
  imageUrl: String!
  rarity: String!
  set: String!
  cardNumber: String
  description: String
  
  # Available inventory items (conditions with stock > 0)
  availableInventory: [CardInventory!]!
  
  # All inventory items (including out of stock)
  allInventory: [CardInventory!]!
  
  # Price range across all conditions
  minPrice: Decimal
  maxPrice: Decimal
  
  createdAt: DateTime!
  updatedAt: DateTime!
}

type CardInventory {
  id: ID!
  cardId: ID!
  card: Card!
  condition: CardCondition!
  price: Decimal!
  quantity: Int!
  isInStock: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# Pagination type for cards
type CardConnection {
  edges: [CardEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type CardEdge {
  node: Card!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

# Order Types
type Order {
  id: ID!
  orderNumber: String!
  user: User!
  status: OrderStatus!
  totalAmount: Decimal!
  shippingAddress: ShippingAddress!
  items: [OrderItem!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type OrderItem {
  id: ID!
  cardInventory: CardInventory!
  quantity: Int!
  priceAtPurchase: Decimal!
  subtotal: Decimal!
}

type ShippingAddress {
  fullName: String!
  addressLine1: String!
  addressLine2: String
  city: String!
  state: String!
  zipCode: String!
  country: String!
}

# Input Types
input CardFilters {
  search: String
  set: String
  rarity: String
  minPrice: Decimal
  maxPrice: Decimal
  condition: CardCondition
  inStockOnly: Boolean
}

input CardSort {
  field: CardSortField!
  order: SortOrder!
}

enum CardSortField {
  NAME
  PRICE
  RARITY
  CREATED_AT
}

input PaginationInput {
  first: Int
  after: String
  last: Int
  before: String
}

input CreateCardInput {
  name: String!
  imageUrl: String!
  rarity: String!
  set: String!
  cardNumber: String
  description: String
  inventory: [CardInventoryInput!]!
}

input CardInventoryInput {
  condition: CardCondition!
  price: Decimal!
  quantity: Int!
}

input UpdateCardInput {
  name: String
  imageUrl: String
  rarity: String
  set: String
  cardNumber: String
  description: String
}

input UpdateInventoryInput {
  id: ID!
  price: Decimal
  quantity: Int
}

input ShippingAddressInput {
  fullName: String!
  addressLine1: String!
  addressLine2: String
  city: String!
  state: String!
  zipCode: String!
  country: String!
}

input CreateOrderInput {
  items: [OrderItemInput!]!
  shippingAddress: ShippingAddressInput!
}

input OrderItemInput {
  cardInventoryId: ID!
  quantity: Int!
}

# Query Root
type Query {
  # Current user
  me: User
  
  # Card queries
  card(id: ID!): Card
  cards(
    filters: CardFilters
    sort: CardSort
    pagination: PaginationInput
  ): CardConnection!
  
  # Get unique sets for filtering
  availableSets: [String!]!
  
  # Order queries
  order(id: ID!): Order
  myOrders(pagination: PaginationInput): [Order!]!
  
  # Admin queries
  allOrders(
    status: OrderStatus
    pagination: PaginationInput
  ): [Order!]! @requireAdmin
}

# Mutation Root
type Mutation {
  # Card management (Admin only)
  createCard(input: CreateCardInput!): Card! @requireAdmin
  updateCard(id: ID!, input: UpdateCardInput!): Card! @requireAdmin
  deleteCard(id: ID!): Boolean! @requireAdmin
  
  # Inventory management (Admin only)
  addCardInventory(
    cardId: ID!
    inventory: CardInventoryInput!
  ): CardInventory! @requireAdmin
  
  updateCardInventory(
    input: UpdateInventoryInput!
  ): CardInventory! @requireAdmin
  
  deleteCardInventory(id: ID!): Boolean! @requireAdmin
  
  # Order mutations
  createOrder(input: CreateOrderInput!): Order! @requireAuth
  updateOrderStatus(
    id: ID!
    status: OrderStatus!
  ): Order! @requireAdmin
  
  cancelOrder(id: ID!): Order! @requireAuth
}

# Custom directives
directive @requireAuth on FIELD_DEFINITION
directive @requireAdmin on FIELD_DEFINITION
```

## Resolver Implementation

### Query Resolvers

```typescript
// lib/graphql/resolvers/Query.ts
import { prisma } from '@/lib/prisma'
import { GraphQLError } from 'graphql'

export const Query = {
  me: async (_: any, __: any, context: Context) => {
    return context.user
  },

  card: async (_: any, { id }: { id: string }) => {
    const card = await prisma.card.findUnique({
      where: { id },
      include: {
        inventoryItems: true,
      },
    })

    if (!card) {
      throw new GraphQLError('Card not found', {
        extensions: { code: 'NOT_FOUND' },
      })
    }

    return card
  },

  cards: async (
    _: any,
    {
      filters,
      sort,
      pagination,
    }: {
      filters?: CardFilters
      sort?: CardSort
      pagination?: PaginationInput
    }
  ) => {
    const where = buildCardWhereClause(filters)
    const orderBy = buildCardOrderBy(sort)

    const take = pagination?.first || 20
    const skip = pagination?.after ? 1 : 0

    const [cards, totalCount] = await Promise.all([
      prisma.card.findMany({
        where,
        orderBy,
        take: take + 1, // Fetch one extra to check if there's a next page
        skip,
        cursor: pagination?.after ? { id: pagination.after } : undefined,
        include: {
          inventoryItems: {
            where: filters?.inStockOnly ? { quantity: { gt: 0 } } : undefined,
          },
        },
      }),
      prisma.card.count({ where }),
    ])

    const hasNextPage = cards.length > take
    const edges = (hasNextPage ? cards.slice(0, -1) : cards).map((card) => ({
      node: card,
      cursor: card.id,
    }))

    return {
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: !!pagination?.after,
        startCursor: edges[0]?.cursor,
        endCursor: edges[edges.length - 1]?.cursor,
      },
      totalCount,
    }
  },

  availableSets: async () => {
    const sets = await prisma.card.findMany({
      select: { set: true },
      distinct: ['set'],
      orderBy: { set: 'asc' },
    })
    return sets.map((s) => s.set)
  },

  myOrders: async (_: any, { pagination }: any, context: Context) => {
    if (!context.user) {
      throw new GraphQLError('Not authenticated', {
        extensions: { code: 'UNAUTHENTICATED' },
      })
    }

    return prisma.order.findMany({
      where: { userId: context.user.id },
      orderBy: { createdAt: 'desc' },
      take: pagination?.first || 10,
      include: {
        orderItems: {
          include: {
            cardInventory: {
              include: { card: true },
            },
          },
        },
      },
    })
  },

  allOrders: async (
    _: any,
    { status, pagination }: any,
    context: Context
  ) => {
    if (context.user?.role !== 'ADMIN') {
      throw new GraphQLError('Admin access required', {
        extensions: { code: 'FORBIDDEN' },
      })
    }

    return prisma.order.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: pagination?.first || 20,
      include: {
        user: true,
        orderItems: {
          include: {
            cardInventory: {
              include: { card: true },
            },
          },
        },
      },
    })
  },
}
```

### Mutation Resolvers

```typescript
// lib/graphql/resolvers/Mutation.ts
export const Mutation = {
  createCard: async (_: any, { input }: any, context: Context) => {
    requireAdmin(context)

    const card = await prisma.card.create({
      data: {
        name: input.name,
        imageUrl: input.imageUrl,
        rarity: input.rarity,
        set: input.set,
        cardNumber: input.cardNumber,
        description: input.description,
        inventoryItems: {
          create: input.inventory.map((inv: any) => ({
            condition: inv.condition,
            price: inv.price,
            quantity: inv.quantity,
          })),
        },
      },
      include: {
        inventoryItems: true,
      },
    })

    return card
  },

  updateCardInventory: async (_: any, { input }: any, context: Context) => {
    requireAdmin(context)

    const inventory = await prisma.cardInventory.update({
      where: { id: input.id },
      data: {
        price: input.price,
        quantity: input.quantity,
      },
      include: {
        card: true,
      },
    })

    return inventory
  },

  createOrder: async (_: any, { input }: any, context: Context) => {
    if (!context.user) {
      throw new GraphQLError('Authentication required', {
        extensions: { code: 'UNAUTHENTICATED' },
      })
    }

    // Validate inventory availability
    for (const item of input.items) {
      const inventory = await prisma.cardInventory.findUnique({
        where: { id: item.cardInventoryId },
      })

      if (!inventory || inventory.quantity < item.quantity) {
        throw new GraphQLError('Insufficient stock', {
          extensions: { code: 'INSUFFICIENT_STOCK' },
        })
      }
    }

    // Calculate total
    const inventoryItems = await prisma.cardInventory.findMany({
      where: {
        id: { in: input.items.map((item: any) => item.cardInventoryId) },
      },
    })

    const totalAmount = input.items.reduce((sum: number, item: any) => {
      const inventory = inventoryItems.find((inv) => inv.id === item.cardInventoryId)
      return sum + (inventory?.price.toNumber() || 0) * item.quantity
    }, 0)

    // Create order and decrement inventory in transaction
    const order = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: context.user!.id,
          orderNumber: generateOrderNumber(),
          status: 'CONFIRMED',
          totalAmount,
          shippingAddress: input.shippingAddress,
          orderItems: {
            create: input.items.map((item: any) => {
              const inventory = inventoryItems.find(
                (inv) => inv.id === item.cardInventoryId
              )
              return {
                cardInventoryId: item.cardInventoryId,
                quantity: item.quantity,
                priceAtPurchase: inventory!.price,
              }
            }),
          },
        },
        include: {
          orderItems: {
            include: {
              cardInventory: {
                include: { card: true },
              },
            },
          },
        },
      })

      // Decrement inventory
      for (const item of input.items) {
        await tx.cardInventory.update({
          where: { id: item.cardInventoryId },
          data: {
            quantity: { decrement: item.quantity },
          },
        })
      }

      return order
    })

    return order
  },
}
```

### Field Resolvers

```typescript
// lib/graphql/resolvers/Card.ts
export const Card = {
  availableInventory: (parent: any) => {
    return parent.inventoryItems?.filter((item: any) => item.quantity > 0) || []
  },

  allInventory: (parent: any) => {
    return parent.inventoryItems || []
  },

  minPrice: (parent: any) => {
    const prices = parent.inventoryItems
      ?.filter((item: any) => item.quantity > 0)
      .map((item: any) => item.price.toNumber())
    return prices?.length ? Math.min(...prices) : null
  },

  maxPrice: (parent: any) => {
    const prices = parent.inventoryItems
      ?.filter((item: any) => item.quantity > 0)
      .map((item: any) => item.price.toNumber())
    return prices?.length ? Math.max(...prices) : null
  },
}

// lib/graphql/resolvers/CardInventory.ts
export const CardInventory = {
  isInStock: (parent: any) => parent.quantity > 0,
  
  card: async (parent: any) => {
    return prisma.card.findUnique({
      where: { id: parent.cardId },
    })
  },
}

// lib/graphql/resolvers/OrderItem.ts
export const OrderItem = {
  subtotal: (parent: any) => {
    return parent.priceAtPurchase.toNumber() * parent.quantity
  },
}
```

## Helper Functions

```typescript
// lib/graphql/utils.ts
function buildCardWhereClause(filters?: CardFilters) {
  const where: any = {}

  if (filters?.search) {
    where.name = {
      contains: filters.search,
      mode: 'insensitive',
    }
  }

  if (filters?.set) {
    where.set = filters.set
  }

  if (filters?.rarity) {
    where.rarity = filters.rarity
  }

  // Filter by inventory conditions
  if (filters?.condition || filters?.minPrice || filters?.maxPrice || filters?.inStockOnly) {
    where.inventoryItems = {
      some: {
        ...(filters.condition && { condition: filters.condition }),
        ...(filters.minPrice && { price: { gte: filters.minPrice } }),
        ...(filters.maxPrice && { price: { lte: filters.maxPrice } }),
        ...(filters.inStockOnly && { quantity: { gt: 0 } }),
      },
    }
  }

  return where
}

function buildCardOrderBy(sort?: CardSort) {
  if (!sort) return { name: 'asc' }

  switch (sort.field) {
    case 'NAME':
      return { name: sort.order.toLowerCase() }
    case 'CREATED_AT':
      return { createdAt: sort.order.toLowerCase() }
    case 'RARITY':
      return { rarity: sort.order.toLowerCase() }
    default:
      return { name: 'asc' }
  }
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `PKM-${timestamp}-${random}`
}

function requireAdmin(context: Context) {
  if (!context.user) {
    throw new GraphQLError('Not authenticated', {
      extensions: { code: 'UNAUTHENTICATED' },
    })
  }

  if (context.user.role !== 'ADMIN') {
    throw new GraphQLError('Admin access required', {
      extensions: { code: 'FORBIDDEN' },
    })
  }
}
```

## Apollo Server Setup

```typescript
// app/api/graphql/route.ts
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { typeDefs } from '@/lib/graphql/schema'
import { resolvers } from '@/lib/graphql/resolvers'
import { createContext } from '@/lib/graphql/context'

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = startServerAndCreateNextHandler(server, {
  context: createContext,
})

export { handler as GET, handler as POST }
```

## Context Creation

```typescript
// lib/graphql/context.ts
import { auth } from '@/lib/auth'

export type Context = {
  user: {
    id: string
    email: string
    role: string
  } | null
}

export async function createContext(): Promise<Context> {
  const session = await auth()

  return {
    user: session?.user
      ? {
          id: session.user.id!,
          email: session.user.email!,
          role: session.user.role || 'CUSTOMER',
        }
      : null,
  }
}
```

This API design provides a flexible, type-safe interface for managing the Pokémon card inventory with its unique condition-based system while maintaining clean separation between user and admin operations.