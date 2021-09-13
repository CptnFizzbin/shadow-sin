import { Typography } from '@material-ui/core'
import { FC } from 'react'

import { QualitiesList } from '../../../Qualities/QualitiesList'
import { InfoSection } from '../../../UI/InfoBlock/InfoSection'
import { useCharacter } from '../../CharacterProvider'

export const QualitiesSection: FC = () => {
  const character = useCharacter()
  if (!character) return null

  return <InfoSection>
    <Typography variant={'h6'}>Qualities</Typography>
    <QualitiesList qualities={character.qualities} />
  </InfoSection>
}
