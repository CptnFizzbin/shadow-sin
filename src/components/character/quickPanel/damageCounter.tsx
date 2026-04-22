import { useStore } from "@tanstack/react-store"
import type { FC } from "react"

import { useDamageStore } from "#/components/damage/useDamageStore.ts"
import type { DamageTrackKey } from "#/system/damageTrackKey.ts"
import { CounterField } from "../../ui/counter/counterField.tsx"

interface DamageCounterProps {
  trackKey: DamageTrackKey
  label: string
}

export const DamageCounter: FC<DamageCounterProps> = ({ trackKey, label }) => {
  const damageStore = useDamageStore()
  const current = useStore(damageStore, (state) => state[trackKey].current)
  const max = useStore(damageStore, (state) => state[trackKey].max)

  return (
    <CounterField
      label={label}
      value={current}
      min={0}
      max={max}
      onChange={(newValue) => newValue !== null && damageStore.setDamage(trackKey, newValue)}
    />
  )
}
