import { Box } from '@mui/material'
import { FC } from 'react'

import { SlottableMod, VehicleModAttr } from '../Gear/Vehicles/VehicleModData'
import { Slot } from './Slot'

interface SlottedItemListProps {
  items: SlottableMod[]
}

export const SlottedItemList: FC<SlottedItemListProps> = ({
  items,
}) => {
  return (
    <Box>
      {items.map(item => (
        <Slot key={item.id} size={item.attributes[VehicleModAttr.slotCost]} name={item.name} />
      ))}
    </Box>
  )
}
