import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import { InfoSection } from '../UI/InfoBlock/InfoSection'
import { GearAvailCost } from './GearAvailCost'
import { GearData } from './GearData'

export interface GearHeaderProps {
  item: GearData
  type?: string
}

export const GearHeader: FC<GearHeaderProps> = ({
  item,
  type,
}) => {
  return (
    <InfoSection>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" sx={{ display: 'inline-block', color: 'primary.main' }}>{item.name}</Typography>
        </Box>
        <GearAvailCost item={item} />
      </Box>

      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">{type || item.type}</Typography>
        </Box>

        {item.source && (
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="overline">
              {item.source === 'Homebrew' ? 'Homebrew' : (
                <>{item.source.book} p.{item.source.page}</>
              )}
            </Typography>
          </Box>
        )}
      </Box>

      {item.description && (
        <Typography sx={{ fontStyle: 'italic' }}>{item.description}</Typography>
      )}

      {item.wirelessBonus && (
        <Box sx={{ fontStyle: 'italic' }}>
          <Typography variant="body2" sx={{ color: 'primary.main', display: 'inline' }}>Wireless Bonus:</Typography>
          <Typography variant="body2" sx={{ display: 'inline', marginLeft: 0.5}}>{item.wirelessBonus.description}</Typography>
        </Box>
      )}
    </InfoSection>
  )
}
