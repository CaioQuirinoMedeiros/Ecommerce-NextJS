'use client'

import qs from 'query-string'
import { Size, Color } from '@/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/styles'

interface FilterProps {
  valueKey: string
  name: string
  data: Array<Color | Size>
}

export function Filter(props: FilterProps) {
  const { data, name, valueKey } = props

  const searchParams = useSearchParams()
  const router = useRouter()

  const selectedValue = searchParams.get(valueKey)

  function handleSelectItem(itemId: string) {
    const currentQuery = qs.parse(searchParams.toString())

    const newQuery = { ...currentQuery, [valueKey]: itemId }

    if (currentQuery[valueKey] === itemId) {
      newQuery[valueKey] = null
    }

    const url = qs.stringifyUrl(
      { url: window.location.href, query: newQuery },
      { skipNull: true }
    )

    router.push(url)
  }

  return (
    <div className='mb-8'>
      <h3 className='text-lg font-semibold'>{name}</h3>
      <hr className='my-4' />
      <div className='flex flex-wrap gap-2'>
        {data.map((item) => {
          const isSelected = item.id === selectedValue
          return (
            <div key={item.id} className='flex items-center'>
              <Button
                className={cn(
                  'rounded-md text-sm text-gray-800 p-2 bg-white border border-gray-300',
                  isSelected ? 'bg-black text-white' : ''
                )}
                onClick={() => handleSelectItem(item.id)}
              >
                {item.name}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
