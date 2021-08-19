import { Box } from '@material-ui/core'
import { FC } from 'react'

export const InfoSection: FC = ({
  children,
}) => {
  return (
    <Box sx={{ padding: 1 }}>{children}</Box>
  )
}
