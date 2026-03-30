export interface CachePayload<T> {
  data: T
  timestamp: number
}

export const loadFromCache = <T>(storageKey: string, cacheDuration: number): T | null => {
  try {
    const cached = localStorage.getItem(storageKey)
    if (!cached) return null

    const { data, timestamp } = JSON.parse(cached) as CachePayload<T>
    if (Date.now() - timestamp > cacheDuration) {
      localStorage.removeItem(storageKey)
      return null
    }

    return data
  } catch (error) {
    console.warn(`Failed to load ${storageKey} from cache:`, error)
    localStorage.removeItem(storageKey)
    return null
  }
}

export const saveToCache = <T>(storageKey: string, data: T): void => {
  if (data !== undefined && data !== null) {
    const cacheData: CachePayload<T> = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(storageKey, JSON.stringify(cacheData))
  }
}

export const updateItemInStore = <T extends { id: string }>(
  store: Record<string, T[]>,
  item: T,
  saveCallback: () => void,
) => {
  for (const bId in store) {
    const items = store[bId]
    if (!items) continue
    const index = items.findIndex((i) => i.id === item.id)
    if (index !== -1) {
      items[index] = item
      saveCallback()
      break
    }
  }
}

export const removeItemFromStore = <T extends { id: string }>(
  store: Record<string, T[]>,
  itemId: string,
  saveCallback: () => void,
) => {
  for (const boardId in store) {
    const items = store[boardId]
    if (!items) continue
    const index = items.findIndex((i) => i.id === itemId)
    if (index !== -1) {
      items.splice(index, 1)
      saveCallback()
      break
    }
  }
}
