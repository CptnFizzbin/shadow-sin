import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import React, { FC, ReactElement } from 'react'

import { displayFontFamily } from '../../AppThemeProvider'

interface SimpleInfoBlockProps {
  name: ReactElement | string
  quantity?: number
  attributes?: ReactElement
  body?: ReactElement
  footer?: ReactElement
}

export const SimpleInfoBlock: FC<SimpleInfoBlockProps> = ({
  name,
  quantity = 0,
  attributes,
  body,
  footer,
  children,
}) => {
  return (
    <Paper variant="outlined" sx={{ padding: 1, display: 'flex' }}>
      <Stack gap={1} sx={{ width: '100%' }}>
        <Stack gap={1} direction={'row'}>
          <Box sx={{ flexGrow: 1 }}>
            <Box>
              <Typography
                sx={{
                  display: 'inline-block',
                  fontFamily: displayFontFamily,
                  color: 'primary.main',
                }}
              >
                {name}
              </Typography>

              {quantity >= 1 && (
                <Chip
                  sx={{ marginLeft: 1, verticalAlign: 'top' }}
                  label={`x${quantity}`}
                  variant="outlined"
                  size="small"
                />
              )}
            </Box>

            <Box>
              {body || children}
            </Box>
          </Box>

          {attributes && <Box>{attributes}</Box>}
        </Stack>

        {footer && (
          <Box>{footer}</Box>
        )}
      </Stack>
    </Paper>
  )
}
