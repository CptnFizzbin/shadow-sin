import { Box } from '@mui/material'
import { FC } from 'react'

export const InfoSection: FC = ({
  children,
}) => {
  return (
    <Box sx={{ padding: 1 }}>{children}</Box>
  )
}

export const CombatSection: FC = ({
  children,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, padding: 1, flexWrap: 'wrap' }}>
      {children}
    </Box>
  )
}
