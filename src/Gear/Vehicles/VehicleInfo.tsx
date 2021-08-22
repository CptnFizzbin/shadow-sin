import { Typography } from '@material-ui/core'
import { FC, useState } from 'react'

import { AttributeProvider } from '../../System/AttributeProvider'
import { DamageProvider } from '../../System/Damage/DamageContext'
import { DamageTrack } from '../../System/Damage/DamageTrack'
import { DamageType } from '../../System/Damage/DamageType'
import { VehicleDefRatingStat } from '../../System/DefenseRating'
import { CharacterColdVrInit, CharacterHotVrInit, InitiativeStat } from '../../System/Initiative'
import { AttributeBlock } from '../../UI/AttributeBlock'
import { InfoBlock } from '../../UI/InfoBlock/InfoBlock'
import { InfoSection } from '../../UI/InfoBlock/InfoSection'
import { StatBlock } from '../../UI/StatBlock'
import { GearAttributes } from '../GearAttributes'
import { useGear, useGearOfType } from '../GearContext'
import { GearType } from '../GearData'
import { GearDicePools } from '../GearDicePools'
import { GearHeader } from '../GearHeader'
import { NestedGear } from '../NestedGear'
import { RccData } from '../Rcc/RccData'
import { AutosoftData } from '../Software/Autosoft/AutosoftData'
import { AutosoftProvider } from '../Software/Autosoft/AutosoftProvider'
import { AutosoftsList } from '../Software/Autosoft/AutosoftsList'
import { PilotEvadePool, RiggedEvadePool } from './DicePools'
import { VehicleAttr, VehicleData } from './VehicleData'
import { ModType, VehicleModData } from './VehicleModData'

interface VehicleInfoProps {
  vehicle: VehicleData
}

export const VehicleInfo: FC<VehicleInfoProps> = ({
  vehicle,
}) => {
  const [damage, setDamage] = useState<number>(0)

  const pilot = vehicle.attributes[VehicleAttr.pilot] || 0

  const riggerInterface = useGearOfType<VehicleModData>(GearType.vehicleMod)
    .filter(gear => gear.attachedTo === vehicle.id)
    .find(gear => gear.modType === ModType.riggerInterface)

  const rcc = useGear<RccData>(vehicle.slavedTo)
  const physicalMax = Math.ceil(vehicle.attributes[VehicleAttr.body] / 2) + 8
  const allAutosofts = useGearOfType<AutosoftData>(GearType.autosoft)

  let autosofts = allAutosofts
    .filter(gear => gear.attachedTo === vehicle.id)

  if (rcc) {
    autosofts = [
      ...autosofts,
      ...allAutosofts
        .filter(autosoft => autosoft.attachedTo === rcc.id)
        .filter(autosoft => rcc.slavedAutosofts.includes(autosoft.id)),
    ]
  }

  return (
    <DamageProvider type={DamageType.vehiclePhysical} value={damage} onChange={setDamage}>
      <AttributeProvider attributes={vehicle.attributes}>
        <AutosoftProvider autosofts={autosofts}>
          <InfoBlock>
            <InfoBlock.Header>
              <GearHeader item={vehicle} />
              <GearAttributes item={vehicle} />
            </InfoBlock.Header>

            <InfoBlock.Body>
              <InfoBlock.Main>
                <GearDicePools>
                  <PilotEvadePool vehicle={vehicle} />
                  <RiggedEvadePool vehicle={vehicle} />
                </GearDicePools>

                {rcc && (
                  <InfoSection>
                    <Typography variant={'h6'}>Slaved To</Typography>
                    <Typography>{rcc.name}</Typography>
                    <AttributeBlock attributes={rcc.attributes} />
                  </InfoSection>
                )}

                <InfoSection>
                  <Typography variant={'h6'}>Autosofts</Typography>
                  <AutosoftsList autosofts={autosofts} slavedIds={rcc?.slavedAutosofts} />
                </InfoSection>
              </InfoBlock.Main>

              <InfoBlock.Aside>
                <InfoSection>
                  <StatBlock vertical>
                    <InitiativeStat name="Drone Init" base={pilot * 2} dice={4} />
                    {riggerInterface && (
                      <>
                        <CharacterHotVrInit />
                        <CharacterColdVrInit />
                      </>
                    )}
                    <VehicleDefRatingStat />
                  </StatBlock>
                </InfoSection>

                <InfoSection>
                  <DamageTrack current={damage} max={physicalMax} onChange={setDamage} label="Physical" />
                </InfoSection>
              </InfoBlock.Aside>
            </InfoBlock.Body>

            <InfoBlock.Footer>
              <NestedGear item={vehicle} />
            </InfoBlock.Footer>
          </InfoBlock>
        </AutosoftProvider>
      </AttributeProvider>
    </DamageProvider>
  )
}
