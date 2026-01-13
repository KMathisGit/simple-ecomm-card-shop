import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getSession } from "next-auth/react";

const httpLink = createHttpLink({
  uri: "/api/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  // Get the session on the client side
  const session = await getSession();

  return {
    headers: {
      ...headers,
      authorization: session?.user ? `Bearer ${session.user.id}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          cards: {
            keyArgs: ["filter"],
            merge(existing = [], incoming, { args }) {
              // Prevent duplicates by using offset-based pagination
              const offset = args?.offset || 0;
              if (offset === 0) {
                return incoming;
              }
              return [...existing, ...incoming];
            },
          },
          orders: {
            keyArgs: [],
            merge(existing = [], incoming, { args }) {
              const offset = args?.offset || 0;
              if (offset === 0) {
                return incoming;
              }
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
});
