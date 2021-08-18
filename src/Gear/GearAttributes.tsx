import Box from '@material-ui/core/Box'

import { AttributeBlock } from '../UI/AttributeBlock'
import { GearInfoBlock } from './GearInfo'

export const GearAttributes: GearInfoBlock = ({
  item,
}) => {
  if (!item.attributes) return null

  return (
    <Box sx={{ padding: 1 }}>
      <AttributeBlock attributes={item.attributes} />
    </Box>
  )
}
