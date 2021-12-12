import { Box, Paper, Stack, Typography } from '@mui/material'
import React, { FC } from 'react'

import { useCharacterData } from '../CharacterProvider'

export const BioSection: FC = () => {
  const character = useCharacterData()
  if (!character) return null

  const bio = character.bio

  return (
    <Box sx={{ padding: 1 }}>
      <Paper variant="outlined" sx={{ padding: 1 }}>
        <Stack gap={2} direction="row" sx={{ flexWrap: 'wrap' }}>
          <BioField name="Name" value={bio.name} />
          <BioField name="Metatype" value={bio.metatype} />
          <BioField name="Awakened" value={bio.awakened} />
          <BioField name="Role" value={bio.role} />
          <BioField name="Alias" value={bio.alias} />
          <BioField name="Ethnicity" value={bio.ethnicity} />
          <BioField name="Age" value={bio.age} />
          <BioField name="Gender" value={bio.gender} />
          <BioField name="Height" value={bio.height} />
          <BioField name="Weight" value={bio.weight} />
        </Stack>
      </Paper>
    </Box>
  )
}

interface BioFieldProps {
  name: string
  value: string | undefined
}

export const BioField: FC<BioFieldProps> = ({
  name,
  value,
}) => {
  if (!value) return null

  return (
    <Box>
      <Typography variant="caption" color="primary">{name}</Typography>
      <Typography>{value}</Typography>
    </Box>
  )
}
