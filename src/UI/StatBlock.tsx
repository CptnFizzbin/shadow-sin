import { Paper, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import styles from './StatBlock.module.scss'

export const StatBlock: FC = ({
  children,
}) => {
  return (
    <Paper variant="outlined" className={styles.Stats}>
      {children}
    </Paper>
  )
}

interface StatProps {
  name: string
  value?: string | number | null
}

export const Stat: FC<StatProps> = ({
  name,
  value,
  children,
}) => {
  return (
    <Box sx={{ padding: 1 }} className={styles.Stat}>
      <Typography color="primary" className={styles.StatName}>{name}</Typography>
      <div className={styles.StatValue}>
        {typeof value === 'undefined' ? children : (value || '-')}
      </div>
    </Box>
  )
}
