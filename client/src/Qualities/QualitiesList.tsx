import { Box, Paper, Typography } from '@material-ui/core'
import React, { FC } from 'react'

import { formatSource } from '../System/Source'
import { Stat } from '../UI/StatBlock'
import { QualityData } from './QualityData'

interface ContactListProps {
  qualities: QualityData[]
}

export const QualitiesList: FC<ContactListProps> = ({
  qualities,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
      {qualities.map(quality => (
        <Box key={quality.name}>
          <QualitiesListItem quality={quality} />
        </Box>
      ))}
    </Box>
  )
}

interface QualitiesListItemProps {
  quality: QualityData
}

export const QualitiesListItem: FC<QualitiesListItemProps> = ({
  quality,
}) => {
  return (
    <Paper variant="outlined" sx={{ padding: 1, display: 'flex' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body1">{quality.name}</Typography>
        <Typography variant="caption">{quality.description}</Typography>
        <Typography variant="caption">{quality.gameEffect}</Typography>
      </Box>

      <Box>
        {quality.source && <Stat name="Source" value={formatSource(quality.source)} />}
        {quality.bonus && <Stat name="Bonus" value={quality.bonus} />}
        {quality.cost && <Stat name="Cost" value={quality.cost} />}
        {quality.level && <Stat name="Level" value={quality.level} />}
      </Box>
    </Paper>
  )
}
