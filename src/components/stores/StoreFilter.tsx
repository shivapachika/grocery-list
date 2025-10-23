import {
  Button,
  Badge,
  Text,
  Box,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { Store } from '../../types';
import { useGroceryContext } from '../../contexts/GroceryContext';

interface StoreFilterProps {
  stores: Store[];
  itemCountByStore: Record<string, number>;
}

export function StoreFilter({ stores, itemCountByStore }: StoreFilterProps) {
  const { filters, setFilters } = useGroceryContext();
  const selectedStore = filters.storeId;

  return (
    <Box mb={4}>
      <Text mb={3} fontWeight="semibold" fontSize="lg">
        Filter by Store:
      </Text>
      <Wrap spacing={2}>
        <WrapItem>
          <Button
            size="sm"
            variant={selectedStore === null ? 'solid' : 'outline'}
            colorScheme="gray"
            onClick={() => setFilters((prev: any) => ({ ...prev, storeId: null }))}
          >
            All Stores
          </Button>
        </WrapItem>
        {stores.map((store) => {
          const count = itemCountByStore[store.id] || 0;
          const colorScheme = store.color.split('.')[0] as string;

          return (
            <WrapItem key={store.id}>
              <Button
                size="sm"
                variant={selectedStore === store.id ? 'solid' : 'outline'}
                colorScheme={colorScheme}
                onClick={() => setFilters((prev: any) => ({ ...prev, storeId: store.id }))}
                rightIcon={
                  count > 0 ? (
                    <Badge
                      colorScheme={colorScheme}
                      variant={selectedStore === store.id ? 'solid' : 'subtle'}
                    >
                      {count}
                    </Badge>
                  ) : undefined
                }
              >
                {store.name}
              </Button>
            </WrapItem>
          );
        })}
      </Wrap>
    </Box>
  );
}
