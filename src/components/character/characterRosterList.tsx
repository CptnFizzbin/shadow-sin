import DeleteIcon from "@mui/icons-material/Delete"
import DownloadIcon from "@mui/icons-material/Download"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { useNavigate, useRouter } from "@tanstack/react-router"

import type { CharacterLoadError } from "#/character/characterLoadError.ts"
import { downloadTextFile } from "#/components/character/exportImport/exportUtils.ts"
import { useConfirmDialog } from "#/components/dialogs/confirmDialog.tsx"
import { localCharacterManager } from "#/lib/storage/localStorage/localCharacterManager.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"

interface CharacterRosterListProps {
  characters: Record<string, CharacterSheet>
  errors?: CharacterLoadError[]
}

export default function CharacterRosterList({
  characters,
  errors = [],
}: CharacterRosterListProps) {
  const navigate = useNavigate()
  const router = useRouter()
  const confirmDialog = useConfirmDialog()

  const sortedCharacters = Object.values(characters).sort((a, b) =>
    a.profile.alias.localeCompare(b.profile.alias),
  )

  const totalItems = sortedCharacters.length + errors.length

  const handleExportError = (loadError: CharacterLoadError) => {
    const jsonContent = JSON.stringify(loadError.rawData, null, 2)
    downloadTextFile(jsonContent, `invalid-character-${loadError.characterId}.json`, "application/json")
  }

  const handleDeleteError = async (loadError: CharacterLoadError) => {
    await localCharacterManager.deleteCharacter(loadError.characterId)
    await router.invalidate()
  }

  const confirmAndDeleteCharacter = async (character: CharacterSheet) => {
    const confirmed = await confirmDialog.confirm({
      title: "Delete character?",
      body: (
        <Typography>
          Are you sure you want to{" "}
          <Typography component="span" color="error">permanently delete</Typography>
          {" "}<Typography component="span" sx={{ fontWeight: "bold" }}>{character.profile.alias}</Typography>?
          {" "}This cannot be undone.
        </Typography>
      ),
      slotProps: {
        confirmButton: { label: "Delete" },
      },
    })

    if (confirmed) {
      await localCharacterManager.deleteCharacter(character.id)
      await router.invalidate()
    }
  }

  return (
    <Paper>
      <List disablePadding>
        {sortedCharacters.map((character, index) => (
          <ListItem
            key={character.id}
            divider={index < totalItems - 1}
            secondaryAction={(
              <Tooltip title="Delete character">
                <IconButton
                  edge="end"
                  aria-label="delete character"
                  color="error"
                  onClick={(event) => {
                    event.stopPropagation()
                    void confirmAndDeleteCharacter(character)
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
            disablePadding
          >
            <ListItemButton
              onClick={() =>
                navigate({
                  to: "/$characterId",
                  params: { characterId: character.id },
                })}
              sx={{
                transition: "background-color 0.15s ease",
                pr: 7,
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="h2">{character.profile.alias}</Typography>
                }
                secondary={(
                  <Typography color="text.secondary">
                    {[character.biology.metatype, character.profile.archetype]
                      .filter(Boolean)
                      .join(" · ")}
                  </Typography>
                )}
              />
            </ListItemButton>
          </ListItem>
        ))}

        {errors.map((loadError, index) => (
          <ListItem
            key={loadError.characterId}
            divider={index < errors.length - 1}
            secondaryAction={(
              <>
                <Tooltip title="Export raw data as JSON">
                  <IconButton
                    edge="end"
                    aria-label="export invalid character"
                    onClick={() => handleExportError(loadError)}
                    sx={{ mr: 0.5 }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete character">
                  <IconButton
                    edge="end"
                    aria-label="delete invalid character"
                    color="error"
                    onClick={() => handleDeleteError(loadError)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          >
            <ListItemIcon sx={{ color: "error.main" }}>
              <ErrorOutlineIcon />
            </ListItemIcon>
            <ListItemText
              primary={(
                <Typography variant="h2" color="error">
                  Invalid character
                </Typography>
              )}
              secondary={(
                <Typography color="text.secondary">
                  ID: {loadError.characterId} · {loadError.errorMessage}
                </Typography>
              )}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
