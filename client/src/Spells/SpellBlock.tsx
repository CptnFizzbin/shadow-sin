import { Box, Typography } from '@mui/material'
import React, { FC } from 'react'

import { AttrList } from '../System/Attribute'
import { formatSource } from '../System/Source'
import { AttributeBlock } from '../UI/AttributeBlock'
import { InfoBlock } from '../UI/InfoBlock/InfoBlock'
import { Stat } from '../UI/StatBlock'
import { SpellCategory } from './SpellCategory'
import { SpellData } from './SpellData'

interface SpellBlockProps {
  spell: SpellData
}

export const SpellBlock: FC<SpellBlockProps> = ({
  spell,
}) => {
  const attributes: SpellAttributes = {
    'Range': spell.range,
    'Type': spell.type,
    'Duration': spell.duration,
    'Drain Value': spell.drainValue,
  }

  if (spell.category === SpellCategory.Combat) {
    attributes['Damage'] = spell.damage
  }

  const blockTitleRight = <Box sx={{ fontSize: 10, textAlign: 'right' }}>
    {spell.source && <Stat name="Source" value={formatSource(spell.source)} />}
  </Box>

  return (
    <InfoBlock title={spell.name} subtitle={spell.category} expandable titleRight={blockTitleRight}>
      <Box padding={1}>
        <AttributeBlock attributes={attributes} />
      </Box>
      <Box padding={1}>
        <Typography>{spell.effect}</Typography>
      </Box>
    </InfoBlock>
  )
}

interface SpellAttributes extends AttrList {
  'Range': string
  'Type': string
  'Duration': string
  'Drain Value': number
  'Damage'?: string
}
