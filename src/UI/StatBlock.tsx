import { Paper, Typography } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

import styles from './StatBlock.module.scss'

interface StatBlockProps {
  vertical?: boolean
}

export const StatBlock: FC<StatBlockProps> = ({
  vertical,
  children,
}) => {
  return (
    <Paper
      variant="outlined"
      className={styles.Stats}
      sx={{ display: 'flex', flexDirection: vertical ? 'column' : 'row' }}
    >
      {children}
    </Paper>
  )
}

interface StatProps {
  name: string
  value: string | number | null
}

export const Stat: FC<StatProps> = ({
  name,
  value,
}) => {
  return (
    <Box sx={{ padding: 1 }} className={styles.Stat}>
      <Typography color="primary" className={styles.StatName}>{name}</Typography>
      <div className={styles.StatValue}>{value || '-'}</div>
    </Box>
  )
}
