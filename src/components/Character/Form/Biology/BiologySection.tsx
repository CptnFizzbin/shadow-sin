import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useEffect, useRef } from "react"

import { createAttrFormState } from "#/components/Character/Form/AttrFormState.ts"
import { BiologyAttributes } from "#/components/Character/Form/Biology/BiologyAttributes.tsx"
import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import { MetatypeKey, metatypes } from "#/lib/system/types/MetatypeData.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import { AwakeningType, awakenings } from "#/lib/system/types/awakeningType.ts"

export const BiologySection: FC = () => {
  const storeSlice = useCharacterBuilderStoreSlice((state) => state)
  const metatypeKey = useCharacterBuilderStore((state) => state.metatype)
  const awakeningType = useCharacterBuilderStore((state) => state.awakening)

  const prevAwakeningRef = useRef(awakeningType)
  const isInitialMountRef = useRef(true)

  useEffect(() => {
    if (metatypeKey === MetatypeKey.AI) {
      storeSlice.update((draft) => {
        draft.awakening = AwakeningType.Mundane
      })
    }
  }, [metatypeKey, storeSlice])

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false
      return
    }

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

      prevAwakeningRef.current = awakeningType
    })
  }, [metatypeKey, awakeningType, storeSlice])

  return (
    <>
      <FormControl fullWidth size="small">
        <InputLabel>Metatype</InputLabel>
        <Select
          value={metatypeKey}
          label="Metatype"
          onChange={(event) =>
            storeSlice.update((draft) => {
              draft.metatype = event.target.value as MetatypeKey
            })
          }
        >
          {Object.values(metatypes).map(({ name, cost }) => (
            <MenuItem value={name} key={name} sx={{ display: "flex" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
              >
                <Typography>{name}</Typography>
                <Typography variant="subtitle2" color="secondary.main">
                  {cost} BP
                </Typography>
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
            onChange={(event) =>
              storeSlice.update((draft) => {
                draft.awakening = event.target.value as AwakeningType
              })
            }
          >
            {Object.values(awakenings).map(({ name, cost }) => (
              <MenuItem value={name} key={name} sx={{ display: "flex" }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Typography>{name}</Typography>
                  <Typography variant="subtitle2" color="secondary.main">
                    {cost} BP
                  </Typography>
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
