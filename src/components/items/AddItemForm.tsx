import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  VStack,
  useToast,
  SimpleGrid,
} from '@chakra-ui/react';
import { Category, Store, AddItemFormData } from '../../types';
import { UNITS, TOAST_DURATION } from '../../lib/utils/constants';

interface AddItemFormProps {
  onAddItem: (item: AddItemFormData) => Promise<void>;
  categories: Category[];
  stores: Store[];
  isLoading?: boolean;
}

export function AddItemForm({ onAddItem, categories, stores, isLoading = false }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pcs');
  const [category_id, setCategoryId] = useState('');
  const [store_id, setStoreId] = useState('');
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !category_id || !store_id) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: TOAST_DURATION.ERROR,
        isClosable: true,
      });
      return;
    }

    try {
      await onAddItem({
        name: name.trim(),
        quantity,
        unit,
        category_id,
        store_id,
      });

      // Reset form
      setName('');
      setQuantity(1);
      setUnit('pcs');
      setCategoryId('');
      setStoreId('');

      toast({
        title: 'Item added',
        description: `${name} has been added to your list`,
        status: 'success',
        duration: TOAST_DURATION.SUCCESS,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error adding item',
        description: 'Failed to add the item to the list',
        status: 'error',
        duration: TOAST_DURATION.ERROR,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={6} borderWidth={1} borderRadius="lg" bg="white">
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Item Name</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item name"
            autoFocus
          />
        </FormControl>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
          <FormControl>
            <FormLabel>Quantity</FormLabel>
            <NumberInput
              min={0.1}
              step={0.1}
              value={quantity}
              onChange={(_: string, value: number) => setQuantity(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Unit</FormLabel>
            <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </Select>
          </FormControl>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
          <FormControl isRequired>
            <FormLabel>Category</FormLabel>
            <Select
              value={category_id}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="Select category"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Store</FormLabel>
            <Select
              value={store_id}
              onChange={(e) => setStoreId(e.target.value)}
              placeholder="Select store"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </SimpleGrid>

        <Button
          type="submit"
          colorScheme="blue"
          width="full"
          size="lg"
          isLoading={isLoading}
        >
          Add Item
        </Button>
      </VStack>
    </Box>
  );
}
