import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { metatypes } from "#/system/metatypeData.ts"

import { InnatePowersDisplay } from "./innatePowersDisplay.tsx"
import { MovementDisplay } from "./movementDisplay.tsx"

interface BiologyRowProps {
  label: string
  value: string | number
}

const BiologyRow: FC<BiologyRowProps> = ({ label, value }) => (
  <Stack direction="row" sx={{ gap: 1, alignItems: "baseline" }}>
    <Typography color="text.secondary" sx={{ minWidth: 100 }}>
      {label}
    </Typography>
    <Typography>
      {value}
    </Typography>
  </Stack>
)

export const BiologySection: FC = () => {
  const biology = useRunnerStoreSelector((s) => s.biology)
  const metatype = metatypes[biology.metatype]

  return (
    <Stack sx={{ gap: 1 }}>
      <Label label="Biology" />

      <Stack sx={{ gap: 0.5 }}>
        <BiologyRow label="Metatype" value={biology.metatype} />
        <BiologyRow label="Awakening" value={biology.awakening} />
        {biology.gender && <BiologyRow label="Gender" value={biology.gender} />}
        {biology.age !== null && <BiologyRow label="Age" value={biology.age} />}
        {biology.height && <BiologyRow label="Height" value={biology.height} />}
        {biology.weight && <BiologyRow label="Weight" value={biology.weight} />}
      </Stack>

      <MovementDisplay movement={metatype.movement} />

      <InnatePowersDisplay powers={metatype.innatePowers ?? []} />
    </Stack>
  )
}
