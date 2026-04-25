import type { Store } from "@tanstack/store"
import type { ReactNode } from "react"

type DialogApiState = Record<string, ReactNode>
export type DialogApiStore = Store<DialogApiState>

export function createDialogApiSelector<TReturn>(selector: (state: DialogApiState) => TReturn) {
  return selector
}
