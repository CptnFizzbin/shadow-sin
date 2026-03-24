import { useCharacterBuilderStoreSlice } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import type { BuilderGearData } from "#/components/CharacterBuilder/Gear/Generic/BuilderGearData.ts"

export function useBuilderGearSlice() {
  const gearSlice = useCharacterBuilderStoreSlice(
    (state) => state.gear,
    (state, gear) => {
      state.gear = gear
      return state
    },
  )

  return {
    getItem(id: string) {
      return gearSlice.state[id] ?? undefined
    },
    getItemsByType<TItem = BuilderGearData>(type: BuilderGearData["type"]) {
      return Object.values(gearSlice.state).filter((it) => it.type === type) as TItem[]
    },
    findItems(predicate: (item: BuilderGearData) => boolean) {
      return Object.values(gearSlice.state).filter(predicate)
    },
    getChildItems(item: BuilderGearData) {
      return Object.values(gearSlice.state).filter((i) => i.parentId === item.id)
    },
    getParentItem(item: BuilderGearData) {
      if (!item.parentId) return null
      return gearSlice.state[item.parentId] || null
    },
    saveItem(item: BuilderGearData) {
      gearSlice.update((prev) => {
        prev[item.id] = item
      })
    },
    deleteItem(item: { id: string }, options?: { removeChildren?: boolean }) {
      const id = item.id
      gearSlice.update((prev) => {
        if (options?.removeChildren) {
          const stack: string[] = [id]
          while (stack.length) {
            const cur = stack.pop()!
            for (const [k, v] of Object.entries(prev)) {
              if (v.parentId === cur) stack.push(k)
            }
            delete prev[cur]
          }
        } else {
          delete prev[id]
        }
      })
    },

    createItem(item: Omit<BuilderGearData, "id">) {
      const id = crypto.randomUUID()
      gearSlice.update((prev) => {
        prev[id] = { ...item, id }
      })
      return id
    },
  }
}
