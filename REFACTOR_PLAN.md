# Grocery List App - Complete Refactor Plan

## Current Issues

### Architecture
- 300+ lines in App.tsx handling all state
- Props drilling through multiple component layers
- Business logic mixed with presentation
- No separation of concerns

### Database
- Items stored as JSON array (not normalized)
- Using Date.now() for IDs (unreliable)
- Fetching entire lists to update single items
- No proper foreign keys or constraints

### State Management
- Duplicated state (lists + currentList)
- Manual synchronization prone to bugs
- No optimistic updates

### UX/Features
- No search or advanced filtering
- No drag-and-drop reordering
- No bulk operations
- No real-time collaboration
- Limited mobile optimization

## New Architecture

### Database Schema (Supabase)

```sql
-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stores table
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lists table
CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items table (normalized)
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity NUMERIC DEFAULT 1,
  unit TEXT DEFAULT 'pcs',
  category_id UUID REFERENCES categories(id),
  store_id UUID REFERENCES stores(id),
  completed BOOLEAN DEFAULT FALSE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_items_list_id ON items(list_id);
CREATE INDEX idx_items_store_id ON items(store_id);
CREATE INDEX idx_items_category_id ON items(category_id);
```

### Folder Structure

```
src/
├── components/
│   ├── common/              # Reusable UI components
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ConfirmDialog.tsx
│   ├── grocery-list/        # Feature: Grocery List
│   │   ├── GroceryListView.tsx
│   │   ├── GroceryItem.tsx
│   │   ├── GroceryItemSkeleton.tsx
│   │   └── EmptyState.tsx
│   ├── items/               # Feature: Items
│   │   ├── AddItemForm.tsx
│   │   ├── ItemCard.tsx
│   │   ├── BulkActions.tsx
│   │   └── SearchFilter.tsx
│   ├── lists/               # Feature: Lists
│   │   ├── ListManager.tsx
│   │   ├── ListSelector.tsx
│   │   └── CreateListModal.tsx
│   └── stores/              # Feature: Stores
│       ├── StoreFilter.tsx
│       └── StoreGroup.tsx
├── contexts/
│   ├── GroceryContext.tsx   # Global grocery state
│   ├── UIContext.tsx        # UI state (modals, toasts)
│   └── AuthContext.tsx      # Future: Auth state
├── hooks/
│   ├── useGroceryLists.ts   # Lists CRUD operations
│   ├── useGroceryItems.ts   # Items CRUD operations
│   ├── useCategories.ts     # Categories data
│   ├── useStores.ts         # Stores data
│   ├── useToast.ts          # Toast notifications
│   └── useDragDrop.ts       # Drag and drop logic
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Supabase client
│   │   ├── database.types.ts # Generated types
│   │   ├── lists.ts         # Lists queries
│   │   ├── items.ts         # Items queries
│   │   ├── categories.ts    # Categories queries
│   │   └── stores.ts        # Stores queries
│   └── utils/
│       ├── constants.ts     # App constants
│       ├── helpers.ts       # Utility functions
│       └── validators.ts    # Form validators
├── types/
│   ├── index.ts             # All app types
│   └── supabase.ts          # Supabase types
├── App.tsx                  # Main app (simplified)
└── main.tsx                 # Entry point
```

### Key Improvements

1. **Custom Hooks for Data**
   - useGroceryLists() - fetch, create, delete lists
   - useGroceryItems() - CRUD items with optimistic updates
   - useCategories() - manage categories
   - useStores() - manage stores

2. **Context Providers**
   - GroceryContext - current list, filters
   - UIContext - modals, toasts, loading states

3. **Better Components**
   - Skeleton loaders for better perceived performance
   - Error boundaries for graceful failures
   - Drag-and-drop for item reordering
   - Bulk selection and actions

4. **TypeScript Improvements**
   - Generated types from Supabase
   - Strict mode enabled
   - Proper enums and constants
   - Better type safety

5. **UX Enhancements**
   - Search and filter items
   - Drag to reorder
   - Bulk complete/delete
   - Better mobile experience
   - Keyboard shortcuts
   - Undo/redo support

6. **Performance**
   - Memoization with useMemo/useCallback
   - Lazy loading components
   - Optimistic updates
   - Debounced search

## Implementation Steps

1. ✅ Design database schema
2. Create new folder structure
3. Set up constants and types
4. Implement Supabase queries layer
5. Build custom hooks
6. Create context providers
7. Refactor components
8. Add advanced features
9. Testing and bug fixes
10. Documentation
