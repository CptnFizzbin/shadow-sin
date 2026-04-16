import { useStore } from "@tanstack/react-store"
import { produce } from "immer"
import { useEffect, useMemo } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { useAttr } from "#/components/character/characterUtils.ts"
import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"
import { MetatypeType } from "#/lib/system/metatypeData.ts"

/** Walk and run speeds in meters per full round, keyed by metatype. */
const metatypeMovementRates: Record<MetatypeType, { walk: number, run: number }> = {
  [MetatypeType.Human]: { walk: 10, run: 25 },
  [MetatypeType.Elf]: { walk: 10, run: 25 },
  [MetatypeType.Ork]: { walk: 10, run: 25 },
  [MetatypeType.Dwarf]: { walk: 8, run: 20 },
  [MetatypeType.Troll]: { walk: 15, run: 35 },
  [MetatypeType.AI]: { walk: 0, run: 0 },
}

export type MovementMode = "walk" | "run"

export interface MovementState {
  /** Sprint bonus meters added to the run total this round. */
  sprintBonus: number
  /** Distance (in meters) used per pass. Key is 0-based pass index. */
  used: Record<number, number>
  /** Movement mode selected per pass. Key is 0-based pass index. */
  modes: Record<number, MovementMode>
}

export class MovementStore extends StoreSlice<MovementState> {
  setMovement(passIndex: number, distance: number): void {
    this.set(
      produce((state) => {
        state.used[passIndex] = Math.max(0, distance)
      }),
    )
  }

  setMode(passIndex: number, mode: MovementMode): void {
    this.set(
      produce((state) => {
        state.modes[passIndex] = mode
      }),
    )
  }

  setSprintBonus(value: number): void {
    this.set(
      produce((state) => {
        state.sprintBonus = Math.max(0, value)
      }),
    )
  }

  reset(): void {
    this.set({ sprintBonus: 0, used: {}, modes: {} })
  }

  /** Remove stored entries for passes that no longer exist. */
  trim(numPasses: number): void {
    this.set(
      produce((state) => {
        for (const key of Object.keys(state.used).map(Number)) {
          if (key >= numPasses) delete state.used[key]
        }
        for (const key of Object.keys(state.modes).map(Number)) {
          if (key >= numPasses) delete state.modes[key]
        }
      }),
    )
  }
}

/** Distribute `total` meters across `numPasses`, rounding the remainder up into the first pass. */
export function distributeMovement(total: number, numPasses: number): number[] {
  if (numPasses <= 0) return []
  const base = Math.floor(total / numPasses)
  const remainder = total - base * numPasses
  return Array.from({ length: numPasses }, (_, index) =>
    index === 0 ? base + remainder : base,
  )
}

export interface MovementInfo {
  store: MovementStore
  /** Total walk/run rates for the round (from metatype + sprint bonus). */
  total: { walk: number, run: number }
  /** Per-pass allowance in walk and run meters. Index is 0-based pass number. */
  perPass: { walk: number, run: number }[]
  /** Sprint bonus meters in effect this round. */
  sprintBonus: number
  /** Meters used per pass. */
  used: Record<number, number>
  /** Mode selected per pass. */
  modes: Record<number, MovementMode>
  /** STR attribute value for sprint dice pool display. */
  strength: number
}

export const useMovementStore = (numPasses: number): MovementInfo => {
  const metatype = useCharacterSheet((sheet) => sheet.biology.metatype)
  const strength = useAttr(AttributeKey.strength)

  // Create a stable local-only store instance (not persisted to CharacterSheet).
  const store = useMemo(() => new MovementStore({ sprintBonus: 0, used: {}, modes: {} }), [])

  const sprintBonus = useStore(store, (state) => state.sprintBonus)
  const used = useStore(store, (state) => state.used)
  const modes = useStore(store, (state) => state.modes)

  // Remove orphaned entries whenever the pass count shrinks so they cannot
  // rehydrate if the count later increases again.
  useEffect(() => {
    store.trim(numPasses)
  }, [store, numPasses])

  return useMemo(() => {
    const rates = metatypeMovementRates[metatype] ?? { walk: 10, run: 25 }
    const totalRun = rates.run + sprintBonus
    const totalWalk = rates.walk

    const walkPerPass = distributeMovement(totalWalk, numPasses)
    const runPerPass = distributeMovement(totalRun, numPasses)

    // `perPass` length is always exactly numPasses. Out-of-bounds entries in
    // `used`/`modes` are trimmed by the useEffect above whenever numPasses changes.
    const perPass = Array.from({ length: numPasses }, (_, index) => ({
      walk: walkPerPass[index] ?? 0,
      run: runPerPass[index] ?? 0,
    }))

    return {
      store,
      total: { walk: totalWalk, run: totalRun },
      perPass,
      sprintBonus,
      used,
      modes,
      strength,
    }
  }, [store, metatype, numPasses, sprintBonus, used, modes, strength])
}
