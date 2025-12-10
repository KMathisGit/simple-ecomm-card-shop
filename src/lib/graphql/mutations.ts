import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
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
    }
  }
`;

// Admin mutations for card management
export const CREATE_CARD = gql`
  mutation CreateCard($input: CreateCardInput!) {
    createCard(input: $input) {
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

export const UPDATE_CARD = gql`
  mutation UpdateCard($id: ID!, $input: UpdateCardInput!) {
    updateCard(id: $id, input: $input) {
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

export const DELETE_CARD = gql`
  mutation DeleteCard($id: ID!) {
    deleteCard(id: $id)
  }
`;

// Admin mutations for inventory management
export const UPDATE_INVENTORY = gql`
  mutation UpdateInventory($cardId: ID!, $input: UpdateInventoryInput!) {
    updateInventory(cardId: $cardId, input: $input) {
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

export const DELETE_INVENTORY = gql`
  mutation DeleteInventory($id: ID!) {
    deleteInventory(id: $id)
  }
`;
