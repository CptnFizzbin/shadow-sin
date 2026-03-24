import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { createAttrLimits } from "#/components/Character/Form/AttrFormState.ts"
import { BiologyAttributes } from "#/components/Character/Form/Biology/BiologyAttributes.tsx"
import { useCharacterSheetSlice } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import { useBuilderStoreSlice } from "#/components/CharacterBuilder/BuilderStoreProvider.tsx"
import { BuildPoints } from "#/components/UI/BuildPoints.tsx"
import { MetatypeKey, metatypes } from "#/lib/system/types/MetatypeData.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import type { AwakeningType } from "#/lib/system/types/awakeningType.ts"
import { awakenings } from "#/lib/system/types/awakeningType.ts"

export const BiologySection: FC = () => {
  const characterSlice = useCharacterSheetSlice(
    (state) => state,
    (_state, newState) => newState,
  )
  const builderSlice = useBuilderStoreSlice(
    (state) => state,
    (_state, newState) => newState,
  )

  const metatypeKey = characterSlice.state.metatype
  const awakeningType = characterSlice.state.awakening

  const updateAttributes = (
    newMetatypeKey: MetatypeKey,
    newAwakeningType: AwakeningType,
  ) => {
    const metatype = metatypes[newMetatypeKey]
    const awakening = awakenings[newAwakeningType]

    const attrsToUpdate = Object.values(AttributeKey).filter(
      (attr) => attr !== AttributeKey.essence,
    )

    characterSlice.update((draft) => {
      for (const attr of attrsToUpdate) {
        const limits = createAttrLimits({ attr, metatype, awakening })
        draft.attributes[attr] = limits.min
      }
    })

    builderSlice.update((draft) => {
      draft.buildPoints.spent.attributes = 0
      for (const attr of attrsToUpdate) {
        const limits = createAttrLimits({ attr, metatype, awakening })
        draft.attributeLimits[attr] = limits
      }
    })
  }

  const onMetatypeChange = (newMetatype: MetatypeKey) => {
    characterSlice.update((draft) => {
      draft.metatype = newMetatype
    })
    updateAttributes(newMetatype, awakeningType)
  }

  const onAwakeningChange = (newAwakening: AwakeningType) => {
    characterSlice.update((draft) => {
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
