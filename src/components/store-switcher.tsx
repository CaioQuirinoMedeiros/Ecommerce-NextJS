'use client'

import * as React from 'react'
import { Store } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon
} from 'lucide-react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { useStoreModalStore } from '@/hooks/use-store-modal-store'
import { cn } from '@/utils/styles'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

type StoreItem = { label: string; value: string }

interface StoreSwitcherProps extends PopoverTriggerProps {
  stores: Store[]
}

export function StoreSwitcher(props: StoreSwitcherProps) {
  const { stores, className } = props

  const storeModalStore = useStoreModalStore()
  const params = useParams()
  const router = useRouter()

  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

  const storeItems: StoreItem[] = stores.map((store) => ({
    label: store.name,
    value: store.id
  }))

  const currentStore = storeItems.find((storeItem) => {
    return storeItem.value == params.storeId
  })

  function onStoreItemSelect(storeItem: StoreItem) {
    setIsPopoverOpen(false)
    router.push(`/${storeItem.value}`)
  }

  function handleCreateNewStore() {
    setIsPopoverOpen(false)
    storeModalStore.onOpen()
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          role='combobox'
          aria-expanded={isPopoverOpen}
          aria-label='Select a store'
          className={cn('w-[200px] justify-between', className)}
        >
          <StoreIcon className='mr-2 h-4 w-4' />
          {currentStore?.label}
          <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandList>
            <CommandInput placeholder='Search store...' />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading='Stores'>
              {storeItems.map((storeItem) => {
                const isCurrentStore = storeItem.value === currentStore?.value
                return (
                  <CommandItem
                    key={storeItem.value}
                    onSelect={() => onStoreItemSelect(storeItem)}
                    className='text-sm'
                  >
                    <StoreIcon className='mr-2 h-4 w-4' />
                    {storeItem.label}
                    <Check
                      className={cn('ml-auto h-4 w-4 opacity-0', {
                        ['opacity-100']: isCurrentStore
                      })}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>

          <CommandSeparator />

          <CommandList>
            <CommandGroup>
              <CommandItem onSelect={handleCreateNewStore}>
                <PlusCircle className='mr-2 w-5 h-5' />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
