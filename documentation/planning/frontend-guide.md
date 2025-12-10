# Frontend Development Guide - Pokémon Card Store

## Overview

The frontend is built with Next.js 16 App Router, TypeScript, Shadcn/UI components, and Tailwind CSS. This guide covers the component architecture, state management, and implementation patterns specific to the Pokémon card store.

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── auth/
│   │       ├── signin/
│   │       │   └── page.tsx
│   │       └── error/
│   │           └── page.tsx
│   ├── (shop)/
│   │   ├── page.tsx                    # Homepage
│   │   ├── search/
│   │   │   └── page.tsx                # Search results
│   │   ├── cards/
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Card detail page
│   │   ├── cart/
│   │   │   └── page.tsx                # Shopping cart
│   │   ├── checkout/
│   │   │   ├── page.tsx                # Checkout form
│   │   │   └── success/
│   │   │       └── page.tsx            # Order confirmation
│   │   └── orders/
│   │       ├── page.tsx                # Order history
│   │       └── [id]/
│   │           └── page.tsx            # Order details
│   ├── admin/
│   │   ├── layout.tsx                  # Admin layout with protection
│   │   ├── page.tsx                    # Admin dashboard
│   │   ├── cards/
│   │   │   ├── page.tsx                # Card management list
│   │   │   ├── new/
│   │   │   │   └── page.tsx            # Add new card
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx        # Edit card
│   │   └── orders/
│   │       ├── page.tsx                # All orders
│   │       └── [id]/
│   │           └── page.tsx            # Order details
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts            # NextAuth handlers
│   │   └── graphql/
│   │       └── route.ts                # GraphQL endpoint
│   ├── layout.tsx                      # Root layout
│   └── page.tsx                        # Landing page (redirects to shop)
├── components/
│   ├── ui/                             # Shadcn components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── separator.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── AdminSidebar.tsx
│   ├── product/
│   │   ├── CardGrid.tsx
│   │   ├── CardItem.tsx
│   │   ├── CardDetail.tsx
│   │   ├── ConditionSelector.tsx
│   │   └── PriceDisplay.tsx
│   ├── cart/
│   │   ├── CartButton.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── SearchFilters.tsx
│   │   └── SearchResults.tsx
│   ├── checkout/
│   │   ├── CheckoutForm.tsx
│   │   ├── ShippingForm.tsx
│   │   └── OrderSummary.tsx
│   ├── admin/
│   │   ├── CardForm.tsx
│   │   ├── InventoryManager.tsx
│   │   └── OrdersList.tsx
│   └── providers/
│       ├── ApolloProvider.tsx
│       └── AuthProvider.tsx
├── lib/
│   ├── graphql/
│   │   ├── client.ts                   # Apollo Client setup
│   │   ├── queries.ts                  # GraphQL queries
│   │   └── mutations.ts                # GraphQL mutations
│   ├── stores/
│   │   └── cart.ts                     # Zustand cart store
│   ├── hooks/
│   │   ├── useCards.ts
│   │   ├── useCart.ts
│   │   ├── useOrders.ts
│   │   └── useAuth.ts
│   ├── utils/
│   │   ├── cn.ts                       # Class name utility
│   │   ├── format.ts                   # Formatting helpers
│   │   └── validators.ts               # Input validation
│   ├── auth.ts                         # NextAuth configuration
│   ├── prisma.ts                       # Prisma client
│   └── constants.ts                    # App constants
├── types/
│   ├── index.ts                        # Shared types
│   ├── card.ts                         # Card types
│   ├── cart.ts                         # Cart types
│   └── order.ts                        # Order types
└── styles/
    └── globals.css                     # Global styles
```

## Key Components

### 1. Card Display Components

#### CardItem Component

```tsx
// components/product/CardItem.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils/format'

