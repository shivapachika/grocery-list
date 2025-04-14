import {
  HStack,
  Button,
  Badge,
  Text,
  Box,
} from '@chakra-ui/react';
import { Store } from '../types';

interface StoreFilterProps {
  stores: Store[];
  selectedStore: string | null;
  onSelectStore: (storeId: string | null) => void;
  itemCountByStore: Record<string, number>;
}

export const StoreFilter = ({
  stores,
  selectedStore,
  onSelectStore,
  itemCountByStore,
}: StoreFilterProps) => {
  return (
    <Box mb={4}>
      <Text mb={2} fontWeight="medium">Filter by Store:</Text>
      <HStack spacing={2} wrap="wrap">
        <Button
          size="sm"
          variant={selectedStore === null ? 'solid' : 'outline'}
          colorScheme="gray"
          onClick={() => onSelectStore(null)}
        >
          All Stores
        </Button>
        {stores.map((store) => (
          <Button
            key={store.id}
            size="sm"
            variant={selectedStore === store.id ? 'solid' : 'outline'}
            colorScheme={store.color.split('.')[0] as string}
            onClick={() => onSelectStore(store.id)}
          >
            {store.name}
            {itemCountByStore[store.id] > 0 && (
              <Badge
                ml={2}
                colorScheme={store.color.split('.')[0] as string}
                variant={selectedStore === store.id ? 'solid' : 'outline'}
              >
                {itemCountByStore[store.id]}
              </Badge>
            )}
          </Button>
        ))}
      </HStack>
    </Box>
  );
}; 