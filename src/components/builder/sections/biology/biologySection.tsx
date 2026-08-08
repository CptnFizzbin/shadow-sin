import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { produce } from "immer"
import type { FC } from "react"

import { getAttributesValues } from "#/components/runner/attributes/getAttributesValues.ts"
import { InnatePowersDisplay } from "#/components/runner/biology/innatePowersDisplay.tsx"
import { MovementDisplay } from "#/components/runner/biology/movementDisplay.tsx"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import { useRunnerStoreContext } from "#/lib/contexts/runner/runnerStore.context.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { awakenings } from "#/system/awakeningType.ts"
import { metatypes, MetatypeType } from "#/system/metatypeData.ts"

import { BiologyAttributes } from "./biologyAttributes.tsx"

export const BiologySection: FC = () => {
  const sheet = useRunnerStoreContext()
  const metatypeKey = useRunnerStoreSelector(Selectors.biology.selectMetatype)
  const awakeningType = useRunnerStoreSelector(Selectors.biology.selectAwakening)

  const currentMetatype = metatypes[metatypeKey]

  return (
    <>
      <FormControl fullWidth size="small">
        <InputLabel>Metatype</InputLabel>
        <Select
          value={metatypeKey}
          label="Metatype"
          onChange={(event) => {
            sheet.setState(produce((prev) => {
              const newMetatype = metatypes[event.target.value]
              const oldMetatype = metatypes[prev.biology.metatype]
              const awakening = awakenings[prev.biology.awakening]

              prev.biology.metatype = newMetatype.name
              prev.attributes = getAttributesValues(newMetatype, awakening)

              // Innate qualities come from the metatype itself, so switching metatypes must drop
              // the old metatype's innate qualities rather than leave them alongside the new one's.
              const oldInnateIds = new Set((oldMetatype.innateQualities ?? []).map((q) => q.id))
              const withoutOldInnate = prev.qualities.filter((q) => !oldInnateIds.has(q.id))
              prev.qualities = [...withoutOldInnate, ...(newMetatype.innateQualities ?? [])]
            }))
          }}
        >
          {Object.values(metatypes).filter(({ name }) => name !== MetatypeType.AI).map(({ name, cost }) => (
            <MenuItem value={name} key={name} sx={{ display: "flex" }}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", width: "100%" }}
              >
                <Typography>{name}</Typography>
                <BuildPoints value={cost} />
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {metatypeKey !== MetatypeType.AI && (
        <FormControl fullWidth size="small">
          <InputLabel>Awakening</InputLabel>
          <Select
            value={awakeningType}
            label="Awakening"
            onChange={(event) => {
              sheet.setState(produce((prev) => {
                const metatype = metatypes[prev.biology.metatype]
                const awakening = awakenings[event.target.value]

                prev.biology.awakening = awakening.name
                prev.attributes = getAttributesValues(metatype, awakening)
              }))
            }}
          >
            {Object.values(awakenings).map(({ name, cost }) => (
              <MenuItem value={name} key={name} sx={{ display: "flex" }}>
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between", width: "100%" }}
                >
                  <Typography>{name}</Typography>
                  <BuildPoints value={cost} />
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <BiologyAttributes />

      <MovementDisplay movement={currentMetatype.movement} />

      <InnatePowersDisplay powers={currentMetatype.innatePowers ?? []} />
    </>
  )
}
