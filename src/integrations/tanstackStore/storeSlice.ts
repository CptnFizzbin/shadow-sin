import type { Atom, Observer, Subscription } from "@tanstack/store"
import { createAtom, toObserver } from "@tanstack/store"

import type { SliceUpdater } from "./atomUtils.ts"
import { isAnyAtom } from "./atomUtils.ts"

export class StoreSlice<TData> implements Atom<TData> {
  private atom: Atom<TData>

  constructor(value: TData)
  constructor(atom: Atom<TData>)
  constructor(valueOrAtom: TData | Atom<TData>) {
    if (isAnyAtom(valueOrAtom)) {
      this.atom = valueOrAtom
    } else {
      this.atom = createAtom(valueOrAtom)
    }
  }

  public get state() {
    return this.atom.get()
  }

  public set(
    valueOrUpdater: TData | SliceUpdater<TData>,
  ) {
    this.atom.set((prev) => {
      let next: TData

      if (typeof valueOrUpdater === "function") {
        const updater = valueOrUpdater as SliceUpdater<TData>
        next = updater(prev)
      } else {
        next = valueOrUpdater as TData
      }

      return next
    })
  }

  public setState(
    valueOrUpdater: TData | SliceUpdater<TData>,
  ) {
    this.set(valueOrUpdater)
  }

  public get() {
    return this.state
  }

  public subscribe(
    observerOrFn: Observer<TData> | ((value: TData) => void),
  ): Subscription {
    return this.atom.subscribe(toObserver(observerOrFn))
  }
}
