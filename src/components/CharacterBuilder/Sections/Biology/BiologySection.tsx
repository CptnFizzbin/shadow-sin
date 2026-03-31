import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import { produce } from "immer"
import type { FC } from "react"

import { getAttributesValues } from "#/components/Attributes/GetAttributesValues.ts"
import { useBiologyStore } from "#/components/Biology/UseBiologyStore.ts"
import { useCharacterSheetContext } from "#/components/Character/CharacterSheetProvider.tsx"
import { BiologyAttributes } from "#/components/CharacterBuilder/Sections/Biology/BiologyAttributes.tsx"
import { BuildPoints } from "#/components/UI/BuildPoints.tsx"
import { metatypes, MetatypeType } from "#/lib/system/MetatypeData.ts"
import { awakenings } from "#/lib/system/awakeningType.ts"

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
