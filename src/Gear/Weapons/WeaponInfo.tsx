import { FC } from "react"

import { DicePools } from "../../UI/DicePool"
import { useGear } from "../GearContext"
import { GearType } from "../GearData"
import { GearInfoProps } from "../GearInfo"
import { GearInfoBlock } from "../GearInfoBlock"
import {
  BasicAttackPool,
  DroneAttackPool,
  RiggedAttackPool,
  VehicleAttackPool,
} from "./DicePools"
import { WeaponData } from "./WeaponData"

export const WeaponInfo: FC<GearInfoProps<WeaponData>> = ({ item: weapon }) => {
  const mounted = useGear(weapon.attachedTo)?.gearType === GearType.vehicleMod

  return (
    <GearInfoBlock item={weapon}>
      <DicePools>
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
      </DicePools>
    </GearInfoBlock>
  )
}