interface CardItemProps {
  card: {
    id: string
    name: string
    imageUrl: string
    rarity: string
    set: string
    minPrice?: number
    maxPrice?: number
    availableInventory: Array<{
      condition: string
      quantity: number
    }>
  }
}

export function CardItem({ card }: CardItemProps) {
  const inStock = card.availableInventory.length > 0

  return (
    <Link href={`/cards/${card.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
            <Image
              src={card.imageUrl}
              alt={card.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            {!inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 p-4">
          <div className="flex w-full items-start justify-between">
            <h3 className="font-semibold text-lg">{card.name}</h3>
            <Badge variant="secondary">{card.rarity}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{card.set}</p>
          {card.minPrice && card.maxPrice && (
            <div className="flex w-full items-center justify-between">
              <span className="text-sm font-medium">
                {card.minPrice === card.maxPrice
                  ? formatPrice(card.minPrice)
                  : `${formatPrice(card.minPrice)} - ${formatPrice(card.maxPrice)}`}
              </span>
              <span className="text-xs text-muted-foreground">
                {card.availableInventory.length} condition{card.availableInventory.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
```

#### ConditionSelector Component

```tsx
// components/product/ConditionSelector.tsx
'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils/format'

interface ConditionOption {
  id: string
  condition: string
  price: number
  quantity: number
}

interface ConditionSelectorProps {
  inventory: ConditionOption[]
  onSelect: (inventoryId: string, condition: string, price: number) => void
}

export function ConditionSelector({ inventory, onSelect }: ConditionSelectorProps) {
  const [selected, setSelected] = useState<string>(inventory[0]?.id || '')

  const handleSelect = (value: string) => {
    setSelected(value)
    const item = inventory.find(i => i.id === value)
    if (item) {
      onSelect(item.id, item.condition, item.price)
    }
  }

  const selectedItem = inventory.find(i => i.id === selected)

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Card Condition</label>
        <Select value={selected} onValueChange={handleSelect}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {inventory.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                <div className="flex items-center justify-between w-full gap-4">
                  <span>{item.condition}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatPrice(item.price)}</span>
                    <Badge variant={item.quantity > 10 ? 'default' : 'secondary'} className="text-xs">
                      {item.quantity} left
                    </Badge>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedItem && (
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Selected Price</p>
            <p className="text-2xl font-bold">{formatPrice(selectedItem.price)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">In Stock</p>
            <p className="text-xl font-semibold">{selectedItem.quantity}</p>
          </div>
        </div>
      )}
    </div>
  )
}
```

### 2. Cart Components

#### Cart Store (Zustand)

```tsx
// lib/stores/cart.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  cardInventoryId: string
  cardId: string
  cardName: string
  cardImage: string
  condition: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (cardInventoryId: string) => void
  updateQuantity: (cardInventoryId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        const items = get().items
        const existingItem = items.find(i => i.cardInventoryId === item.cardInventoryId)

        if (existingItem) {
          set({
            items: items.map(i =>
              i.cardInventoryId === item.cardInventoryId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          })
        } else {
          set({ items: [...items, { ...item, quantity }] })
        }
      },

      removeItem: (cardInventoryId) => {
        set({
          items: get().items.filter(i => i.cardInventoryId !== cardInventoryId),
        })
      },

      updateQuantity: (cardInventoryId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cardInventoryId)
          return
        }

        set({
          items: get().items.map(i =>
            i.cardInventoryId === cardInventoryId ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'pokemon-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

#### CartButton Component

```tsx
// components/cart/CartButton.tsx
'use client'

import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/lib/stores/cart'
import { useState } from 'react'
import { CartDrawer } from './CartDrawer'

export function CartButton() {
  const [open, setOpen] = useState(false)
  const itemCount = useCartStore(state => state.getItemCount())

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setOpen(true)}
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {itemCount}
          </Badge>
        )}
      </Button>
      <CartDrawer open={open} onOpenChange={setOpen} />
    </>
  )
}
```

### 3. Search and Filter Components

#### SearchBar Component

```tsx
// components/search/SearchBar.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for Pokémon cards..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  )
}
```

#### SearchFilters Component

```tsx
// components/search/SearchFilters.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { formatPrice } from '@/lib/utils/format'

