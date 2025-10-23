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
import { GroceryItemWithRelations } from '../../types';

interface ItemCardProps {
  item: GroceryItemWithRelations;
  onToggle: () => void;
  onDelete: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
  showStore?: boolean;
}

export function ItemCard({
  item,
  onToggle,
  onDelete,
  isSelected = false,
  onSelect,
  showStore = false,
}: ItemCardProps) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const selectedBorderColor = useColorModeValue('blue.400', 'blue.300');

  return (
    <Box
      p={4}
      bg={bgColor}
      borderWidth={2}
      borderColor={isSelected ? selectedBorderColor : borderColor}
      borderRadius="lg"
      position="relative"
      transition="all 0.2s"
      _hover={{ shadow: 'md' }}
      onClick={onSelect}
      cursor={onSelect ? 'pointer' : 'default'}
    >
      <HStack spacing={4} align="center">
        <Checkbox
          isChecked={item.completed}
          onChange={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          size="lg"
        />
        <VStack align="start" flex={1} spacing={1}>
          <Text
            fontSize="lg"
            fontWeight="medium"
            textDecoration={item.completed ? 'line-through' : 'none'}
            color={item.completed ? 'gray.500' : 'inherit'}
          >
            {item.name}
          </Text>
          <HStack spacing={2} wrap="wrap">
            <Text fontSize="sm" color="gray.500">
              {item.quantity} {item.unit}
            </Text>
            {item.category && (
              <Badge colorScheme={item.category.color.split('.')[0]}>
                {item.category.name}
              </Badge>
            )}
            {showStore && item.store && (
              <Badge colorScheme={item.store.color.split('.')[0]}>
                {item.store.name}
              </Badge>
            )}
          </HStack>
        </VStack>
        <IconButton
          aria-label="Delete item"
          icon={<FaTrash />}
          size="sm"
          colorScheme="red"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        />
      </HStack>
    </Box>
  );
}
