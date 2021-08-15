import { FC } from 'react'

import { FirearmInfo } from './Firearms/FirearmInfo'
import { WeaponData } from './WeaponData'

interface WeaponListProps {
  weapons: WeaponData[]
}

export const WeaponList: FC<WeaponListProps> = ({
  weapons,
}) => {
  return (
    <>
      {weapons.map(weapon => (
        <FirearmInfo key={weapon.id} firearm={weapon} />
      ))}
    </>
  )
}
