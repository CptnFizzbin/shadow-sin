import { FC } from 'react'

import { DroneData } from './DroneData'
import { DroneInfo } from './DroneInfo'

interface DroneListProps {
  drones: DroneData[]
}

export const DroneList: FC<DroneListProps> = ({
  drones,
}) => {
  return (
    <>
      {drones.map(drone => <DroneInfo key={drone.id} drone={drone} />)}
    </>
  )
}
