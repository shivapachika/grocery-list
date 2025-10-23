import { useEffect } from 'react';
import {
  Container,
  VStack,
  Heading,
  Box,
  Divider,
  Text,
  HStack,
} from '@chakra-ui/react';
import { GroceryProvider, useGroceryContext } from './contexts/GroceryContext';
import { useGroceryLists } from './hooks/useGroceryLists';
import { useGroceryItems } from './hooks/useGroceryItems';
import { useCategories } from './hooks/useCategories';
import { useStores } from './hooks/useStores';
import { ListManager } from './components/lists/ListManager';
import { AddItemForm } from './components/items/AddItemForm';
import { SearchFilter } from './components/items/SearchFilter';
import { StoreFilter } from './components/stores/StoreFilter';
import { GroceryListView } from './components/grocery-list/GroceryListView';
import { BulkActions } from './components/items/BulkActions';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { filterItems, countItemsByStore } from './lib/utils/helpers';

function AppContent() {
  const {
    currentList,
    setCurrentList,
    filters,
    selectedItems,
    toggleItemSelection,
    clearSelection,
  } = useGroceryContext();

  // Fetch data
  const { lists, isLoading: listsLoading, createList, deleteList } = useGroceryLists();
  const {
    items,
    isLoading: itemsLoading,
    addItem,
    toggleItem,
    deleteItem,
    bulkAction,
  } = useGroceryItems(currentList?.id || null);
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { stores, isLoading: storesLoading } = useStores();

  // Set first list as current if none selected
  useEffect(() => {
    if (!currentList && lists.length > 0) {
      setCurrentList(lists[0]);
    }
  }, [lists, currentList, setCurrentList]);

  // Handle list creation
  const handleCreateList = async (name: string) => {
    const newList = await createList(name);
    setCurrentList(newList);
  };

  // Handle list deletion
  const handleDeleteList = async (id: string) => {
    await deleteList(id);
    if (currentList?.id === id) {
      const remaining = lists.filter((l) => l.id !== id);
      setCurrentList(remaining[0] || null);
    }
  };

  // Filter items
  const filteredItems = filterItems(items, filters);
  const itemCountByStore = countItemsByStore(items);

  // Show loading state
  if (listsLoading || categoriesLoading || storesLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="2xl" mb={2}>
            Family Grocery List
          </Heading>
          <Text color="gray.600">
            Organize your shopping by store and category
          </Text>
        </Box>

        <Divider />

        {/* List Manager */}
        <Box>
          <Heading size="md" mb={4}>
            Manage Lists
          </Heading>
          <ListManager
            lists={lists}
            currentList={currentList}
            onSelectList={setCurrentList}
            onCreateList={handleCreateList}
            onDeleteList={handleDeleteList}
          />
        </Box>

        {currentList && (
          <>
            <Divider />

            {/* Add Item Form */}
            <Box>
              <Heading size="md" mb={4}>
                Add Item
              </Heading>
              <AddItemForm
                onAddItem={async (item) => {
                  await addItem(item);
                }}
                categories={categories}
                stores={stores}
                isLoading={itemsLoading}
              />
            </Box>

            <Divider />

            {/* Items Section */}
            <Box>
              <HStack justify="space-between" mb={4}>
                <Heading size="md">Your Items</Heading>
                <Text color="gray.600">
                  {items.length} total, {items.filter((i) => !i.completed).length} pending
                </Text>
              </HStack>

              {/* Search */}
              <SearchFilter />

              {/* Store Filter */}
              <StoreFilter stores={stores} itemCountByStore={itemCountByStore} />

              {/* Bulk Actions */}
              <BulkActions
                selectedCount={selectedItems.size}
                onBulkAction={bulkAction}
                selectedItems={selectedItems}
                onClearSelection={clearSelection}
              />

              {/* Items List */}
              {itemsLoading ? (
                <LoadingSpinner />
              ) : (
                <GroceryListView
                  items={filteredItems}
                  stores={stores}
                  onToggleItem={toggleItem}
                  onDeleteItem={deleteItem}
                  selectedItems={selectedItems}
                  onToggleSelection={toggleItemSelection}
                  showStoreFilter={!!filters.storeId}
                />
              )}
            </Box>
          </>
        )}

        {!currentList && lists.length === 0 && (
          <Box textAlign="center" py={12}>
            <Text fontSize="lg" color="gray.600">
              Create your first grocery list to get started!
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <GroceryProvider>
        <AppContent />
      </GroceryProvider>
    </ErrorBoundary>
  );
}

export default App;
