import { useState } from 'react';
import {
  Box,
  Button,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { FaChevronDown, FaPlus } from 'react-icons/fa';
import { GroceryList } from '../types';

interface ListManagerProps {
  lists: GroceryList[];
  currentList: GroceryList | null;
  onSelectList: (list: GroceryList) => void;
  onCreateList: (name: string) => void;
  onDeleteList: (id: string) => void;
}

export const ListManager = ({
  lists,
  currentList,
  onSelectList,
  onCreateList,
  onDeleteList,
}: ListManagerProps) => {
  const [newListName, setNewListName] = useState('');
  const toast = useToast();

  const handleCreateList = () => {
    if (!newListName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a list name',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    onCreateList(newListName);
    setNewListName('');
  };

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" mb={4}>
      <VStack spacing={4}>
        <HStack width="full">
          <Input
            placeholder="New list name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
          />
          <Button
            leftIcon={<FaPlus />}
            colorScheme="blue"
            onClick={handleCreateList}
          >
            New List
          </Button>
        </HStack>

        <Menu>
          <MenuButton as={Button} rightIcon={<FaChevronDown />} width="full">
            {currentList ? currentList.name : 'Select List'}
          </MenuButton>
          <MenuList>
            {lists.map((list) => (
              <MenuItem
                key={list.id}
                onClick={() => onSelectList(list)}
                justifyContent="space-between"
              >
                <Text>{list.name}</Text>
                <HStack>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(list.updated_at).toLocaleDateString()}
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteList(list.id);
                    }}
                  >
                    Delete
                  </Button>
                </HStack>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </VStack>
    </Box>
  );
}; 