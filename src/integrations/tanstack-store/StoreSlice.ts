import type { Atom, Observer, Store, Subscription } from "@tanstack/store"
import { createAtom, toObserver } from "@tanstack/store"

import type { SliceUpdater } from "#/integrations/tanstack-store/AtomUtils.ts"
import { isAnyAtom } from "#/integrations/tanstack-store/AtomUtils.ts"

export class StoreSlice<TData> implements Omit<Store<TData>, "atom">, Atom<TData> {
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
    if (typeof valueOrUpdater === "function") {
      const sliceUpdater = valueOrUpdater as SliceUpdater<TData>
      this.atom.set(sliceUpdater)
    } else {
      this.atom.set(valueOrUpdater as TData)
    }
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
