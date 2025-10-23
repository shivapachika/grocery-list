import { Box, Text, VStack, Icon } from '@chakra-ui/react';
import { FaShoppingCart } from 'react-icons/fa';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'No items in your grocery list. Add some items above!' }: EmptyStateProps) {
  return (
    <Box p={8} textAlign="center">
      <VStack spacing={4}>
        <Icon as={FaShoppingCart} boxSize={12} color="gray.400" />
        <Text color="gray.500" fontSize="lg">
          {message}
        </Text>
      </VStack>
    </Box>
  );
}
