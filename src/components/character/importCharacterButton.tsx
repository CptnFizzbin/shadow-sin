import UploadIcon from "@mui/icons-material/Upload"
import Button from "@mui/material/Button"
import type { ChangeEvent, FC } from "react"
import { useRef, useState } from "react"

import { yamlToCharacterSheet } from "#/components/character/exportUtils.ts"
import type { ImportConflictChoice } from "#/components/character/importConflictDialog.tsx"
import { ImportConflictDialog } from "#/components/character/importConflictDialog.tsx"
import { localCharacterManager } from "#/lib/storage/localStorage/localCharacterManager.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

interface ImportCharacterButtonProps {
  onImported?: () => void | Promise<void>
}

/**
 * Find the next available alias by appending an incrementing number.
 * E.g. "Artemis" → "Artemis 2" → "Artemis 3" … until no existing character
 * uses that alias.
 */
function resolveAlias(
  baseAlias: string,
  existingAliases: Set<string>,
): string {
  let counter = 2
  let candidate = `${baseAlias} ${counter}`
  while (existingAliases.has(candidate)) {
    counter++
    candidate = `${baseAlias} ${counter}`
  }
  return candidate
}

export const ImportCharacterButton: FC<ImportCharacterButtonProps> = ({ onImported }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [pendingCharacter, setPendingCharacter] = useState<CharacterSheet | null>(null)
  const [existingCharacter, setExistingCharacter] = useState<CharacterSheet | null>(null)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset so the same file can be re-selected if needed
    event.target.value = ""

    const yamlContent = await file.text()
    let character: CharacterSheet

    try {
      character = yamlToCharacterSheet(yamlContent)
    } catch (error) {
      console.error("Failed to parse YAML file:", error)
      return
    }

    const existing = await localCharacterManager.getCharacter(character.id)

    if (existing) {
      setPendingCharacter(character)
      setExistingCharacter(existing)
    } else {
      await localCharacterManager.saveCharacter(character)
      await onImported?.()
    }
  }

  const handleConflictChoice = async (choice: ImportConflictChoice) => {
    if (!pendingCharacter) return

    if (choice === "overwrite") {
      await localCharacterManager.saveCharacter(pendingCharacter)
      await onImported?.()
    } else if (choice === "create-new") {
      const allCharacters = await localCharacterManager.listCharacters()
      const existingAliases = new Set(
        Object.values(allCharacters).map((c) => c.profile.alias),
      )
      const newAlias = resolveAlias(pendingCharacter.profile.alias, existingAliases)
      const newCharacter: CharacterSheet = {
        ...pendingCharacter,
        id: crypto.randomUUID(),
        profile: {
          ...pendingCharacter.profile,
          alias: newAlias,
        },
      }
      await localCharacterManager.saveCharacter(newCharacter)
      await onImported?.()
    }

    setPendingCharacter(null)
    setExistingCharacter(null)
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".yaml,.yml"
        style={{ display: "none" }}
        onChange={(event) => { void handleFileChange(event) }}
      />
      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        onClick={() => inputRef.current?.click()}
      >
        Import YAML
      </Button>

      {pendingCharacter && existingCharacter && (
        <ImportConflictDialog
          incomingCharacter={pendingCharacter}
          existingCharacter={existingCharacter}
          onChoice={(choice) => { void handleConflictChoice(choice) }}
        />
      )}
    </>
  )
}
