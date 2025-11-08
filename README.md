# Pokédex 2025

A modern, full-stack Pokédex application built with Next.js 15, featuring user authentication, trainer profiles, and personal Pokémon collections.

## 🎬 Showcase

<!-- Add your demo GIF here -->
![App Demo](https://github.com/user-attachments/assets/cf3ac9dc-1f49-4099-b926-264c2f36404b)

### Key Features in Action


<!-- Add feature-specific GIFs or screenshots here -->

| Feature | Preview |
|---------|---------|
| Authentication Flow | ![Auth Demo](./public/auth-demo.gif) |
| Pokémon Search & Filter | ![Search Demo](./public/search-demo.gif) |
| Personal Pokédx Management | ![Pokedex Demo](./public/pokedex-demo.gif) |
| Trainer Profile | ![Trainer Demo](./public/trainer-demo.gif) |

## Features

### 🔐 User Authentication
- Email-based signup and login system
- Email verification through Resend service
- Secure password hashing with bcryptjs
- Protected routes and user sessions with NextAuth

### 👤 Trainer Management
- Create and manage trainer profiles
- Personal Pokédex for each trainer
- Dynamic trainer pages with custom routing

### 🐾 Pokémon Features
- Browse and search Pokémon using the PokéAPI
- Filter Pokémon by various criteria
- Add/remove Pokémon to your personal Pokédex
- View detailed Pokémon information and artwork
- Toast notifications for user actions

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Dark/light theme support with next-themes
- Accessible components using Radix UI
- Smooth animations and transitions
- Clean, intuitive interface

## Tech Stack

### Frontend
- **Next.js 15** - App Router with server-side rendering
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend & Database
- **Next.js API Routes** - Serverless functions
- **MongoDB** - Document database with Mongoose ODM
- **NextAuth** - Authentication library
- **Resend** - Email delivery service

### Data & State Management
- **TanStack React Query** - Data fetching and caching
- **pokenode-ts** - TypeScript wrapper for PokéAPI
- **React Hook Form** - Form management
- **Zod** - Runtime type validation

### Developer Experience
- **ESLint** - Code linting
- **Turbopack** - Fast development server
- **TypeScript** - Static type checking

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended package manager)
- MongoDB database (local or cloud)
- Email service credentials (Resend)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pokedex-2025
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
```

4. Start the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint for code linting

## Project Structure

```
pokedex-2025/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── trainer/           # Trainer pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── models/                # MongoDB models
└── public/                # Static assets
```

## Key Features Walkthrough

### Authentication Flow
1. Users can sign up with email and password
2. Email verification is sent via Resend
3. After verification, users can log in
4. Protected routes ensure authenticated access

### Pokémon Management
1. Browse Pokémon from the PokéAPI
2. Use search and filters to find specific Pokémon
3. Add Pokémon to your personal Pokédex
4. Remove Pokémon from your collection
5. View your complete Pokédex collection

### Trainer Profiles
1. Create a trainer profile after authentication
2. Access your personal Pokédex
3. Manage your Pokémon collection
4. View trainer-specific pages

## API Integration

This application integrates with:
- **PokéAPI** - For Pokémon data and images
- **Resend** - For email verification and notifications

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [PokéAPI](https://pokeapi.co/) for providing comprehensive Pokémon data
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
