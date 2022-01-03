import { FC } from 'react'

import styles from './Slot.module.scss'

export interface SlotProps {
  size: number | string
  name?: string
  empty?: boolean
}

export const Slot: FC<SlotProps> = ({
  size,
  name,
  empty,
}) => {
  return (
    <div className={styles.slot}>
      <div className={styles.slotSize} style={{backgroundColor: empty ? undefined : 'gray'}}>{size}</div>
      <div className={styles.slotName} style={{color: empty ? 'gray' : undefined}}>{empty ? 'Empty' : name}</div>
    </div>
  )
}
