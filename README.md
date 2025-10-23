# Grocery List App

A modern, full-featured grocery list application built with React, TypeScript, Chakra UI, and Supabase.

## Features

### Core Features
- ✅ Create and manage multiple grocery lists
- ✅ Add items with quantities, categories, and stores
- ✅ Mark items as completed
- ✅ Delete individual items or entire lists
- ✅ Organize items by store for efficient shopping

### Advanced Features
- 🔍 **Search & Filter** - Search items by name and filter by store or category
- 🎯 **Bulk Actions** - Select and complete/delete multiple items at once
- 📊 **Smart Grouping** - Items automatically grouped by store
- 💾 **Cloud Sync** - Data persisted in Supabase with real-time sync
- 📱 **Responsive Design** - Works beautifully on all devices
- ⚡ **Optimistic Updates** - Instant UI feedback for better UX
- 🎨 **Modern UI** - Clean interface with Chakra UI components
- 🔒 **Error Boundaries** - Graceful error handling

## Live Demo

Visit the live demo at: [https://skgrocerylist.netlify.app](https://skgrocerylist.netlify.app)

## Setup

### Prerequisites
- Node.js 18+
- Supabase account and project

### Environment Variables
Create a `.env` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup
1. Follow the instructions in `DATABASE_MIGRATION.md` to set up your Supabase tables
2. Run the seed script to populate categories and stores (see `src/lib/utils/seed-database.ts`)

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

This app is deployed on Netlify with continuous deployment from GitHub. Any changes pushed to the main branch will automatically trigger a new deployment.

## Technologies Used

- **Frontend:** React 18, TypeScript
- **UI Framework:** Chakra UI
- **Build Tool:** Vite
- **Database:** Supabase (PostgreSQL)
- **State Management:** React Context + Custom Hooks
- **Hosting:** Netlify

## Architecture

The app follows a modern, scalable architecture:

- **Feature-based folder structure** for better organization
- **Custom hooks** for data operations (useGroceryLists, useGroceryItems, etc.)
- **Context providers** for global state management
- **Normalized database** with proper relationships
- **Type-safe** with strict TypeScript
- **Optimistic updates** for better UX

See `REFACTOR_PLAN.md` and `REFACTOR_SUMMARY.md` for detailed architecture documentation.

## Recent Refactor

This app was recently completely redesigned and refactored with:
- ✨ New normalized database schema
- ✨ Feature-based architecture
- ✨ Advanced search and filtering
- ✨ Bulk operations
- ✨ Improved error handling
- ✨ Better TypeScript types
- ✨ Enhanced UX with optimistic updates

See `REFACTOR_SUMMARY.md` for complete details.
