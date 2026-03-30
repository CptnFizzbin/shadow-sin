import type { BaseAtom } from "@tanstack/store"
import { createStore } from "@tanstack/store"
import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/Character/CharacterSheetContext.tsx"
import { LifestyleType } from "#/lib/system/LifestyleType.ts"

export interface LifestyleStoreState {
  quality: LifestyleType
  monthsPaid: number
}

const createDefaults = (): LifestyleStoreState => {
  return {
    quality: LifestyleType.Middle,
    monthsPaid: 1,
  }
}

export interface LifestyleStore extends BaseAtom<LifestyleStoreState> {
  setQuality(quality: LifestyleType): void

  setMonthsPaid(monthsPaid: number): void
}

export const useLifestyleStore = () => {
  const store = useCharacterSheetContext()

  return useMemo((): LifestyleStore => {
    const lifestyleStore = createStore(() => {
      return store.state.profile.lifestyle ?? createDefaults()
    })

    return {
      get: () => lifestyleStore.get(),
      subscribe: (listener) => lifestyleStore.subscribe(listener),

      setQuality(newLifestyle: LifestyleType) {
        store.setState(produce((sheet) => {
          const lifestyleInfo = sheet.profile.lifestyle ??= createDefaults()
          lifestyleInfo.quality = newLifestyle
        }))
      },

      setMonthsPaid(months: number) {
        store.setState(produce((sheet) => {
          const lifestyleInfo = sheet.profile.lifestyle ??= createDefaults()
          lifestyleInfo.monthsPaid = months
        }))
      },
    }
  }, [store])
}
