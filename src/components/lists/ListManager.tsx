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
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { FaChevronDown, FaPlus, FaTrash } from 'react-icons/fa';
import { GroceryList } from '../../types';
import { formatRelativeTime } from '../../lib/utils/helpers';
import { TOAST_DURATION } from '../../lib/utils/constants';
import { useRef } from 'react';

interface ListManagerProps {
  lists: GroceryList[];
  currentList: GroceryList | null;
  onSelectList: (list: GroceryList) => void;
  onCreateList: (name: string) => Promise<void>;
  onDeleteList: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function ListManager({
  lists,
  currentList,
  onSelectList,
  onCreateList,
  onDeleteList,
  isLoading = false,
}: ListManagerProps) {
  const [newListName, setNewListName] = useState('');
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleCreateList = async (): Promise<void> => {
    if (!newListName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a list name',
        status: 'error',
        duration: TOAST_DURATION.ERROR,
        isClosable: true,
      });
      return;
    }

    try {
      await onCreateList(newListName.trim());
      setNewListName('');
      toast({
        title: 'List created',
        description: `"${newListName}" has been created`,
        status: 'success',
        duration: TOAST_DURATION.SUCCESS,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error creating list',
        description: 'Failed to create the list',
        status: 'error',
        duration: TOAST_DURATION.ERROR,
        isClosable: true,
      });
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setListToDelete(id);
    onOpen();
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!listToDelete) return;

    try {
      await onDeleteList(listToDelete);
      onClose();
      setListToDelete(null);
      toast({
        title: 'List deleted',
        status: 'success',
        duration: TOAST_DURATION.SUCCESS,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error deleting list',
        status: 'error',
        duration: TOAST_DURATION.ERROR,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box p={4} borderWidth={1} borderRadius="lg" bg="white">
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
              isLoading={isLoading}
            >
              New List
            </Button>
          </HStack>

          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<FaChevronDown />}
              width="full"
              isDisabled={lists.length === 0}
            >
              {currentList ? currentList.name : lists.length === 0 ? 'No lists yet' : 'Select a list'}
            </MenuButton>
            <MenuList maxH="300px" overflowY="auto">
              {lists.map((list) => (
                <MenuItem
                  key={list.id}
                  onClick={() => onSelectList(list)}
                  bg={currentList?.id === list.id ? 'blue.50' : 'transparent'}
                >
                  <HStack justify="space-between" width="full">
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontWeight={currentList?.id === list.id ? 'bold' : 'normal'}>
                        {list.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Updated {formatRelativeTime(list.updated_at)}
                      </Text>
                    </VStack>
                    <IconButton
                      aria-label="Delete list"
                      icon={<FaTrash />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={(e) => handleDeleteClick(e, list.id)}
                    />
                  </HStack>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </VStack>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete List
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this list? All items in this list will
              be permanently deleted. This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
