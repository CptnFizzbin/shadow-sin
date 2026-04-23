import type { FC } from "react"

import { useWoundModifier } from "#/components/system/damage/useWoundModifier.ts"
import { Label } from "#/components/ui/text/label.tsx"

export const WoundModLabel: FC = () => {
  const woundMod = useWoundModifier()

  return (
    <Label
      label={`Wound Mod: ${woundMod}`}
      variant="text"
      color={woundMod >= 1 ? "error.main" : "primary.dark"}
    />
  )
}
