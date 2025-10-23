import { VStack, Box, Badge, Text } from '@chakra-ui/react';
import { GroceryItemWithRelations, Store } from '../../types';
import { ItemCard } from '../items/ItemCard';
import { EmptyState } from './EmptyState';
import { groupItemsByStore, sortItemsByPosition } from '../../lib/utils/helpers';

interface GroceryListViewProps {
  items: GroceryItemWithRelations[];
  stores: Store[];
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  selectedItems: Set<string>;
  onToggleSelection: (id: string) => void;
  showStoreFilter: boolean;
}

export function GroceryListView({
  items,
  stores,
  onToggleItem,
  onDeleteItem,
  selectedItems,
  onToggleSelection,
  showStoreFilter,
}: GroceryListViewProps) {
  if (items.length === 0) {
    return <EmptyState />;
  }

  const sortedItems = sortItemsByPosition(items);
  const itemsByStore = groupItemsByStore(sortedItems);

  const getStoreName = (storeId: string) => {
    return stores.find((s) => s.id === storeId)?.name || 'Unknown Store';
  };

  const getStoreColor = (storeId: string) => {
    return stores.find((s) => s.id === storeId)?.color || 'gray.500';
  };

  // If filtering by store, just show flat list
  if (showStoreFilter) {
    return (
      <VStack spacing={3} align="stretch" w="full">
        {sortedItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onToggle={() => onToggleItem(item.id)}
            onDelete={() => onDeleteItem(item.id)}
            isSelected={selectedItems.has(item.id)}
            onSelect={() => onToggleSelection(item.id)}
            showStore={false}
          />
        ))}
      </VStack>
    );
  }

  // Otherwise, group by store
  return (
    <VStack spacing={6} align="stretch" w="full">
      {Object.entries(itemsByStore).map(([storeId, storeItems]) => (
        <Box key={storeId}>
          <Badge
            mb={3}
            px={4}
            py={2}
            borderRadius="full"
            bg={getStoreColor(storeId)}
            color="white"
            fontSize="md"
          >
            {getStoreName(storeId)}
            <Text as="span" ml={2} opacity={0.8}>
              ({storeItems.length})
            </Text>
          </Badge>
          <VStack spacing={3} align="stretch">
            {storeItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onToggle={() => onToggleItem(item.id)}
                onDelete={() => onDeleteItem(item.id)}
                isSelected={selectedItems.has(item.id)}
                onSelect={() => onToggleSelection(item.id)}
                showStore={false}
              />
            ))}
          </VStack>
        </Box>
      ))}
    </VStack>
  );
}
