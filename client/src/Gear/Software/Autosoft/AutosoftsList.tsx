import { faBroadcastTower, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box } from '@material-ui/core'
import { FC } from 'react'

import { AttributeBlock } from '../../../UI/AttributeBlock'
import { GearId } from '../../GearData'
import { AutosoftData } from './AutosoftData'

interface AutosoftsListProps {
  autosofts: AutosoftData[]
  slavedIds?: GearId[]
  withAvail?: boolean
  withCost?: boolean
}

export const AutosoftsList: FC<AutosoftsListProps> = ({
  autosofts,
  slavedIds,
}) => {
  return (
    <Box>
      {autosofts.map(autosoft => (
        <Box key={autosoft.id} sx={{paddingTop: 1}}>
          <AutosoftListItem
            key={autosoft.id}
            autosoft={autosoft}
            slavedIds={slavedIds}
          />
        </Box>
      ))}
    </Box>
  )
}

interface AutosoftListItemProps {
  autosoft: AutosoftData
  slavedIds?: GearId[]
  withAvail?: boolean
  withCost?: boolean
}

const AutosoftListItem: FC<AutosoftListItemProps> = ({
  autosoft,
  slavedIds,
}) => {
  return (
    <Box>
      <Box>
        <Box sx={{ display: 'inline-block', marginRight: 1 }}>
          {slavedIds?.includes(autosoft.id) ? (
            <FontAwesomeIcon icon={faBroadcastTower} />
          ) : (
            <FontAwesomeIcon icon={faSave} />
          )}
        </Box>
        {autosoft.name}
      </Box>

      <AttributeBlock attributes={autosoft.attributes} />
    </Box>
  )
}
