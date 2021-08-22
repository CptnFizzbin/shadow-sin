import { FC } from 'react'

import { InfoBlock } from '../../UI/InfoBlock/InfoBlock'
import { GearAttributes } from '../GearAttributes'
import { useGear } from '../GearContext'
import { GearType } from '../GearData'
import { GearDicePools } from '../GearDicePools'
import { GearHeader } from '../GearHeader'
import { BasicAttackPool, DroneAttackPool, RiggedAttackPool, VehicleAttackPool } from './DicePools'
import { WeaponData } from './WeaponData'

interface FirearmProps {
  weapon: WeaponData
}

export const WeaponInfo: FC<FirearmProps> = ({
  weapon,
}) => {
  const mounted = useGear(weapon.attachedTo)?.gearType === GearType.vehicleMod

  return (
    <InfoBlock>
      <InfoBlock.Header>
        <GearHeader item={weapon} />
        <GearAttributes item={weapon} />
      </InfoBlock.Header>

      <InfoBlock.Body>
        <InfoBlock.Main>
          <GearDicePools>
            {mounted ? (
              <>
                <VehicleAttackPool weapon={weapon} />
                <DroneAttackPool weapon={weapon} />
                <RiggedAttackPool weapon={weapon} />
              </>
            ) : (
              <>
                <BasicAttackPool weapon={weapon} />
              </>
            )}
          </GearDicePools>
        </InfoBlock.Main>
      </InfoBlock.Body>
    </InfoBlock>
  )
}
