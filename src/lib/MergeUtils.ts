function isObject(item: unknown): item is object {
  return typeof item === "object" && item !== null
}

function isObjectWithId(item: unknown): item is { id: string } {
  return isObject(item) && "id" in item && typeof item.id === "string"
}

export function mergeArrays<TData>(...arrays: unknown[][]): TData[] {
  const seenIndexes = new Map<string, number>()
  const seenRefs = new Map<unknown, number>()
  const outItems: unknown[] = []

  for (const array of arrays) {
    array.forEach((item, index) => {
      if (isObjectWithId(item)) {
        const itemId = `object:${item.id}`
        const existingIndex = seenIndexes.get(itemId)
        if (existingIndex !== undefined) {
          // merge into existing item in-place
          outItems[existingIndex] = mergeObjects(
            outItems[existingIndex] as Record<string, unknown>,
            item as Record<string, unknown>,
          )
        } else {
          seenIndexes.set(itemId, outItems.length)
          outItems.push(item)
        }
      } else if (Array.isArray(item)) {
        const itemKey = `array:${index}`
        const existingIndex = seenIndexes.get(itemKey)
        if (
          existingIndex !== undefined
          && Array.isArray(outItems[existingIndex])
        ) {
          outItems[existingIndex] = mergeArrays(
            outItems[existingIndex] as unknown[],
            item,
          )
        } else {
          seenIndexes.set(itemKey, outItems.length)
          outItems.push(item)
        }
      } else {
        try {
          const key = JSON.stringify(item)
          const itemId = `json:${key}`
          if (seenIndexes.has(itemId)) return
          seenIndexes.set(itemId, outItems.length)
          outItems.push(item)
        } catch {
          // fallback to reference equality for non-serializable items
          if (seenRefs.has(item)) return
          seenRefs.set(item, outItems.length)
          outItems.push(item)
        }
      }
    })
  }

  return outItems as TData[]
}

export function mergeObjects<TData extends object>(
  ...objects: object[]
): TData {
  const result: Record<string, unknown> = {}

  for (const obj of objects) {
    for (const [key, value] of Object.entries(obj)) {
      if (key in result) {
        if (Array.isArray(result[key]) && Array.isArray(value)) {
          result[key] = mergeArrays(result[key] as unknown[], value)
        } else if (isObject(result[key]) && isObject(value)) {
          result[key] = mergeObjects(result[key], value)
        } else {
          result[key] = value
        }
      } else {
        result[key] = value
      }
    }
  }

  return result as TData
}
