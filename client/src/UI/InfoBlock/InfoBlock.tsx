import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretSquareRight } from '@fortawesome/free-regular-svg-icons'
import { faCaretSquareDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Chip, IconButton, Paper, Typography } from '@material-ui/core'
import { FC, ReactElement, useState } from 'react'

import { displayFontFamily } from '../../AppThemeProvider'

library.add(faCaretSquareDown, faCaretSquareRight)

interface InfoBlockProps {
  title: string
  titleFontSize?: number
  subtitle?: string
  titleRight?: ReactElement
  expanded?: boolean
  expandable?: boolean
  quantity?: number
}

export const InfoBlock: FC<InfoBlockProps> = ({
  title,
  titleFontSize = 20,
  quantity = 0,
  subtitle,
  titleRight,
  children,
  expanded: defaultExpanded = true,
  expandable,
}) => {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded)

  return (
    <Paper elevation={1}>
      <Box sx={{ display: 'flex', gap: 1, padding: 1 }}>
        {expandable && (
          <Box>
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              <FontAwesomeIcon icon={expanded ? 'caret-square-down' : ['far', 'caret-square-right']} />
            </IconButton>
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }}>
          <Box>
            <Typography
              sx={{
                display: 'inline-block',
                fontFamily: displayFontFamily,
                fontSize: titleFontSize,
                color: 'primary.main',
              }}
            >{title}</Typography>
            {quantity >= 1 && (
              <Chip
                sx={{ marginLeft: 1, verticalAlign: 'top' }}
                label={`x${quantity}`}
                variant="outlined"
                size="small"
              />
            )}
          </Box>

          {subtitle}
        </Box>

        {titleRight}
      </Box>

      {expanded && children}
    </Paper>
  )
}
