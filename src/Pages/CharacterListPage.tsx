import { Button, Stack } from "@mui/material"
import { FC, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { loadCharacters, SavedCharacters } from "../StorageService"
import { RootLayout } from "./RootLayout"

export const CharacterListPage: FC = () => {
  const navigate = useNavigate()
  const [characters, setCharacters] = useState<SavedCharacters>({})

  useEffect(() => setCharacters(loadCharacters()), [])

  return (
    <RootLayout>
      <Stack>
        {Object.entries(characters).map(([id, name]) => (
          <Button
            key={id}
            onClick={() => navigate(`/${id}`)}
            sx={{ padding: 1, fontSize: 30, justifyContent: "flex-start" }}
          >
            {name}
          </Button>
        ))}
      </Stack>
    </RootLayout>
  )
}
