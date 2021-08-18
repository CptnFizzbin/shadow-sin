import { Paper } from '@material-ui/core'

import { AttributeProvider, useAttributes } from '../System/AttributeProvider'
import { useAttachedGear } from './GearContext'
import { GearInfoBlock } from './GearInfo'
import { GearList } from './GearList'

export const NestedGear: GearInfoBlock = ({
  item,
}) => {
  const attachedGear = useAttachedGear(item.id)
  const attributes = {
    ...useAttributes(),
    ...item.attributes,
  }

  if (attachedGear.length === 0) return null

  return (
    <Paper variant="outlined" sx={{ padding: 1 }}>
      <AttributeProvider attributes={attributes}>
        <GearList gear={attachedGear} />
      </AttributeProvider>
    </Paper>
  )
}
