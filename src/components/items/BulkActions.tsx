import {
  HStack,
  Button,
  Text,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { BulkAction } from '../../types';
import { TOAST_DURATION } from '../../lib/utils/constants';

interface BulkActionsProps {
  selectedCount: number;
  onBulkAction: (action: BulkAction) => Promise<void>;
  selectedItems: Set<string>;
  onClearSelection: () => void;
}

export function BulkActions({
  selectedCount,
  onBulkAction,
  selectedItems,
  onClearSelection,
}: BulkActionsProps) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  if (selectedCount === 0) {
    return null;
  }

  const handleComplete = async () => {
    try {
      await onBulkAction({
        type: 'complete',
        itemIds: Array.from(selectedItems),
      });
      onClearSelection();
      toast({
        title: 'Items marked as complete',
        status: 'success',
        duration: TOAST_DURATION.SUCCESS,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error completing items',
        status: 'error',
        duration: TOAST_DURATION.ERROR,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await onBulkAction({
        type: 'delete',
        itemIds: Array.from(selectedItems),
      });
      onClearSelection();
      onClose();
      toast({
        title: 'Items deleted',
        status: 'success',
        duration: TOAST_DURATION.SUCCESS,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error deleting items',
        status: 'error',
        duration: TOAST_DURATION.ERROR,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <HStack
        p={4}
        bg="blue.50"
        borderRadius="lg"
        justify="space-between"
        mb={4}
        flexWrap="wrap"
      >
        <Text fontWeight="medium">
          {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
        </Text>
        <HStack spacing={2}>
          <Button size="sm" onClick={onClearSelection}>
            Clear
          </Button>
          <Button size="sm" colorScheme="green" onClick={handleComplete}>
            Mark Complete
          </Button>
          <Button size="sm" colorScheme="red" onClick={onOpen}>
            Delete
          </Button>
        </HStack>
      </HStack>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Items
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete {selectedCount} item
              {selectedCount > 1 ? 's' : ''}? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
