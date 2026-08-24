import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { useWoundModifier } from "#/hooks/system/damage/useWoundModifier.ts"

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
