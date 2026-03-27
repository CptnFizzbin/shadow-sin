import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { CharacterNavMenu } from "#/components/Character/CharacterNavMenu.tsx"
import type { PlayerCharacterData } from "#/lib/system/playerCharacterData.ts"

interface HeaderProps {
  character?: PlayerCharacterData
}

export const Header: FC<HeaderProps> = ({ character }) => {
  const characterAlias = character?.profile.alias

  return (
    <AppBar position="sticky" color="default" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        {character && <CharacterNavMenu />}

        <Typography variant="h5" component="div">
          {characterAlias ?? "ShadowSIN 4e"}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
