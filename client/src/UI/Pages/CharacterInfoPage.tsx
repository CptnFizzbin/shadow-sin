import { Typography } from '@material-ui/core'
import React, { FC } from 'react'

import { CharacterInfo } from '../../Character/CharacterInfo'

export const CharacterInfoPage: FC = () => {
  return (
    <>
      <Typography variant={'h4'}>Character</Typography>
      <CharacterInfo />
    </>
  )
}
