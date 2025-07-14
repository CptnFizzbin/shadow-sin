import { Paper } from "@mui/material"
import { FC, useEffect, useState } from "react"
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom"

import { Character } from "../Character/Character"
import { CharacterProvider } from "../Character/CharacterProvider"
import { loadCharacter } from "../StorageService"
import { CharacterNavDrawer } from "../UI/NavDrawer/CharacterNavDrawer"
import { AugmentsPage } from "./Character/AugmentsPage"
import { CharacterInfoPage } from "./Character/CharacterInfoPage"
import { KarmaPage } from "./Character/KarmaPage"
import { MiscGearPage } from "./Character/MiscGearPage"
import { NuyenPage } from "./Character/NuyenPage"
import { SpellsPage } from "./Character/SpellsPage"
import { VehiclesPage } from "./Character/VehiclesPage"
import { WeaponsPage } from "./Character/WeaponsPage"
import { RootLayout } from "./RootLayout"

export const CharacterPage: FC = () => {
  const navigate = useNavigate()
  const { characterId } = useParams<{ characterId: string }>()
  const [character, setCharacter] = useState<Character | null>(null)

  useEffect(() => {
    const character = loadCharacter(characterId!)
    if (character === null) navigate("/")
    setCharacter(character)
  }, [navigate, characterId])

  if (!character) {
    return <Paper>Loading...</Paper>
  }

  return (
    <CharacterProvider character={character}>
      <RootLayout NavDrawer={CharacterNavDrawer}>
        <Routes>
          <Route index Component={CharacterInfoPage} />
          <Route path={`weapons`} Component={WeaponsPage} />
          <Route path={`vehicles`} Component={VehiclesPage} />
          <Route path={`augments`} Component={AugmentsPage} />
          <Route path={`spells`} Component={SpellsPage} />
          <Route path={`misc`} Component={MiscGearPage} />
          <Route path={`karma`} Component={KarmaPage} />
          <Route path={`nuyen`} Component={NuyenPage} />
          <Route path={"*"} element={() => <Navigate to="" />} />
        </Routes>
      </RootLayout>
    </CharacterProvider>
  )
}
