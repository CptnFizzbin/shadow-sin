import { faBroadcastTower, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box } from '@material-ui/core'
import { FC } from 'react'

import { Stat, StatBlock } from '../../../UI/StatBlock'
import { GearId } from '../../GearData'
import { AvailabilityStat, CostStat } from '../../Stats'
import { AutosoftData } from './AutosoftData'

interface AutosoftsListProps {
  autosofts: AutosoftData[]
  slavedIds?: GearId[]
}

export const AutosoftsList: FC<AutosoftsListProps> = ({
  autosofts,
  slavedIds,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {autosofts.map(autosoft => <AutosoftListItem key={autosoft.id} autosoft={autosoft} slavedIds={slavedIds} />)}
    </Box>
  )
}

interface AutosoftListItemProps {
  autosoft: AutosoftData
  slavedIds?: GearId[]
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
      <Box>
        <StatBlock>
          {Object.entries(autosoft.attributes).map(([type, attr]) => (
            <Stat key={type} name={attr.name} value={attr.value === null ? '-' : attr.value} />
          ))}
          <AvailabilityStat avail={autosoft.avail} />
          <CostStat cost={autosoft.cost} />
        </StatBlock>
      </Box>
    </Box>
  )
}
