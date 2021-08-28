import { Typography } from '@material-ui/core'
import React, { FC } from 'react'

import { CharacterInfo } from './CharacterInfo'

export const CharacterPage: FC = () => {
  return (
    <>
      <Typography variant={'h4'}>Character</Typography>
      <CharacterInfo />
    </>
  )
}
