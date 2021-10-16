import { MenuItem, Stack, TextField } from '@mui/material'
import { FC } from 'react'

import { AwakenedType } from '../AwakenedType'
import { BioData } from '../CharacterData'
import { Metatype } from '../Metatypes'

interface BioSectionProps {
  bio: BioData
  metatypes: string[]
  magicPriority: number

  onChange (bio: BioData): void
}

export const BioSection: FC<BioSectionProps> = ({
  bio,
  metatypes,
  magicPriority,
  onChange,
}) => {
  const showMetaTypeWarning = bio.metatype
    && metatypes.length >= 1
    && !metatypes.includes(bio.metatype)

  console.log(bio.awakened, magicPriority)
  const showAwakenedWarning =
    (bio.awakened === AwakenedType.Mundane && magicPriority >= 1)
    || (bio.awakened !== AwakenedType.Mundane && magicPriority === 0)

  return (
    <Stack gap={1}>
      <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
        <TextField
          sx={{ flexGrow: 1 }}
          variant="standard"
          label="Alias"
          value={bio.alias}
          onChange={event => onChange({ ...bio, alias: event.target.value })}
        />

        <TextField
          sx={{ flexGrow: 1 }}
          variant="standard"
          label="Name"
          value={bio.name}
          onChange={event => onChange({ ...bio, name: event.target.value })}
        />

        <TextField
          sx={{ flexGrow: 1 }}
          variant="standard"
          label="Metatype"
          select
          value={bio.metatype}
          onChange={event => onChange({ ...bio, metatype: event.target.value as Metatype })}
          focused={showMetaTypeWarning}
          color={showMetaTypeWarning ? 'warning' : undefined}
          helperText={showMetaTypeWarning ? 'Metatype unavailable at current priority' : undefined}
        >
          {Object.values(Metatype).map(metatype => (
            <MenuItem key={metatype} value={metatype}>{metatype}</MenuItem>
          ))}
        </TextField>

        <TextField
          sx={{ flexGrow: 1 }}
          variant="standard"
          label="Role"
          value={bio.role}
          onChange={event => onChange({ ...bio, role: event.target.value })}
        />

        <TextField
          sx={{ flexGrow: 1 }}
          variant="standard"
          label="Awakened"
          select
          value={bio.awakened}
          onChange={event => onChange({ ...bio, awakened: event.target.value as AwakenedType })}
          focused={showAwakenedWarning}
          color={showAwakenedWarning ? 'warning' : undefined}
          helperText={showAwakenedWarning ? 'Priority mismatch' : undefined}
        >
          {Object.values(AwakenedType).map(awakened => (
            <MenuItem key={awakened} value={awakened}>{awakened}</MenuItem>
          ))}
        </TextField>
      </Stack>

      <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
        <TextField
          sx={{ flexGrow: 1 }}
          variant="standard"
          label="Ethnicity"
          value={bio.ethnicity}
          onChange={event => onChange({ ...bio, ethnicity: event.target.value })}
        />

        <TextField
          sx={{ flexGrow: 1 }}
          variant="standard"
          label="Age"
          value={bio.age}
          onChange={event => onChange({ ...bio, age: event.target.value })}
        />

        <TextField
          sx={{ flexGrow: 1 }}
          variant="standard"
          label="Gender"
          value={bio.gender}
          onChange={event => onChange({ ...bio, gender: event.target.value })}
        />

        <TextField
          sx={{ flexGrow: 1 }}
          variant="standard"
          label="Height"
          value={bio.height}
          onChange={event => onChange({ ...bio, height: event.target.value })}
        />

        <TextField
          sx={{ flexGrow: 1 }}
          variant="standard"
          label="Weight"
          value={bio.weight}
          onChange={event => onChange({ ...bio, weight: event.target.value })}
        />
      </Stack>
    </Stack>
  )
}
