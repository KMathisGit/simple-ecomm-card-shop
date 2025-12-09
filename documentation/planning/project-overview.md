# Project Overview - Pokémon Card E-Commerce Store

## Project Description

A simple e-commerce web application for buying and selling Pokémon cards. The platform allows users to browse, search, filter, and purchase Pokémon cards with different conditions and rarities.

## Core Features

### Public Features (Anonymous Users)

- **Product Catalog**: Browse Pokémon cards with images and basic information
- **Search**: Find cards by name (e.g., "Pikachu", "Charizard")
- **Filtering**: Filter results by price range, set/series, and condition
- **Product Details**: View detailed card information with condition-based pricing
- **Shopping Cart**: Add/remove items, update quantities (stored in local storage)

### Authenticated User Features

- **OAuth Login**: Sign in with Google account using NextAuth.js
- **Checkout Process**: Complete mock checkout (updates inventory)
- **Order History**: View past orders with details
- **Cart Persistence**: Cart data preserved during login flow

### Admin Features

- **Product Management**: Add, edit, delete Pokémon cards
- **Inventory Management**: Update stock quantities and conditions
- **Order Management**: View all customer orders
- **Protected Access**: Only admin-role users can access admin panel

## Key Product Details

Each Pokémon card includes:

- **Name**: Card name (e.g., "Pikachu")
- **Image**: Product image (stored locally)
- **Rarity**: Card rarity level
- **Set/Series**: Which Pokémon card set the card belongs to
- **Conditions**: Multiple condition variants per card (Mint, Near Mint, Excellent, Good, etc.)
- **Price**: Condition-dependent pricing
- **Quantity**: Stock count per condition

## Unique Product Model

The application uses a unique inventory model where:

- A single Pokémon card (e.g., "Pikachu from Base Set") can have multiple condition variants
- Each condition variant has its own price and stock quantity
- On the product detail page, users select condition from a dropdown
- Price and availability update based on selected condition
- Cart items are tied to both the card AND its condition

## Technical Requirements

### Functional Requirements

1. Anonymous users can browse and add to cart
2. Authentication required for checkout
3. Mock checkout process (no real payment)
4. Inventory decrements on successful order
5. Cart preserved during authentication flow
6. Cart cleared on logout
7. Admin panel for inventory management
8. Role-based access control

### Non-Functional Requirements

1. **Performance**: Fast search and filtering
2. **Security**: Secure authentication, protected admin routes
3. **Usability**: Intuitive UI with clear product information
4. **Responsiveness**: Mobile-friendly design
5. **Data Integrity**: Accurate inventory tracking

## User Flows

### Browse and Purchase Flow

1. User lands on homepage
2. Searches for "Pikachu"
3. Views search results showing multiple Pikachu cards from different sets
4. Clicks on a specific card
5. Selects condition from dropdown (price/quantity updates)
6. Adds to cart
7. Continues shopping or proceeds to checkout
8. Prompted to login via Google OAuth
9. Reviews order and completes mock checkout
10. Order confirmed, inventory updated

### Admin Flow

1. Admin logs in
2. Accesses admin panel
3. Adds new card with multiple conditions
4. Sets prices and quantities for each condition
5. Views and manages orders
6. Updates inventory as needed

## Success Metrics

- Smooth authentication experience
- Accurate inventory management
- Clear condition-based pricing display
- Easy admin panel usage
- Fast search and filtering

## Technology Constraints

- Next.js 15+ (App Router)
- Shadcn/UI for components
- GraphQL for API layer
- PostgreSQL for database
- NextAuth.js for OAuth authentication
- Local file storage for images
- No real payment integration (mock checkout)

## Project Scope

### In Scope

- Complete product catalog
- Search and filtering
- Shopping cart (local storage)
- OAuth authentication
- Mock checkout process
- Order history
- Admin panel
- Inventory management

### Out of Scope

- Real payment processing
- Shipping integration
- Email notifications (can be added later)
- Product reviews/ratings
- Wishlist functionality
- Advanced analytics
- Third-party image hosting
