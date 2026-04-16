import type { FC } from "react"

import { useDamageStore } from "#/components/damage/useDamageStore.ts"
import { Counter } from "#/components/ui/counter/counter.tsx"

export type DamageTrackKey = "physical" | "stun"

interface DamageCounterProps {
  trackKey: DamageTrackKey
  label: string
}

export const DamageCounter: FC<DamageCounterProps> = ({ trackKey, label }) => {
  const damageStore = useDamageStore()
  const track = damageStore[trackKey]

  return (
    <Counter
      label={label}
      value={track.current}
      min={0}
      max={track.max}
      onChange={(newValue) => track.setValue(newValue)}
    />
  )
}
