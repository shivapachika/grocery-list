import { DEFAULT_CATEGORIES, DEFAULT_STORES } from './constants';
import { createCategory } from '../supabase/categories';
import { createStore } from '../supabase/stores';

/**
 * Seed the database with default categories and stores
 * Run this once when setting up the database
 */
export async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // Seed categories
    console.log('Seeding categories...');
    for (const category of DEFAULT_CATEGORIES) {
      try {
        await createCategory(category.name, category.color);
        console.log(`Created category: ${category.name}`);
      } catch (error) {
        console.log(`Category ${category.name} might already exist, skipping...`);
      }
    }

    // Seed stores
    console.log('Seeding stores...');
    for (const store of DEFAULT_STORES) {
      try {
        await createStore(store.name, store.color);
        console.log(`Created store: ${store.name}`);
      } catch (error) {
        console.log(`Store ${store.name} might already exist, skipping...`);
      }
    }

    console.log('Database seeding completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  }
}

// Uncomment to run manually in console:
// import { seedDatabase } from './lib/utils/seed-database';
// seedDatabase();
