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
} from '@chakra-ui/react';
import { GroceryItem, Category, Store } from '../types';

interface AddItemFormProps {
  onAddItem: (item: Omit<GroceryItem, 'id' | 'completed'>) => void;
  categories: Category[];
  stores: Store[];
}

export const AddItemForm = ({ onAddItem, categories, stores }: AddItemFormProps) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pcs');
  const [category, setCategory] = useState('');
  const [store, setStore] = useState('');
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !store) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onAddItem({
      name,
      quantity,
      unit,
      category,
      store,
    });

    setName('');
    setQuantity(1);
    setUnit('pcs');
    setCategory('');
    setStore('');
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4} borderWidth={1} borderRadius="lg">
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Item Name</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item name"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Quantity</FormLabel>
          <NumberInput
            min={1}
            value={quantity}
            onChange={(_, value) => setQuantity(value)}
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
            <option value="pcs">Pieces</option>
            <option value="kg">Kilograms</option>
            <option value="g">Grams</option>
            <option value="l">Liters</option>
            <option value="ml">Milliliters</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Category</FormLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
            value={store}
            onChange={(e) => setStore(e.target.value)}
            placeholder="Select store"
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" colorScheme="blue" width="full">
          Add Item
        </Button>
      </VStack>
    </Box>
  );
}; 