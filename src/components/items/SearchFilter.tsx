import { useState, useCallback } from 'react';
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Box,
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import { CloseIcon } from '@chakra-ui/icons';
import { debounce } from '../../lib/utils/helpers';
import { useGroceryContext } from '../../contexts/GroceryContext';

export function SearchFilter() {
  const { filters, setFilters } = useGroceryContext();
  const [localValue, setLocalValue] = useState(filters.searchQuery || '');

  // Debounced update to context
  const debouncedUpdate = useCallback(
    debounce((value: string) => {
      setFilters((prev) => ({ ...prev, searchQuery: value }));
    }, 300),
    [setFilters]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);
    debouncedUpdate(value);
  };

  const handleClear = () => {
    setLocalValue('');
    setFilters((prev) => ({ ...prev, searchQuery: '' }));
  };

  return (
    <Box mb={4}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <FaSearch color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search items..."
          value={localValue}
          onChange={handleChange}
        />
        {localValue && (
          <InputRightElement>
            <IconButton
              aria-label="Clear search"
              icon={<CloseIcon />}
              size="sm"
              variant="ghost"
              onClick={handleClear}
            />
          </InputRightElement>
        )}
      </InputGroup>
    </Box>
  );
}
