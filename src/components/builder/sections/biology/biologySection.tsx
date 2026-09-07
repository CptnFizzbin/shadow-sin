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
import { useRunnerStoreContext } from "#/contexts/runner/runnerStore.context.ts"
import { BiologySelectors } from "#/stores/runner/biology/biologySlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { awakenings, AwakeningType } from "#/system/awakeningType.ts"
import { metatypes, MetatypeType } from "#/system/metatypeData.ts"

import { BiologyAttributes } from "./biologyAttributes.tsx"

export const BiologySection: FC = () => {
  const sheet = useRunnerStoreContext()
  const metatypeKey = useRunnerSelector(BiologySelectors.selectMetatype)
  const awakeningType = useRunnerSelector(BiologySelectors.selectAwakening)

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

              // AI may never have an Awakening at all — assign the reserved None sentinel when
              // switching to AI, and reset away from it (to Mundane) when switching off AI. Any
              // other metatype-to-metatype switch leaves the current Awakening choice untouched.
              const newAwakeningName = newMetatype.name === MetatypeType.AI
                ? AwakeningType.None
                : oldMetatype.name === MetatypeType.AI
                  ? AwakeningType.Mundane
                  : prev.biology.awakening
              const awakening = awakenings[newAwakeningName]

              prev.biology.metatype = newMetatype.name
              prev.biology.awakening = newAwakeningName
              prev.attributes = getAttributesValues(newMetatype, awakening)

              // Innate qualities come from the metatype itself, so switching metatypes must drop
              // the old metatype's innate qualities rather than leave them alongside the new one's.
              const oldInnateIds = new Set((oldMetatype.innateQualities ?? []).map((q) => q.id))
              const withoutOldInnate = prev.qualities.filter((q) => !oldInnateIds.has(q.id))
              prev.qualities = [...withoutOldInnate, ...(newMetatype.innateQualities ?? [])]
            }))
          }}
        >
          {Object.values(metatypes).map(({ name, cost }) => (
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
            {/* AwakeningType.None is reserved for AI (see the metatype Select's onChange above)
                and must never appear as a manual choice for any other metatype. */}
            {Object.values(awakenings)
              .filter(({ name }) => name !== AwakeningType.None)
              .map(({ name, cost }) => (
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
