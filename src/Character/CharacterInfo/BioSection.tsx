import { Box, Paper, Stack, Typography } from "@mui/material"
import { FC } from "react"

import { useCharacterData } from "../CharacterProvider"

export const BioSection: FC = () => {
  const character = useCharacterData()
  if (!character) return null

  const bio = character.bio

  return (
    <Paper variant="outlined" sx={{ padding: 1 }}>
      <Stack gap={2} direction="row" sx={{ flexWrap: "wrap" }}>
        <BioField name="Alias" value={bio.alias} />
        <BioField name="Name" value={bio.name} />
        <BioField name="Awakened" value={bio.awakened} />
        <BioField name="Gender" value={bio.gender} />
        <BioField name="Metatype" value={bio.metatype} />
        <BioField name="Age" value={bio.age} />
        <BioField name="Role" value={bio.role} />
        <BioField name="Ethnicity" value={bio.ethnicity} />
        <BioField name="Height" value={bio.height} />
        <BioField name="Weight" value={bio.weight} />
      </Stack>
    </Paper>
  )
}

interface BioFieldProps {
  name: string
  value: string | undefined
}

export const BioField: FC<BioFieldProps> = ({ name, value }) => {
  if (!value) return null

  return (
    <Box>
      <Typography variant="caption" color="primary">
        {name}
      </Typography>
      <Typography>{value}</Typography>
    </Box>
  )
}
