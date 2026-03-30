import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useNavigate } from "@tanstack/react-router"

import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

interface CharacterRosterListProps {
  characters: Record<string, CharacterSheet>
}

export default function CharacterRosterList({
  characters,
}: CharacterRosterListProps) {
  const navigate = useNavigate()

  const sortedCharacters = Object.values(characters).sort((a, b) =>
    a.profile.alias.localeCompare(b.profile.alias),
  )

  return (
    <Paper>
      <List disablePadding>
        {sortedCharacters.map((character, index) => (
          <ListItemButton
            key={character.id}
            divider={index < sortedCharacters.length - 1}
            onClick={() =>
              navigate({
                to: "/$characterId",
                params: { characterId: character.id },
              })}
            sx={{
              transition: "background-color 0.15s ease",
            }}
          >
            <ListItemText
              primary={
                <Typography variant="h6">{character.profile.alias}</Typography>
              }
              secondary={(
                <Typography variant="body2" color="text.secondary">
                  {[character.biology.metatype, character.profile.archetype]
                    .filter(Boolean)
                    .join(" · ")}
                </Typography>
              )}
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  )
}
