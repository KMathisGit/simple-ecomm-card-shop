# Pokémon Card E-Commerce Store

A modern, full-stack e-commerce web application for Pokémon cards. Built with Next.js 16, TypeScript, GraphQL, and PostgreSQL.

**Note**: This is a demonstration project. The checkout process is mocked and does not include real payment processing.

## 🎯 Project Purpose

This project is an **educational demonstration** of building a complete e-commerce platform with modern web technologies. It showcases best practices for:

- Full-stack TypeScript development
- GraphQL API design
- Database schema design with complex relationships
- Authentication and authorization
- State management
- Responsive UI design

## ✨ Key Features

- 🔍 **Product Search & Filtering** - Find cards by name, set, rarity, condition, and price range
- 🎨 **Condition-Based Pricing** - Each card can have multiple conditions (Mint, Near Mint, etc.) with individual pricing and stock levels
- 🛒 **Shopping Cart** - Add items to cart with persistent local storage
- 🔐 **OAuth Authentication** - Sign in with Google via NextAuth.js
- 💳 **Mock Checkout** - Complete checkout process with inventory management (no real payment processing)
- 📦 **Order History** - View past orders and order details
- 👨‍💼 **Admin Panel** - Manage inventory, add/edit cards, view all orders
- 📱 **Responsive Design** - Mobile-friendly interface built with Shadcn/UI

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Shadcn/UI** - Accessible component library built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management for cart
- **React Hook Form + Zod** - Form handling and validation

### Backend
- **GraphQL** - API layer with Apollo Server
- **Prisma** - Type-safe ORM for database operations
- **PostgreSQL** - Relational database
- **NextAuth.js** - Authentication with OAuth providers

### Development Tools
- **ESLint & Prettier** - Code quality and formatting
- **TypeScript** - Static type checking

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── (auth)/          # Authentication pages
│   ├── (shop)/          # Public shopping pages
│   ├── admin/           # Admin panel
│   └── api/             # API routes (GraphQL, NextAuth)
├── components/          # React components
│   ├── ui/             # Shadcn UI components
│   ├── product/        # Product-related components
│   ├── cart/           # Shopping cart components
│   └── admin/          # Admin panel components
├── lib/                # Utilities and configurations
│   ├── graphql/        # GraphQL client, queries, mutations
│   ├── stores/         # Zustand stores
│   └── hooks/          # Custom React hooks
└── types/              # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+ (or use a hosted solution like Neon)
- Google OAuth credentials (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KMathisGit/simple-ecomm-card-shop.git
   cd simple-ecomm-card-shop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/pokemon_cards"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Setup database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev --name init
   
   # Seed database with sample data
   npx prisma db seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

Comprehensive documentation is available in the `documentation/planning/` directory:

- **[project-overview.md](documentation/planning/project-overview.md)** - Project scope and requirements
- **[tech-stack.md](documentation/planning/tech-stack.md)** - Technology decisions and architecture
- **[database-schema.md](documentation/planning/database-schema.md)** - Database design and Prisma schema
- **[api-design.md](documentation/planning/api-design.md)** - GraphQL API documentation
- **[frontend-guide.md](documentation/planning/frontend-guide.md)** - Component architecture and patterns
- **[authentication.md](documentation/planning/authentication.md)** - Authentication implementation
- **[database-hosting-setup.md](documentation/planning/database-hosting-setup.md)** - Database hosting options
- **[development-workflow.md](documentation/planning/development-workflow.md)** - Build process and timeline
- **[quick-reference.md](documentation/planning/quick-reference.md)** - Quick lookup guide

## 🔑 Key Concepts

### Condition-Based Inventory

Unlike typical e-commerce stores, this application handles a unique inventory model:

- Each Pokémon card can have **multiple condition variants** (Mint, Near Mint, Good, etc.)
- Each condition has its **own price and stock quantity**
- Users select the condition on the product detail page
- Cart items reference the specific condition variant

This is implemented through separate `Card` and `CardInventory` tables in the database.

### Authentication Flow

- Anonymous users can browse and add items to cart
- Authentication required for checkout
- Cart data persists through login process
- Cart clears on logout
- Admin users have access to the admin panel

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Open Prisma Studio to inspect database
npx prisma studio
```

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open database GUI
npx prisma migrate   # Run database migrations
```


## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

This is an educational project, but contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 👨‍💻 Author

**Kevin Mathis**
- GitHub: [@KMathisGit](https://github.com/KMathisGit)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Shadcn/UI](https://ui.shadcn.com/) - Beautiful, accessible components
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [Apollo GraphQL](https://www.apollographql.com/) - GraphQL implementation

---
