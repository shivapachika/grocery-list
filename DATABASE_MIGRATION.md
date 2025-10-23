# Database Migration Guide

This document explains how to set up the new normalized database schema for the grocery list app.

## Important Note

**The old database structure stored items as a JSON array in a single column. The new structure uses normalized tables with proper relationships. You will need to migrate your existing data.**

## 1. Create New Tables in Supabase

Go to your Supabase SQL Editor and run the following commands:

### Create Categories Table

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index
CREATE INDEX idx_categories_name ON categories(name);
```

### Create Stores Table

```sql
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index
CREATE INDEX idx_stores_name ON stores(name);
```

### Create Items Table

```sql
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity NUMERIC DEFAULT 1,
  unit TEXT DEFAULT 'pcs',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  completed BOOLEAN DEFAULT FALSE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_items_list_id ON items(list_id);
CREATE INDEX idx_items_store_id ON items(store_id);
CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_items_position ON items(list_id, position);
```

### Modify Lists Table

```sql
-- Remove the items column from the lists table
ALTER TABLE lists DROP COLUMN IF EXISTS items;
```

## 2. Seed Default Data

Insert default categories:

```sql
INSERT INTO categories (name, color) VALUES
  ('Fruits & Vegetables', 'green.500'),
  ('Dairy & Eggs', 'blue.500'),
  ('Meat & Seafood', 'red.500'),
  ('Pantry & Dry Goods', 'yellow.500'),
  ('Beverages', 'purple.500'),
  ('Frozen Foods', 'cyan.500'),
  ('Bakery', 'orange.500'),
  ('Snacks', 'pink.500'),
  ('Household', 'teal.500'),
  ('Personal Care', 'indigo.500');
```

Insert default stores:

```sql
INSERT INTO stores (name, color) VALUES
  ('HEB', 'red.500'),
  ('Costco', 'blue.500'),
  ('Indian Stores', 'orange.500'),
  ('Walmart', 'blue.400'),
  ('Whole Foods', 'green.500'),
  ('Trader Joes', 'red.400'),
  ('Target', 'red.600');
```

## 3. Data Migration (Optional)

If you have existing data in the old format, you'll need to migrate it. Here's a sample migration script:

```sql
-- This is a reference migration script
-- You'll need to customize it based on your actual data structure

DO $$
DECLARE
  list_record RECORD;
  item_record JSONB;
  cat_id UUID;
  store_id UUID;
  pos INTEGER;
BEGIN
  -- Loop through each list
  FOR list_record IN SELECT id, items FROM lists WHERE items IS NOT NULL LOOP
    pos := 0;

    -- Loop through items in the JSON array
    FOR item_record IN SELECT * FROM jsonb_array_elements(list_record.items) LOOP
      -- Find matching category and store (you'll need to map old IDs to new UUIDs)
      -- This is an example - adjust based on your actual data

      SELECT id INTO cat_id FROM categories WHERE name ILIKE '%' || (item_record->>'category')::text || '%' LIMIT 1;
      SELECT id INTO store_id FROM stores WHERE name ILIKE '%' || (item_record->>'store')::text || '%' LIMIT 1;

      -- Insert the item
      INSERT INTO items (
        list_id,
        name,
        quantity,
        unit,
        category_id,
        store_id,
        completed,
        position
      ) VALUES (
        list_record.id,
        item_record->>'name',
        COALESCE((item_record->>'quantity')::numeric, 1),
        COALESCE(item_record->>'unit', 'pcs'),
        cat_id,
        store_id,
        COALESCE((item_record->>'completed')::boolean, false),
        pos
      );

      pos := pos + 1;
    END LOOP;
  END LOOP;
END $$;
```

## 4. Enable Row Level Security (RLS) (Optional but Recommended)

If you plan to add authentication later:

```sql
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations (you can restrict this later with auth)
CREATE POLICY "Allow all operations on categories" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all operations on stores" ON stores FOR ALL USING (true);
CREATE POLICY "Allow all operations on lists" ON lists FOR ALL USING (true);
CREATE POLICY "Allow all operations on items" ON items FOR ALL USING (true);
```

## 5. Clean Up Old Data (After Migration)

Once you've verified the migration worked:

```sql
-- Remove the old items column from lists
ALTER TABLE lists DROP COLUMN IF EXISTS items;
```

## Testing

After migration:

1. Verify all lists are present
2. Verify all items are in the items table
3. Test creating new items
4. Test updating items
5. Test deleting items
6. Test the relationships work correctly

## Rollback Plan

Before running migration:

1. Take a backup of your database
2. Test migration on a copy first
3. Keep the old items column until you verify everything works
