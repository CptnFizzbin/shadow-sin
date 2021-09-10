import { faArchive, faCarAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { List } from '@material-ui/core'
import { FC } from 'react'

import { useCharacter } from '../../Character/CharacterProvider'
import { PistolSvg } from '../../Gear/Weapons/PistolSvg'
import { NavButton, NavDrawer, NavDrawerProps } from './NavDrawer'

export const CharacterNavDrawer: FC<NavDrawerProps> = ({
  open,
  closeDrawer,
}) => {
  const character = useCharacter()

  if (!character) return null

  return (
    <NavDrawer open={open} closeDrawer={closeDrawer}>
      <List>
        <NavButton
          icon={<FontAwesomeIcon icon={faUser} />}
          label={character.name}
          routeTo={`/${character.id}`}
          closeDrawer={closeDrawer}
        />
        <NavButton
          icon={<PistolSvg />}
          label="Weapons"
          routeTo={`/${character.id}/weapons`}
          closeDrawer={closeDrawer}
        />
        <NavButton
          icon={<FontAwesomeIcon icon={faCarAlt} />}
          label="Vehicles"
          routeTo={`/${character.id}/vehicles`}
          closeDrawer={closeDrawer}
        />
        <NavButton
          icon={<FontAwesomeIcon icon={faArchive} />}
          label="Other"
          routeTo={`/${character.id}/misc`}
          closeDrawer={closeDrawer}
        />
      </List>
    </NavDrawer>
  )
}
