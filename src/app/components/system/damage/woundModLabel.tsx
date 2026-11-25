import type { FC } from "react"

import { DamageSelectors } from "#state/runner/damage/damage.selector.ts"
import { useRunnerSelector } from "#state/runner/runnerStore.selectors.ts"
import { Label } from "#ui/text/label.tsx"

export const WoundModLabel: FC = () => {
  const woundMod = useRunnerSelector(DamageSelectors.selectWoundMod)

  return (
    <Label
      label={`Wound Mod: ${woundMod}`}
      variant="text"
      color={woundMod >= 1 ? "error.main" : "primary.dark"}
    />
  )
}
