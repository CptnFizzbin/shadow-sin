import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { createAttrFormState } from "#/components/CharacterBuilder/Attributes/AttrFormState.ts"
import { BiologyAttributes } from "#/components/CharacterBuilder/Biology/BiologyAttributes.tsx"
import { useCharacterBuilderStoreSlice } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { BuildPoints } from "#/components/UI/BuildPoints.tsx"
import { MetatypeKey, metatypes } from "#/lib/system/types/MetatypeData.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import type { AwakeningType } from "#/lib/system/types/awakeningType.ts"
import { awakenings } from "#/lib/system/types/awakeningType.ts"

export const BiologySection: FC = () => {
  const storeSlice = useCharacterBuilderStoreSlice(
    (state) => state,
    (_state, newState) => newState,
  )
  const metatypeKey = storeSlice.state.metatype
  const awakeningType = storeSlice.state.awakening

  const updateAttributes = (
    metatypeKey: MetatypeKey,
    awakeningType: AwakeningType,
  ) => {
    const metatype = metatypes[metatypeKey]
    const awakening = awakenings[awakeningType]

    const attrsToUpdate = Object.values(AttributeKey).filter(
      (attr) => attr !== AttributeKey.essence,
    )

    storeSlice.update((draft) => {
      draft.buildPoints.spent.attributes = 0

      for (const attr of attrsToUpdate) {
        draft.attributes[attr] = createAttrFormState({
          value: metatype.attributes[attr].min,
          attr: attr,
          metatype: metatype,
          awakening: awakening,
        })
      }
    })
  }

  const onMetatypeChange = (newMetatype: MetatypeKey) => {
    storeSlice.update((draft) => {
      draft.metatype = newMetatype
    })

    updateAttributes(newMetatype, awakeningType)
  }

  const onAwakeningChange = (newAwakening: AwakeningType) => {
    storeSlice.update((draft) => {
      draft.awakening = newAwakening
    })

    updateAttributes(metatypeKey, newAwakening)
  }

  return (
    <>
      <FormControl fullWidth size="small">
        <InputLabel>Metatype</InputLabel>
        <Select
          value={metatypeKey}
          label="Metatype"
          onChange={(event) => onMetatypeChange(event.target.value)}
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
            onChange={(event) => onAwakeningChange(event.target.value)}
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
