import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { CharacterNavBar } from "#/components/Character/CharacterNavMenu.tsx"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

interface HeaderProps {
  character?: CharacterSheet
}

export const Header: FC<HeaderProps> = ({ character }) => {
  const characterAlias = character?.profile.alias

  return (
    <AppBar role="banner" position="sticky" color="default" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        {character && <CharacterNavBar />}

        <Typography variant="h5" component="h1">
          {characterAlias ?? "ShadowSIN 4e"}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
