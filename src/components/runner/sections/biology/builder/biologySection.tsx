import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { BuildPoints } from "#/components/builder/buildPoints.tsx"
import { getAttributesValues } from "#/components/entities/attributes/viewer/getAttributesValues.ts"
import { InnatePowersDisplay } from "#/components/runner/sections/biology/viewer/innatePowersDisplay.tsx"
import { MovementDisplay } from "#/components/runner/sections/biology/viewer/movementDisplay.tsx"
import { useAppDispatch } from "#/state/rootState.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { RunnerActions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { metatypes, MetatypeType } from "#/system/model/biology/metatypeData.ts"
import { awakenings, AwakeningType } from "#/system/model/magic/awakeningType.ts"

import { BiologyAttributes } from "./biologyAttributes.tsx"

export const BiologySection: FC = () => {
  const dispatch = useAppDispatch()
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
            dispatch(RunnerActions.update((prev) => {
              const newMetatype = metatypes[event.target.value]
              const oldMetatype = metatypes[prev.biology.metatype]

              let newAwekening = awakenings[prev.biology.awakening]
              if (newMetatype.name === MetatypeType.AI) {
                newAwekening = awakenings[AwakeningType.None]
              } else if (prev.biology.awakening === AwakeningType.None) {
                newAwekening = awakenings[AwakeningType.Mundane]
              }

              prev.biology.metatype = newMetatype.name
              prev.biology.awakening = newAwekening.name
              prev.attributes = getAttributesValues(newMetatype, newAwekening)

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
              dispatch(RunnerActions.update((prev) => {
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
