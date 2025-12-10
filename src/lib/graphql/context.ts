import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import Google from "next-auth/providers/google";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

export interface GraphQLContext {
  prisma: PrismaClient;
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
}

export async function createContext(request: Request): Promise<GraphQLContext> {
  const session = await getServerSession(authConfig);

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
