import { Paper } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { FC } from 'react'

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
      sx={{
        display: 'flex',
        padding: 1,
        gap: 1,
        flexWrap: 'wrap',
        flexDirection: vertical ? 'column' : 'row',
        justifyContent: 'space-around',
      }}
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
  if (typeof value == 'number') {
    value = value.toFixed(2).toString()
  }

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Box sx={{ fontSize: 14, display: 'inline-block', color: 'primary.main', textAlign: 'left', flexGrow: 1 }}>
        {name}
      </Box>
      <Box sx={{ fontSize: 14, display: 'inline-block', textAlign: 'right', flexGrow: 1 }}>
        {value || '-'}
      </Box>
    </Box>
  )
}
