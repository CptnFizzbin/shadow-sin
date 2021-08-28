import { Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import React, { FC } from 'react'

import { AttributeProvider } from '../System/AttributeProvider'
import { InfoBlock } from '../UI/InfoBlock/InfoBlock'
import { InfoSection } from '../UI/InfoBlock/InfoSection'
import { Stat } from '../UI/StatBlock'
import { GearAttributes } from './GearAttributes'
import { useAttachedGear } from './GearContext'
import { formatAvail, formatCost, formatSource } from './GearData'
import { GearInfoProps } from './GearInfo'
import { NestedGear } from './NestedGear'

export const GearInfoBlock: FC<GearInfoProps> = ({
  item,
  expanded,
  children,
}) => {
  const blockTitleRight = <Box sx={{ fontSize: 10, textAlign: 'right' }}>
    {item.avail && <Stat name="Avail" value={formatAvail(item.avail)} />}
    {item.cost && <Stat name="Cost" value={formatCost(item.cost)} />}
    {item.source && <Stat name="Source" value={formatSource(item.source)} />}
  </Box>

  const attachedGear = useAttachedGear(item.id)

  const expandable = Boolean(
    item.description
    || item.wirelessBonus
    || item.attributes
    || children
    || attachedGear.length > 0,
  )

  return (
    <AttributeProvider attributes={item.attributes || {}}>
      <InfoBlock
        title={item.name}
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

        {item.attributes && <GearAttributes item={item} />}

        {children}

        <NestedGear item={item} />
      </InfoBlock>
    </AttributeProvider>
  )
}
