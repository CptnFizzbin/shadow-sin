import { Stack, Typography } from '@mui/material'
import { FC } from 'react'

import { formatNuyen } from '../../System/Nuyen'
import { formatSource } from '../../System/Source'
import { SimpleInfoBlock } from '../../UI/InfoBlock/SimpleInfoBlock'
import { Stat } from '../../UI/StatBlock'
import { useGearOfType } from '../GearContext'
import { GearType } from '../GearData'
import { GearInfoProps } from '../GearInfo'
import { LicenseData } from './LicenseData'
import { LicenseInfo } from './LicenseInfo'
import { SinAttr } from './SinAttr'
import { SinData } from './SinData'

export const SinInfo: FC<GearInfoProps<SinData>> = ({
  item: sin,
}) => {
  const licenses = useGearOfType<LicenseData>(GearType.license)
    .filter(license => license.attachedTo === sin.id)

  return (
    <SimpleInfoBlock
      name={sin.name}
      attributes={
        <>
          {sin.cost && <Stat name="Cost" value={formatNuyen(sin.cost)} />}
          {sin.source && <Stat name="Source" value={formatSource(sin.source)} />}
          <Stat name="Rating" value={sin.attributes[SinAttr.rating]} />
        </>
      }
      body={
        <Typography variant="caption">{sin.type}</Typography>
      }
      footer={
        <>
          {licenses.length >= 1 && (
            <Stack gap={1}>
              {licenses.map(license => <LicenseInfo key={license.id} item={license} />)}
            </Stack>
          )}
        </>
      }
    />
  )
}
