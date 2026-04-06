import type { FC } from "react"

import { useWoundModifier } from "#/components/damage/useWoundModifier.ts"
import { Label } from "#/components/ui/text/label.tsx"

export const WoundModLabel: FC = () => {
  const woundMod = useWoundModifier()

  return (
    <Label
      label={`Wound Mod: ${woundMod}`}
      variant="outlined"
      color={woundMod >= 1 ? "error.main" : "primary.dark"}
    />
  )
}
