import { Paper, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import React, { FC } from 'react'

import { calculateAttributes } from '../System/Attribute'
import { AttributeProvider } from '../System/AttributeProvider'
import { formatNuyen } from '../System/Nuyen'
import { formatSource } from '../System/Source'
import { AttributeBlock } from '../UI/AttributeBlock'
import { InfoBlock } from '../UI/InfoBlock/InfoBlock'
import { InfoSection } from '../UI/InfoBlock/InfoSection'
import { Stat } from '../UI/StatBlock'
import { formatAvail } from './Availability'
import { useNestedGear } from './GearContext'
import { GearInfoProps } from './GearInfo'
import { GearList } from './GearList'

export const GearInfoBlock: FC<GearInfoProps> = ({
  item,
  expanded,
  children,
}) => {
  const blockTitleRight = <Box sx={{ fontSize: 10, textAlign: 'right' }}>
    {item.avail && <Stat name="Avail" value={formatAvail(item.avail)} />}
    {item.cost && <Stat name="Cost" value={formatNuyen(item.cost)} />}
    {item.source && <Stat name="Source" value={formatSource(item.source)} />}
  </Box>

  const attachedGear = useNestedGear(item.id)

  const expandable = Boolean(
    item.description
    || item.wirelessBonus
    || item.attributes
    || children
    || attachedGear.length > 0,
  )

  const attributes = calculateAttributes(item.attributes || {}, attachedGear)

  return (
    <AttributeProvider attributes={attributes}>
      <InfoBlock
        title={item.name}
        quantity={item.quantity || 0}
        subtitle={item.type}
        titleRight={blockTitleRight}
        expandable={expandable}
        expanded={expanded}
      >
        {item.description && (
          <InfoSection>
            <Typography sx={{ fontStyle: 'italic' }}>{item.description}</Typography>
          </InfoSection>
        )}

        {item.wirelessBonus && (
          <InfoSection>
            <Box sx={{ fontStyle: 'italic' }}>
              <Typography variant="body2" sx={{ color: 'primary.main', display: 'inline' }}>Wireless
                Bonus:</Typography>
              <Typography
                variant="body2"
                sx={{ display: 'inline', marginLeft: 0.5 }}
              >{item.wirelessBonus.description}</Typography>
            </Box>
          </InfoSection>
        )}

        <InfoSection>
          <AttributeBlock attributes={attributes} />
        </InfoSection>

        {children}

        {attachedGear.length >= 1 && (
          <Paper variant="outlined" sx={{ padding: 1 }}>
            <GearList gear={attachedGear} />
          </Paper>
        )}
      </InfoBlock>
    </AttributeProvider>
  )
}
