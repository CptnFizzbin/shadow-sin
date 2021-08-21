import { faBroadcastTower, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box } from '@material-ui/core'
import { FC } from 'react'

import { AttributeBlock } from '../../../UI/AttributeBlock'
import { Stat, StatBlock } from '../../../UI/StatBlock'
import { formatAvail, formatCost, GearId } from '../../GearData'
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
  withAvail = false,
  withCost = false,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {autosofts.map(autosoft => (
        <AutosoftListItem
          key={autosoft.id}
          autosoft={autosoft}
          slavedIds={slavedIds}
          withAvail={withAvail}
          withCost={withCost}
        />
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
  withAvail = false,
  withCost = false,
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
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1 }}>
          <AttributeBlock attributes={autosoft.attributes} />
        </Box>
        {(withAvail || withCost) && (
          <Box sx={{ marginLeft: 1 }}>
            <StatBlock>
              {withAvail && <Stat name="Avail" value={formatAvail(autosoft.avail)} />}
              {withCost && <Stat name="Cost" value={formatCost(autosoft.cost)} />}
            </StatBlock>
          </Box>
        )}
      </Box>
    </Box>
  )
}
