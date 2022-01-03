import { FC } from 'react'

import styles from './Slot.module.scss'

export interface SlotProps {
  size: number | string
  name: string
}

export const Slot: FC<SlotProps> = ({
  size,
  name,
}) => {
  return (
    <div className={styles.slot}>
      <div className={styles.slotSize}>{size}</div>
      <div className={styles.slotName}>{name}</div>
    </div>
  )
}
