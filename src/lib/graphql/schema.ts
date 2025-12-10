import { gql } from "graphql-tag";

export const typeDefs = gql`
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

  # Types
  type User {
    id: ID!
    email: String!
    name: String
    role: UserRole!
    createdAt: String!
    updatedAt: String!
    orders: [Order!]!
  }

  type Card {
    id: ID!
    name: String!
    imageUrl: String!
    rarity: String!
    set: String!
    cardNumber: String
    description: String
    createdAt: String!
    updatedAt: String!
    inventoryItems: [CardInventory!]!
  }

  type CardInventory {
    id: ID!
    cardId: String!
    condition: CardCondition!
    price: Float!
    quantity: Int!
    createdAt: String!
    updatedAt: String!
    card: Card!
  }

  type Order {
    id: ID!
    userId: String!
    orderNumber: String!
    totalAmount: Float!
    createdAt: String!
    updatedAt: String!
    user: User!
    orderItems: [OrderItem!]!
  }

  type OrderItem {
    id: ID!
    orderId: String!
    cardInventoryId: String!
    quantity: Int!
    priceAtPurchase: Float!
    order: Order!
    cardInventory: CardInventory!
  }

  # Input types
  input CardFilter {
    name: String
    set: String
    rarity: String
    minPrice: Float
    maxPrice: Float
    condition: CardCondition
    inStock: Boolean
  }

  input CreateOrderInput {
    items: [OrderItemInput!]!
  }

  input OrderItemInput {
    cardInventoryId: ID!
    quantity: Int!
  }

  input CreateCardInput {
    name: String!
    imageUrl: String!
    rarity: String!
    set: String!
    cardNumber: String
    description: String
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
    condition: CardCondition!
    price: Float!
    quantity: Int!
  }

  # Queries
  type Query {
    # Card queries
    cards(filter: CardFilter, limit: Int, offset: Int): [Card!]!
    card(id: ID!): Card
    cardInventory(cardId: ID!): [CardInventory!]!

    # User queries
    me: User

    # Order queries
    orders(limit: Int, offset: Int): [Order!]!
    order(id: ID!): Order

    # Admin queries
    allUsers(limit: Int, offset: Int): [User!]!
    allOrders(limit: Int, offset: Int): [Order!]!
  }

  # Mutations
  type Mutation {
    # Order mutations
    createOrder(input: CreateOrderInput!): Order!

    # Admin card mutations
    createCard(input: CreateCardInput!): Card!
    updateCard(id: ID!, input: UpdateCardInput!): Card!
    deleteCard(id: ID!): Boolean!

    # Admin inventory mutations
    updateInventory(cardId: ID!, input: UpdateInventoryInput!): CardInventory!
    deleteInventory(id: ID!): Boolean!
  }
`;
