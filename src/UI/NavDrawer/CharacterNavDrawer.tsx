import {
  faArchive,
  faAward,
  faCarAlt,
  faCogs,
  faMagic,
  faUser,
  faYenSign,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Divider, List } from "@mui/material"

import { CharacterAttr } from "../../Character/CharacterAttr"
import { useCharacter } from "../../Character/CharacterProvider"
import { PistolSvg } from "../../Gear/Weapons/PistolSvg"
import { useAttribute } from "../../System/AttributeProvider"
import { DefaultNavDrawer } from "./DefaultNavDrawer"

import { NavButton, NavDrawer } from "./index"

export const CharacterNavDrawer: NavDrawer = ({ open, closeDrawer }) => {
  const character = useCharacter()
  const showSpells = useAttribute(CharacterAttr.magic) || 0 >= 1

  if (!character) return null

  return (
    <DefaultNavDrawer open={open} closeDrawer={closeDrawer}>
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
        {showSpells && (
          <NavButton
            icon={<FontAwesomeIcon icon={faMagic} />}
            label="Spells"
            routeTo={`/${character.id}/spells`}
            closeDrawer={closeDrawer}
          />
        )}
        <NavButton
          icon={<FontAwesomeIcon icon={faCarAlt} />}
          label="Vehicles"
          routeTo={`/${character.id}/vehicles`}
          closeDrawer={closeDrawer}
        />
        <NavButton
          icon={<FontAwesomeIcon icon={faCogs} />}
          label="Augments"
          routeTo={`/${character.id}/augments`}
          closeDrawer={closeDrawer}
        />
        <NavButton
          icon={<FontAwesomeIcon icon={faArchive} />}
          label="Other"
          routeTo={`/${character.id}/misc`}
          closeDrawer={closeDrawer}
        />
        <Divider />
        <NavButton
          icon={<FontAwesomeIcon icon={faYenSign} />}
          label="Nyuen"
          routeTo={`/${character.id}/Nuyen`}
          closeDrawer={closeDrawer}
        />
        <NavButton
          icon={<FontAwesomeIcon icon={faAward} />}
          label="Karma"
          routeTo={`/${character.id}/karma`}
          closeDrawer={closeDrawer}
        />
      </List>
    </DefaultNavDrawer>
  )
}
