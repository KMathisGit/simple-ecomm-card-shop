import { gql } from "@apollo/client";

export const GET_CARDS = gql`
  query GetCards($filter: CardFilter, $sort: SortInput, $limit: Int, $offset: Int) {
    cards(filter: $filter, sort: $sort, limit: $limit, offset: $offset) {
      id
      name
      imageUrl
      rarity
      set
      cardNumber
      description
      inventoryItems {
        id
        condition
        price
        quantity
      }
    }
  }
`;

export const GET_CARD = gql`
  query GetCard($id: ID!) {
    card(id: $id) {
      id
      name
      imageUrl
      rarity
      set
      cardNumber
      description
      inventoryItems {
        id
        condition
        price
        quantity
      }
    }
  }
`;

export const GET_CARD_INVENTORY = gql`
  query GetCardInventory($cardId: ID!) {
    cardInventory(cardId: $cardId) {
      id
      condition
      price
      quantity
      card {
        id
        name
        imageUrl
        rarity
        set
      }
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    me {
      id
      email
      name
      role
      orders {
        id
        orderNumber
        totalAmount
        createdAt
        orderItems {
          id
          quantity
          priceAtPurchase
          cardInventory {
            id
            condition
            card {
              id
              name
              imageUrl
              rarity
              set
            }
          }
        }
      }
    }
  }
`;

export const GET_USER_ORDERS = gql`
  query GetUserOrders($limit: Int, $offset: Int) {
    orders(limit: $limit, offset: $offset) {
      id
      orderNumber
      totalAmount
      createdAt
      orderItems {
        id
        quantity
        priceAtPurchase
        cardInventory {
          id
          condition
          card {
            id
            name
            imageUrl
            rarity
            set
          }
        }
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      orderNumber
      totalAmount
      createdAt
      orderItems {
        id
        quantity
        priceAtPurchase
        cardInventory {
          id
          condition
          card {
            id
            name
            imageUrl
            rarity
            set
          }
        }
      }
    }
  }
`;

// Admin queries
export const GET_ALL_USERS = gql`
  query GetAllUsers($limit: Int, $offset: Int) {
    allUsers(limit: $limit, offset: $offset) {
      id
      email
      name
      role
      createdAt
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query GetAllOrders($limit: Int, $offset: Int) {
    allOrders(limit: $limit, offset: $offset) {
      id
      orderNumber
      totalAmount
      createdAt
      user {
        id
        email
        name
      }
      orderItems {
        id
        quantity
        priceAtPurchase
        cardInventory {
          id
          condition
          card {
            id
            name
            imageUrl
            rarity
            set
          }
        }
      }
    }
  }
`;
