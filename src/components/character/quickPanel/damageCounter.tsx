import { useStore } from "@tanstack/react-store"
import type { FC } from "react"

import { useDamageStore } from "#/components/damage/useDamageStore.ts"
import { Counter } from "#/components/ui/counter/counter.tsx"
import type { DamageTrackKey } from "#/system/damageTrackKey.ts"

interface DamageCounterProps {
  trackKey: DamageTrackKey
  label: string
}

export const DamageCounter: FC<DamageCounterProps> = ({ trackKey, label }) => {
  const damageStore = useDamageStore()
  const current = useStore(damageStore, (state) => state[trackKey].current)
  const max = useStore(damageStore, (state) => state[trackKey].max)

  return (
    <Counter
      label={label}
      value={current}
      min={0}
      max={max}
      onChange={(newValue) => damageStore.setDamage(trackKey, newValue)}
    />
  )
}
