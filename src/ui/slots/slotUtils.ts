import type { FC, PropsWithChildren, ReactElement, ReactNode } from "react"
import { Children, cloneElement, Fragment, isValidElement } from "react"

export function isElementType<TProps>(...elementTypes: FC<TProps>[]) {
  return (item: ReactNode): item is ReactElement<TProps> => {
    return elementTypes.some((type) => isValidElement(item) && item.type === type)
  }
}

type SlotChild = Exclude<ReactNode, boolean | null | undefined>

/**
 * Children as a flat list, with fragments opened up so a slot wrapped in `<>…</>` (e.g. a group of
 * stats behind one condition) is still found. Keys are prefixed with their fragment's key so
 * children of different fragments can't collide.
 */
function flattenChildren(children: ReactNode, keyPrefix = ""): SlotChild[] {
  return Children.toArray(children).flatMap((child) => {
    if (isValidElement<PropsWithChildren>(child) && child.type === Fragment) {
      return flattenChildren(child.props.children, `${keyPrefix}${child.key ?? ""}`)
    }
    return keyPrefix && isValidElement(child) ? [cloneElement(child, { key: `${keyPrefix}${child.key}` })] : [child]
  })
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

export class SlotManager {
  private childArray: SlotChild[]
  private findCache = new Map<string, ReactElement | undefined>()
  private filterCache = new Map<string, ReactElement[]>()
  private claimed = new Set<ReactNode>()

  constructor(public children?: ReactNode) {
    this.childArray = flattenChildren(children)
  }

  has<TProps>(...elementTypes: FC<TProps>[]): boolean {
    return this.childArray.some(isElementType(...elementTypes))
  }

  /** Memoized per type(s) so getters built on `find` can be read repeatedly (e.g. directly in a template) without re-scanning children. */
  find<TProps>(...elementTypes: FC<TProps>[]): ReactElement<TProps> | undefined {
    return this.withCache(this.findCache, elementTypes, () => {
      const match = this.childArray.find(isElementType(...elementTypes))
      if (match) this.claimed.add(match)
      return match
    }) as ReactElement<TProps> | undefined
  }

  /** Memoized per type(s) so getters built on `filter` can be read repeatedly (e.g. directly in a template) without re-scanning children. */
  filter<TProps>(...elementTypes: FC<TProps>[]): ReactElement<TProps>[] {
    return this.withCache(this.filterCache, elementTypes, () => {
      const matches = this.childArray.filter(isElementType(...elementTypes))
      matches.forEach((match) => this.claimed.add(match))
      return matches
    }) as ReactElement<TProps>[]
  }

  /**
   * Children not claimed by any `find`/`filter` call made so far — a catch-all for content a
   * subclass's slot getters don't recognize. Since claims accrue as those getters are called,
   * read this after querying every slot the subclass exposes, otherwise still-unqueried types
   * show up here too.
   */
  get unmapped(): ReactNode[] {
    return this.childArray.filter((child) => !this.claimed.has(child))
  }

  private withCache<T>(cache: Map<string, T>, elementTypes: FC<never>[], compute: () => T): T {
    const key = cacheKey(elementTypes)
    if (!cache.has(key)) {
      cache.set(key, compute())
    }
    return cache.get(key) as T
  }
}
