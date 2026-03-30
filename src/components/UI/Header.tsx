import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import AppBar from "@mui/material/AppBar"
import IconButton from "@mui/material/IconButton"
import Toolbar from "@mui/material/Toolbar"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { Link } from "@tanstack/react-router"
import type { FC } from "react"

import { CharacterNavMenu } from "#/components/Character/CharacterNavMenu.tsx"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

interface HeaderProps {
  character?: CharacterSheet
}

export const Header: FC<HeaderProps> = ({ character }) => {
  const characterAlias = character?.profile.alias

  return (
    <AppBar role="banner" position="sticky" color="default" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        {character && (
          <>
            <Tooltip title="Back to roster">
              <IconButton
                color="inherit"
                size="small"
                component={Link}
                to="/"
                aria-label="Back to roster"
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <CharacterNavMenu />
          </>
        )}

        <Typography variant="h5" component="h1">
          {characterAlias ?? "ShadowSIN 4e"}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
