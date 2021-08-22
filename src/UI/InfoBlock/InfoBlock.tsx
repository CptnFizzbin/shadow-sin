import { Box, Paper, useMediaQuery, useTheme } from '@material-ui/core'
import { FC } from 'react'

interface InfoBlockType extends FC {
  Header: FC
  Body: FC
  Main: FC
  Aside: FC
  Footer: FC
}

export const InfoBlock: InfoBlockType = ({
  children,
}) => {
  return (
    <Paper elevation={1}>
      {children}
    </Paper>
  )
}

const Header: FC = ({
  children,
}) => {
  return (
    <Box>{children}</Box>
  )
}
InfoBlock.Header = Header

const Body: FC = ({
  children,
}) => {
  const theme = useTheme()
  const smScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexDirection: smScreen ? 'column-reverse' : 'row' }}>{children}</Box>
  )
}
InfoBlock.Body = Body

const Main: FC = ({
  children,
}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>{children}</Box>
  )
}
InfoBlock.Main = Main

const Aside: FC = ({
  children,
}) => {
  const theme = useTheme()
  const smScreen = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexDirection: smScreen ? 'row' : 'column' }}>
      {children}
    </Box>
  )
}
InfoBlock.Aside = Aside

const Footer: FC = ({
  children,
}) => {
  return (
    <Box>
      {children}
    </Box>
  )
}
InfoBlock.Footer = Footer
