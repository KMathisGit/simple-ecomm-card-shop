import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface GraphQLContext {
  prisma: PrismaClient;
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
}

export async function createContext(request: Request): Promise<GraphQLContext> {
  const session = await auth();

  return {
    prisma,
    user: session?.user
      ? {
          id: session.user.id,
          email: session.user.email!,
          role: session.user.role || "CUSTOMER",
        }
      : null,
  };
}
