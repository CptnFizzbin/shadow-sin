import { Box, Typography } from "@mui/material"
import React, { FC } from "react"

import { AttrList } from "../System/Attribute"
import { formatSource } from "../System/Source"
import { AttributeBlock } from "../UI/AttributeBlock"
import { InfoBlock } from "../UI/InfoBlock/InfoBlock"
import { Stat } from "../UI/StatBlock"
import { SpellCategory } from "./SpellCategory"
import { SpellData } from "./SpellData"

interface SpellBlockProps {
  spell: SpellData
}

export const SpellBlock: FC<SpellBlockProps> = ({ spell }) => {
  const attributes: SpellAttributes = {
    Range: spell.range,
    Type: spell.type,
    Duration: spell.duration,
    "Drain Value": spell.drainValue,
  }

  let subtitle: string = spell.category

  switch (spell.category) {
    case SpellCategory.Combat:
      attributes["Damage"] = spell.damage
      subtitle += ` (${spell.damageType}${spell.area ? ", Area" : ""})`
      break
    case SpellCategory.Illusion:
      subtitle += ` (${spell.senseType})`
      break
  }

  const blockTitleRight = (
    <Box sx={{ fontSize: 10, textAlign: "right" }}>
      {spell.source && (
        <Stat name="Source" value={formatSource(spell.source)} />
      )}
    </Box>
  )

  return (
    <InfoBlock
      expandId={spell.id}
      title={spell.name}
      subtitle={subtitle}
      expandable
      titleRight={blockTitleRight}
    >
      <AttributeBlock attributes={attributes} />
      <Typography>{spell.effect}</Typography>
    </InfoBlock>
  )
}

interface SpellAttributes extends AttrList {
  Range: string
  Type: string
  Duration: string
  "Drain Value": number
  Damage?: string
}
