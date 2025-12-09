# Authentication Guide - Pokémon Card Store

## Overview

The application uses NextAuth.js v5 (Auth.js) for authentication with Google OAuth as the primary sign-in method. Authentication is required for checkout and order history, while browsing is available to anonymous users.

## Authentication Flow

### Anonymous User Flow

1. User browses products and adds items to cart (stored in localStorage)
2. User attempts to checkout
3. User is redirected to sign-in page
4. After successful authentication, user is redirected back to checkout
5. Cart data persists through the authentication process

### Authenticated User Flow

1. User signs in with Google OAuth
2. Session is created and stored
3. User can complete checkout
4. User can view order history
5. On logout, cart is cleared from localStorage

## NextAuth.js Configuration

```typescript
// lib/auth.ts
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = user.role || 'CUSTOMER'
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Check if user exists and update role if needed
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })

      if (!existingUser && user.email) {
        // Create user with default role
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            role: 'CUSTOMER',
          },
        })
      }

      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
})
```

## API Route Handlers

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
```

## Sign-In Page

```tsx
// app/(auth)/auth/signin/page.tsx
'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Chrome } from 'lucide-react'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl })
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Sign in to complete your purchase and view order history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Chrome className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>
          
          <p className="mt-6 text-center text-sm text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

## Protected Routes

### Middleware for Route Protection

```typescript
// middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth

  // Protect checkout routes
  if (pathname.startsWith('/checkout') && !isAuthenticated) {
    return NextResponse.redirect(
      new URL(`/auth/signin?callbackUrl=${pathname}`, req.url)
    )
  }

  // Protect order routes
  if (pathname.startsWith('/orders') && !isAuthenticated) {
    return NextResponse.redirect(
      new URL('/auth/signin?callbackUrl=/orders', req.url)
    )
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }
    
    if (req.auth?.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/checkout/:path*', '/orders/:path*', '/admin/:path*'],
}
```

### Server-Side Auth Check

```tsx
// app/(shop)/checkout/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'

export default async function CheckoutPage() {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin?callbackUrl=/checkout')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <CheckoutForm />
    </div>
  )
}
```

## Admin Access Control

### Admin Layout Protection

```tsx
// app/admin/layout.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/layout/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/unauthorized')
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
```

### GraphQL Admin Directives

```typescript
// lib/graphql/directives.ts
import { GraphQLError } from 'graphql'
import { Context } from './context'

export function requireAuth(context: Context) {
  if (!context.user) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' },
    })
  }
}

export function requireAdmin(context: Context) {
  if (!context.user) {
    throw new GraphQLError('Authentication required', {
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

## Client-Side Authentication

### Auth Provider

```tsx
// components/providers/AuthProvider.tsx
'use client'

import { SessionProvider } from 'next-auth/react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

### Root Layout

```tsx
// app/layout.tsx
import { AuthProvider } from '@/components/providers/AuthProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
```

### User Menu Component

```tsx
// components/layout/UserMenu.tsx
'use client'

import { useSession, signOut } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { LogOut, Package, Settings, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/stores/cart'

export function UserMenu() {
  const { data: session } = useSession()
  const router = useRouter()
  const clearCart = useCartStore(state => state.clearCart)

  const handleSignOut = async () => {
    // Clear cart on logout
    clearCart()
    await signOut({ callbackUrl: '/' })
  }

  if (!session) {
    return (
      <Button asChild variant="default">
        <Link href="/auth/signin">Sign In</Link>
      </Button>
    )
  }

  const initials = session.user.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '??'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{session.user.name}</p>
            <p className="text-xs text-muted-foreground">{session.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/orders" className="cursor-pointer">
            <Package className="mr-2 h-4 w-4" />
            My Orders
          </Link>
        </DropdownMenuItem>
        {session.user.role === 'ADMIN' && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="cursor-pointer">
              <Shield className="mr-2 h-4 w-4" />
              Admin Panel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Cart Persistence on Login

```tsx
// lib/hooks/useAuthSync.ts
'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/lib/stores/cart'

export function useAuthSync() {
  const { data: session, status } = useSession()
  const clearCart = useCartStore(state => state.clearCart)

  useEffect(() => {
    // Clear cart when user signs out
    if (status === 'unauthenticated') {
      clearCart()
    }
  }, [status, clearCart])
}
```

## Environment Variables

```bash
# .env.local

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-in-production"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pokemon_cards"
```

## Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure OAuth consent screen
6. Set Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret to `.env.local`

## TypeScript Types

```typescript
// types/next-auth.d.ts
import 'next-auth'
import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: UserRole
    }
  }

  interface User {
    role: UserRole
  }
}
```

## Testing Authentication

### Manual Testing Checklist

- [ ] Anonymous user can browse products
- [ ] Anonymous user can add items to cart
- [ ] Cart persists in localStorage
- [ ] Checkout redirects to sign-in
- [ ] Sign-in with Google works
- [ ] After sign-in, user returns to checkout
- [ ] Cart data persists after login
- [ ] Order can be placed after authentication
- [ ] Order history is accessible
- [ ] Sign-out clears cart
- [ ] Admin routes are protected
- [ ] Non-admin users cannot access admin panel

This authentication system provides a secure, user-friendly way to handle user sessions while maintaining cart data and protecting sensitive routes.
