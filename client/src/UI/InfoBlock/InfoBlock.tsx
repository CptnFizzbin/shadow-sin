import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretSquareRight } from '@fortawesome/free-regular-svg-icons'
import { faCaretSquareDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Chip, IconButton, Paper, Stack, Typography } from '@mui/material'
import { FC, ReactElement, useEffect, useState } from 'react'

import { displayFontFamily } from '../../AppThemeProvider'

library.add(faCaretSquareDown, faCaretSquareRight)

function useExpanded(expandId: string | null): [boolean, (set: boolean) => void] {
  const [expanded, _setExpanded] = useState<boolean>(true)

  useEffect(() => {
    if (expandId === null) return
    const saved = sessionStorage.getItem(`expanded.${expandId}`) || 'true'
    _setExpanded(saved === 'true')
  }, [expandId])

  function setExpanded(value: boolean): void {
    if (expandId === null) return
    sessionStorage.setItem(`expanded.${expandId}`, value.toString())
    _setExpanded(value)
  }

  return [expanded, setExpanded]

}

interface InfoBlockProps {
  title: string | ReactElement
  titleFontSize?: number
  subtitle?: string | ReactElement
  titleRight?: ReactElement
  expandId?: string | null
  expandable?: boolean
  quantity?: number
  content?: ReactElement
  footer?: ReactElement
}

export const InfoBlock: FC<InfoBlockProps> = ({
  title,
  titleFontSize = 20,
  quantity = 0,
  subtitle,
  titleRight,
  children,
  expandId = null,
  expandable,
  content,
  footer,
}) => {
  const [expanded, setExpanded] = useExpanded(expandId)

  return (
    <Paper elevation={1}>
      <Box sx={{display: 'flex', gap: 1, padding: 1}}>
        {expandable && (
          <Box>
            <IconButton size='small' onClick={() => setExpanded(!expanded)}>
              <FontAwesomeIcon icon={expanded ? 'caret-square-down' : ['far', 'caret-square-right']} />
            </IconButton>
          </Box>
        )}

        <Box sx={{flexGrow: 1}}>
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
                sx={{marginLeft: 1, verticalAlign: 'top'}}
                label={`x${quantity}`}
                variant='outlined'
                size='small'
              />
            )}
          </Box>

          {subtitle}
        </Box>

        {titleRight}
      </Box>

      {expanded && (
        <>
          {(content || children) && (
            <Stack gap={1} sx={{padding: 1}}>
              {content || children}
            </Stack>
          )}

          {footer}
        </>
      )}
    </Paper>
  )
}
