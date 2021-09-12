import { Box, Typography } from '@material-ui/core'
import { FC } from 'react'

import { AttrList } from '../System/Attribute'
import { AttributeBlock } from '../UI/AttributeBlock'
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
  const attributes: AttrList = {
    'Type': quality.type,
  }
  if (quality.level) attributes['Level'] = quality.level

  switch (quality.type) {
    case 'negative':
      attributes['Bonus'] = quality.bonus
      break
    case 'positive':
      attributes['Cost'] = quality.cost
      break
  }

  return (
    <Box>
      <Typography variant="body1">{quality.name}</Typography>
      <Typography variant="caption">{quality.description}</Typography>
      <Typography variant="caption">{quality.gameEffect}</Typography>

      <AttributeBlock attributes={attributes} />
    </Box>
  )
}
