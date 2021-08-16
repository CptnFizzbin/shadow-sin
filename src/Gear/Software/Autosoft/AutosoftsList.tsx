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
        {autosofts.map(soft => (
          <TableRow key={soft.id}>
            <TableCell>
              {slavedIds?.includes(soft.id) && (
                <ScreenShareIcon fontSize={'small'} sx={{ verticalAlign: 'text-bottom', marginRight: 1}} />
              )}
              {soft.name}
            </TableCell>
            <TableCell>{soft.rating}</TableCell>
            <TableCell>{soft.skill || soft.weapon}</TableCell>
            <TableCell>{soft.attr}</TableCell>
            <TableCell><AvailabilityDisplay avail={soft.avail} /></TableCell>
            <TableCell><CostDisplay cost={soft.cost} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
