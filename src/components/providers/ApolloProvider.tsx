"use client";

import { ApolloProvider as ApolloProviderReact } from "@apollo/client/react";
import { apolloClient } from "@/lib/graphql/client";
import { ReactNode } from "react";

interface ApolloProviderWrapperProps {
  children: ReactNode;
}

export function ApolloProviderWrapper({
  children,
}: ApolloProviderWrapperProps) {
  return (
    <ApolloProviderReact client={apolloClient}>{children}</ApolloProviderReact>
  );
}
