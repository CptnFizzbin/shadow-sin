import type { FC, ReactElement, ReactNode } from "react"
import { Children, isValidElement } from "react"

export function isElementType<TProps>(...elementTypes: FC<TProps>[]) {
  return (item: ReactNode): item is ReactElement<TProps> => {
    return elementTypes.some((type) => isValidElement(item) && item.type === type)
  }
}

/** Assigns a stable id to each slot component so `find`/`filter` calls for the same type(s) can share a cache key. */
const typeIds = new WeakMap<FC<never>, number>()
let nextTypeId = 0

function cacheKey(elementTypes: FC<never>[]): string {
  return elementTypes.map((type) => {
    let id = typeIds.get(type)
    if (id === undefined) {
      id = nextTypeId++
      typeIds.set(type, id)
    }
    return id
  }).join(",")
}

export class SlotsProvider {
  private childArray: Array<Exclude<ReactNode, boolean | null | undefined>>
  private findCache = new Map<string, ReactElement | undefined>()
  private filterCache = new Map<string, ReactElement[]>()

  constructor(public children?: ReactNode) {
    this.childArray = Children.toArray(children)
  }

  has<TProps>(...elementTypes: FC<TProps>[]): boolean {
    return this.childArray.some(isElementType(...elementTypes))
  }

  /** Memoized per type(s) so getters built on `find` can be read repeatedly (e.g. directly in a template) without re-scanning children. */
  find<TProps>(...elementTypes: FC<TProps>[]): ReactElement<TProps> | undefined {
    return this.withCache(this.findCache, elementTypes, () => this.childArray.find(isElementType(...elementTypes))) as ReactElement<TProps> | undefined
  }

  /** Memoized per type(s) so getters built on `filter` can be read repeatedly (e.g. directly in a template) without re-scanning children. */
  filter<TProps>(...elementTypes: FC<TProps>[]): ReactElement<TProps>[] {
    return this.withCache(this.filterCache, elementTypes, () => this.childArray.filter(isElementType(...elementTypes))) as ReactElement<TProps>[]
  }

  private withCache<T>(cache: Map<string, T>, elementTypes: FC<never>[], compute: () => T): T {
    const key = cacheKey(elementTypes)
    if (!cache.has(key)) {
      cache.set(key, compute())
    }
    return cache.get(key) as T
  }
}
