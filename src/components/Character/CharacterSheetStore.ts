import type { Atom, Observer, Store, Subscription } from "@tanstack/store"
import { createAtom, toObserver } from "@tanstack/store"

import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export class CharacterSheetStore implements Omit<Store<CharacterSheet>, "atom"> {
  private atom: Atom<CharacterSheet>

  constructor(value: CharacterSheet)
  constructor(atom: Atom<CharacterSheet>)
  constructor(valueOrAtom: CharacterSheet | Atom<CharacterSheet>) {
    if ("get" in valueOrAtom && "set" in valueOrAtom) {
      this.atom = valueOrAtom
    } else {
      this.atom = createAtom(valueOrAtom)
    }
  }

  public get state() {
    return this.atom.get()
  }

  public setState(
    valueOrUpdater: CharacterSheet | ((prev: CharacterSheet) => CharacterSheet),
  ) {
    if (typeof valueOrUpdater === "function") {
      this.atom.set(valueOrUpdater)
    } else {
      this.atom.set(valueOrUpdater)
    }
  }

  public get() {
    return this.state
  }

  public subscribe(
    observerOrFn: Observer<CharacterSheet> | ((value: CharacterSheet) => void),
  ): Subscription {
    return this.atom.subscribe(toObserver(observerOrFn))
  }
}
