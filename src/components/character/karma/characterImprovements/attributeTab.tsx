import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useEffect, useState } from "react"

import { useAllAttrInfos } from "#/components/character/characterUtils.ts"
import { useCharacterSheetSelector } from "#/components/character/sheet/characterSheet.selectors.ts"
import { AttributeKey, AttributeLabels, AttributeOrder } from "#/system/attributeKey.ts"

import { useSpendKarmaDialogContext } from "./forms/spendKarmaDialogContext.tsx"
import { ImprovementsStore } from "./improvementsStore.ts"

const attributeKarmaCost = (newRating: number) => 5 * newRating

export const AttributeTab: FC = () => {
  const { setPendingImprovement } = useSpendKarmaDialogContext()
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeKey | "">("")
  const attributes = useCharacterSheetSelector((sheet) => sheet.attributes)
  const attrInfos = useAllAttrInfos()

  const availableAttributes = AttributeOrder.filter((key) => {
    if (key === AttributeKey.essence) return false
    const info = attrInfos[key]
    const currentValue = attributes[key]
    return info.max > 0 && currentValue < info.max
  })

  useEffect(() => {
    if (!selectedAttribute) {
      setPendingImprovement(null)
      return
    }

    const currentValue = attributes[selectedAttribute]
    const nextRating = currentValue + 1
    const improvementsStore = new ImprovementsStore({ improvements: [] })
    improvementsStore.improveAttribute(selectedAttribute, nextRating)

    setPendingImprovement({ improvementsStore, karmaCost: attributeKarmaCost(nextRating) })
  }, [attributes, selectedAttribute, setPendingImprovement])

  if (availableAttributes.length === 0) {
    return (
      <Typography color="text.secondary">
        All attributes are already at their natural maximum.
      </Typography>
    )
  }

  return (
    <FormControl fullWidth size="small">
      <InputLabel>Attribute</InputLabel>
      <Select
        value={selectedAttribute}
        label="Attribute"
        onChange={(event) => setSelectedAttribute(event.target.value as AttributeKey | "")}
      >
        {availableAttributes.map((key) => {
          const currentValue = attributes[key]
          const newValue = currentValue + 1
          const cost = attributeKarmaCost(newValue)
          return (
            <MenuItem key={key} value={key}>
              <Stack direction="row" sx={{ gap: 1, alignItems: "center", justifyContent: "space-between", flexGrow: 1 }}>
                <Typography>{AttributeLabels[key]}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: "small" }}>
                  {currentValue} → {newValue} / {attrInfos[key].max} &nbsp;·&nbsp; {cost} karma
                </Typography>
              </Stack>
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}
