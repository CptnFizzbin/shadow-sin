import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import { produce } from "immer"
import type { FC } from "react"

import { BiologyAttributes } from "#/components/CharacterBuilder/Sections/Biology/BiologyAttributes.tsx"
import { useBiologyStore } from "#/components/CharacterBuilder/Sections/Biology/UseBiologyStore.ts"
import { BuildPoints } from "#/components/UI/BuildPoints.tsx"
import { metatypes, MetatypeType } from "#/lib/system/MetatypeData.ts"
import { awakenings } from "#/lib/system/awakeningType.ts"

export const BiologySection: FC = () => {
  const biologyStore = useBiologyStore()
  const metatypeKey = useStore(biologyStore, (state) => state.metatype)
  const awakeningType = useStore(biologyStore, (state) => state.awakening)

  return (
    <>
      <FormControl fullWidth size="small">
        <InputLabel>Metatype</InputLabel>
        <Select
          value={metatypeKey}
          label="Metatype"
          onChange={(event) => {
            biologyStore.setState(produce((prev) => {
              prev.metatype = event.target.value
            }))
          }}
        >
          {Object.values(metatypes).map(({ name, cost }) => (
            <MenuItem value={name} key={name} sx={{ display: "flex" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
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
              biologyStore.setState(produce((prev) => {
                prev.awakening = event.target.value
              }))
            }}
          >
            {Object.values(awakenings).map(({ name, cost }) => (
              <MenuItem value={name} key={name} sx={{ display: "flex" }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  width="100%"
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
    </>
  )
}
