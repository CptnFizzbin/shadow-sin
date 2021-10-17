import { Stack, Typography } from '@mui/material'
import React, { FC } from 'react'

import { formatSource } from '../System/Source'
import { SimpleInfoBlock } from '../UI/InfoBlock/SimpleInfoBlock'
import { Stat } from '../UI/StatBlock'
import { QualityData } from './QualityData'

interface ContactListProps {
  qualities: QualityData[]
}

export const QualitiesList: FC<ContactListProps> = ({
  qualities,
}) => {
  return (
    <Stack gap={1}>
      {qualities.map(quality => (
        <SimpleInfoBlock
          key={quality.name}
          name={quality.name}
          attributes={
            <>
              {quality.source && <Stat name="Source" value={formatSource(quality.source)} />}
              {quality.bonus && <Stat name="Bonus" value={quality.bonus} />}
              {quality.cost && <Stat name="Cost" value={quality.cost} />}
              {quality.level && <Stat name="Level" value={quality.level} />}
            </>
          }
        >
          <Typography variant="caption">{quality.description}</Typography>
          <Typography variant="caption">{quality.gameEffect}</Typography>
        </SimpleInfoBlock>
      ))}
    </Stack>
  )
}
