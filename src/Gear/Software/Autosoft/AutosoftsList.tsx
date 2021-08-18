import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import ScreenShareIcon from '@material-ui/icons/ScreenShare'
import { FC } from 'react'

import { GearId } from '../../GearData'
import { AvailabilityDisplay, CostDisplay } from '../../Stats'
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
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Rating</TableCell>
          <TableCell>Skill/Weapon</TableCell>
          <TableCell>Attribute</TableCell>
          <TableCell>Avail</TableCell>
          <TableCell>Cost</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {autosofts.map(autosoft => <AutosoftListItem key={autosoft.id} autosoft={autosoft} slavedIds={slavedIds} />)}
      </TableBody>
    </Table>
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
  const rating = autosoft.attributes.rating.value
  const skill = autosoft.attributes.rating.value
  const weapon = autosoft.attributes.rating.value
  const attr = autosoft.attributes.rating.value

  return (
    <TableRow key={autosoft.id}>
      <TableCell>
        {slavedIds?.includes(autosoft.id) && (
          <ScreenShareIcon fontSize={'small'} sx={{ verticalAlign: 'text-bottom', marginRight: 1 }} />
        )}
        {autosoft.name}
      </TableCell>
      <TableCell>{rating}</TableCell>
      <TableCell>{skill || weapon}</TableCell>
      <TableCell>{attr}</TableCell>
      <TableCell><AvailabilityDisplay avail={autosoft.avail} /></TableCell>
      <TableCell><CostDisplay cost={autosoft.cost} /></TableCell>
    </TableRow>
  )
}
