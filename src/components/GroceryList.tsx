import {
  Box,
  Checkbox,
  HStack,
  Text,
  VStack,
  IconButton,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { GroceryItem, Category, Store } from '../types';

interface GroceryListProps {
  items: GroceryItem[];
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  categories: Category[];
  stores: Store[];
}

export const GroceryList = ({
  items,
  onToggleItem,
  onDeleteItem,
  categories,
  stores,
}: GroceryListProps) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.color || 'gray.500';
  };

  const getStoreName = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    return store?.name || 'Unknown Store';
  };

  const getStoreColor = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    return store?.color || 'gray.500';
  };

  // Group items by store
  const itemsByStore = items.reduce((acc, item) => {
    const store = item.store;
    if (!acc[store]) {
      acc[store] = [];
    }
    acc[store].push(item);
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  if (items.length === 0) {
    return (
      <Box p={4} textAlign="center" color="gray.500">
        No items in your grocery list. Add some items above!
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch" w="full">
      {Object.entries(itemsByStore).map(([storeId, storeItems]) => (
        <Box key={storeId}>
          <Badge
            mb={4}
            px={4}
            py={2}
            borderRadius="full"
            bg={getStoreColor(storeId)}
            color="white"
          >
            {getStoreName(storeId)}
          </Badge>
          <VStack spacing={4} align="stretch">
            {storeItems.map((item) => (
              <Box
                key={item.id}
                p={4}
                bg={bgColor}
                borderWidth={1}
                borderColor={borderColor}
                borderRadius="lg"
                position="relative"
              >
                <HStack spacing={4} align="center">
                  <Checkbox
                    isChecked={item.completed}
                    onChange={() => onToggleItem(item.id)}
                    size="lg"
                  />
                  <VStack align="start" flex={1}>
                    <Text
                      fontSize="lg"
                      textDecoration={item.completed ? 'line-through' : 'none'}
                      color={item.completed ? 'gray.500' : 'inherit'}
                    >
                      {item.name}
                    </Text>
                    <HStack spacing={2}>
                      <Text fontSize="sm" color="gray.500">
                        {item.quantity} {item.unit}
                      </Text>
                      <Box
                        w={2}
                        h={2}
                        borderRadius="full"
                        bg={getCategoryColor(item.category)}
                      />
                    </HStack>
                  </VStack>
                  <IconButton
                    aria-label="Delete item"
                    icon={<FaTrash />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => onDeleteItem(item.id)}
                  />
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      ))}
    </VStack>
  );
}; 