interface SearchFiltersProps {
  availableSets: string[]
}

export function SearchFilters({ availableSets }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [set, setSet] = useState(searchParams.get('set') || '')
  const [condition, setCondition] = useState(searchParams.get('condition') || '')
  const [priceRange, setPriceRange] = useState([0, 1000])

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (set) params.set('set', set)
    else params.delete('set')
    
    if (condition) params.set('condition', condition)
    else params.delete('condition')
    
    params.set('minPrice', priceRange[0].toString())
    params.set('maxPrice', priceRange[1].toString())

    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    setSet('')
    setCondition('')
    setPriceRange([0, 1000])
    router.push('/search')
  }

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <div>
        <Label>Set</Label>
        <Select value={set} onValueChange={setSet}>
          <SelectTrigger>
            <SelectValue placeholder="All Sets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Sets</SelectItem>
            {availableSets.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Condition</Label>
        <Select value={condition} onValueChange={setCondition}>
          <SelectTrigger>
            <SelectValue placeholder="Any Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Condition</SelectItem>
            <SelectItem value="MINT">Mint</SelectItem>
            <SelectItem value="NEAR_MINT">Near Mint</SelectItem>
            <SelectItem value="EXCELLENT">Excellent</SelectItem>
            <SelectItem value="GOOD">Good</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</Label>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mt-2"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex-1">Apply Filters</Button>
        <Button onClick={clearFilters} variant="outline">Clear</Button>
      </div>
    </div>
  )
}
```

### 4. Checkout Components

#### CheckoutForm Component

```tsx
// components/checkout/CheckoutForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useCartStore } from '@/lib/stores/cart'
import { CREATE_ORDER } from '@/lib/graphql/mutations'
import { ShippingForm } from './ShippingForm'
import { OrderSummary } from './OrderSummary'
import { toast } from 'sonner'

const checkoutSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  country: z.string().default('USA'),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export function CheckoutForm() {
  const router = useRouter()
  const { items, clearCart, getTotal } = useCartStore()
  const [createOrder, { loading }] = useMutation(CREATE_ORDER)

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: 'USA',
    },
  })

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const { data: orderData } = await createOrder({
        variables: {
          input: {
            items: items.map(item => ({
              cardInventoryId: item.cardInventoryId,
              quantity: item.quantity,
            })),
            shippingAddress: data,
          },
        },
      })

      // Clear cart on successful order
      clearCart()

      // Redirect to success page
      router.push(`/checkout/success?order=${orderData.createOrder.orderNumber}`)
      toast.success('Order placed successfully!')
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
      console.error(error)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Your cart is empty</p>
        <Button onClick={() => router.push('/')} className="mt-4">
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ShippingForm form={form} />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
            </Button>
          </form>
        </Form>
      </div>
      <div>
        <OrderSummary items={items} total={getTotal()} />
      </div>
    </div>
  )
}
```

## GraphQL Client Setup

```tsx
// lib/graphql/client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: '/api/graphql',
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    },
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
```

## Custom Hooks

```tsx
// lib/hooks/useCards.ts
import { useQuery } from '@apollo/client'
import { GET_CARDS, GET_CARD } from '@/lib/graphql/queries'

export function useCards(filters?: any) {
  return useQuery(GET_CARDS, {
    variables: { filters },
  })
}

export function useCard(id: string) {
  return useQuery(GET_CARD, {
    variables: { id },
  })
}
```

## Utility Functions

```typescript
// lib/utils/format.ts
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export function formatCondition(condition: string): string {
  return condition
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ')
}
```

This frontend structure provides a solid foundation for building a performant, user-friendly Pokémon card e-commerce store with proper state management, component reusability, and type safety.
