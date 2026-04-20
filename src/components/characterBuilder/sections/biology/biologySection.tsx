import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import { produce } from "immer"
import type { FC } from "react"

import { getAttributesValues } from "#/components/attributes/getAttributesValues.ts"
import { useBiologyStore } from "#/components/biology/useBiologyStore.ts"
import { useCharacterSheetContext } from "#/components/character/characterSheetProvider.tsx"
import { BiologyAttributes } from "#/components/characterBuilder/sections/biology/biologyAttributes.tsx"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import { awakenings } from "#/system/awakeningType.ts"
import { metatypes, MetatypeType } from "#/system/metatypeData.ts"

export const BiologySection: FC = () => {
  const sheet = useCharacterSheetContext()
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
            sheet.setState(produce((prev) => {
              const metatype = metatypes[event.target.value]
              const awakening = awakenings[prev.biology.awakening]

              prev.biology.metatype = metatype.name
              prev.attributes = getAttributesValues(metatype, awakening)
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
    </>
  )
}
