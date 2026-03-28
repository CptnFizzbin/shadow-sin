import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { BiologyAttributes } from "#/components/CharacterBuilder/Sections/Biology/BiologyAttributes.tsx"
import { useBuilderBiologyApi } from "#/components/CharacterBuilder/Sections/Biology/UseBiologyApi.ts"
import { BuildPoints } from "#/components/UI/BuildPoints.tsx"
import { MetatypeKey, metatypes } from "#/lib/system/MetatypeData.ts"
import { awakenings } from "#/lib/system/awakeningType.ts"

export const BiologySection: FC = () => {
  const { metatypeKey, awakeningType, setMetatype, setAwakening } =
    useBuilderBiologyApi()

  return (
    <>
      <FormControl fullWidth size="small">
        <InputLabel>Metatype</InputLabel>
        <Select
          value={metatypeKey}
          label="Metatype"
          onChange={(event) => setMetatype(event.target.value as MetatypeKey)}
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

      {metatypeKey !== MetatypeKey.AI && (
        <FormControl fullWidth size="small">
          <InputLabel>Awakening</InputLabel>
          <Select
            value={awakeningType}
            label="Awakening"
            onChange={(event) => setAwakening(event.target.value)}
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
