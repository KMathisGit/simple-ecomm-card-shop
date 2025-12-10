// GraphQL Client
export { apolloClient } from "./client";

// Queries
export {
  GET_CARDS,
  GET_CARD,
  GET_CARD_INVENTORY,
  GET_USER_PROFILE,
  GET_USER_ORDERS,
  GET_ORDER,
  GET_ALL_USERS,
  GET_ALL_ORDERS,
} from "./queries";

// Mutations
export {
  CREATE_ORDER,
  CREATE_CARD,
  UPDATE_CARD,
  DELETE_CARD,
  UPDATE_INVENTORY,
  DELETE_INVENTORY,
} from "./mutations";

// Context and Schema (for server-side use)
export { createContext } from "./context";
export { typeDefs } from "./schema";
export { resolvers } from "./resolvers";
