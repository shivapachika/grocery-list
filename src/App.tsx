import { useState, useEffect } from 'react'
import {
  Container,
  VStack,
  Heading,
  Box,
  useToast,
  Spinner,
  Center,
} from '@chakra-ui/react'
import { AddItemForm } from './components/AddItemForm'
import { GroceryList } from './components/GroceryList'
import { ListManager } from './components/ListManager'
import { StoreFilter } from './components/StoreFilter'
import { GroceryItem, Category, GroceryList as IGroceryList, Store } from './types'
import { fetchLists, createList, updateList, deleteList, addItem, toggleItem, deleteItem } from './lib/db'

const initialCategories: Category[] = [
  { id: '1', name: 'Fruits & Vegetables', color: 'green.500' },
  { id: '2', name: 'Dairy', color: 'blue.500' },
  { id: '3', name: 'Meat', color: 'red.500' },
  { id: '4', name: 'Pantry', color: 'yellow.500' },
  { id: '5', name: 'Beverages', color: 'purple.500' },
]

const initialStores: Store[] = [
  { id: '1', name: 'HEB', color: 'red.500' },
  { id: '2', name: 'Costco', color: 'blue.500' },
  { id: '3', name: 'Indian Stores', color: 'orange.500' },
  { id: '4', name: 'Walmart', color: 'blue.400' },
]

function App() {
  const [lists, setLists] = useState<IGroceryList[]>([])
  const [currentList, setCurrentList] = useState<IGroceryList | null>(null)
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  // Load lists from Supabase on initial render
  useEffect(() => {
    async function loadLists() {
      try {
        const data = await fetchLists()
        setLists(data)
        if (data.length > 0) {
          setCurrentList(data[0])
        }
      } catch (error) {
        toast({
          title: 'Error loading lists',
          description: 'Failed to load your grocery lists',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadLists()
  }, [toast])

  const handleCreateList = async (name: string) => {
    try {
      const newList = await createList(name)
      setLists([...lists, newList])
      setCurrentList(newList)
      toast({
        title: 'List created',
        description: `"${name}" has been created`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error creating list',
        description: 'Failed to create the list',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleSelectList = (list: IGroceryList) => {
    setCurrentList(list)
    setSelectedStore(null) // Reset store filter when changing lists
  }

  const handleDeleteList = async (id: string) => {
    try {
      await deleteList(id)
      const updatedLists = lists.filter(list => list.id !== id)
      setLists(updatedLists)
      if (currentList?.id === id) {
        setCurrentList(updatedLists[0] || null)
        setSelectedStore(null) // Reset store filter when deleting current list
      }
      toast({
        title: 'List deleted',
        description: 'The list has been deleted',
        status: 'info',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error deleting list',
        description: 'Failed to delete the list',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleAddItem = async (newItem: Omit<GroceryItem, 'id' | 'completed'>) => {
    if (!currentList) {
      toast({
        title: 'Error',
        description: 'Please create or select a list first',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      return
    }

    try {
      const item = await addItem(currentList.id, newItem)
      const updatedList = {
        ...currentList,
        items: [...currentList.items, item],
        updatedAt: new Date().toISOString(),
      }

      setLists(lists.map(list => 
        list.id === currentList.id ? updatedList : list
      ))
      setCurrentList(updatedList)

      toast({
        title: 'Item added',
        description: `${newItem.name} has been added to your list`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error adding item',
        description: 'Failed to add the item to the list',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleToggleItem = async (id: string) => {
    if (!currentList) return

    try {
      await toggleItem(currentList.id, id)
      const updatedList = {
        ...currentList,
        items: currentList.items.map(item =>
          item.id === id ? { ...item, completed: !item.completed } : item
        ),
        updatedAt: new Date().toISOString(),
      }

      setLists(lists.map(list => 
        list.id === currentList.id ? updatedList : list
      ))
      setCurrentList(updatedList)
    } catch (error) {
      toast({
        title: 'Error updating item',
        description: 'Failed to update the item',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!currentList) return

    try {
      await deleteItem(currentList.id, id)
      const updatedList = {
        ...currentList,
        items: currentList.items.filter(item => item.id !== id),
        updatedAt: new Date().toISOString(),
      }

      setLists(lists.map(list => 
        list.id === currentList.id ? updatedList : list
      ))
      setCurrentList(updatedList)

      toast({
        title: 'Item removed',
        description: 'The item has been removed from your list',
        status: 'info',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error deleting item',
        description: 'Failed to delete the item',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  // Calculate item counts by store
  const itemCountByStore = currentList?.items.reduce((acc, item) => {
    acc[item.store] = (acc[item.store] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // Filter items by selected store
  const filteredItems = currentList?.items.filter(
    item => !selectedStore || item.store === selectedStore
  ) || []

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8}>
        <Heading>Family Grocery List</Heading>
        <Box w="full">
          <ListManager
            lists={lists}
            currentList={currentList}
            onSelectList={handleSelectList}
            onCreateList={handleCreateList}
            onDeleteList={handleDeleteList}
          />
        </Box>
        <Box w="full">
          <AddItemForm
            onAddItem={handleAddItem}
            categories={initialCategories}
            stores={initialStores}
          />
        </Box>
        <Box w="full">
          <StoreFilter
            stores={initialStores}
            selectedStore={selectedStore}
            onSelectStore={setSelectedStore}
            itemCountByStore={itemCountByStore}
          />
          <GroceryList
            items={filteredItems}
            onToggleItem={handleToggleItem}
            onDeleteItem={handleDeleteItem}
            categories={initialCategories}
            stores={initialStores}
          />
        </Box>
      </VStack>
    </Container>
  )
}

export default App
