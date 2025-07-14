import { Paper, Tab, Tabs } from "@mui/material"
import { FC, useState } from "react"

import { useCharacterData } from "../../Character/CharacterProvider"
import { LuckyDogs } from "../../data/Party/LuckyDogs"
import { GearData } from "../../Gear/GearData"
import { BalanceLog } from "../../System/BalanceLog"
import { calcNuyenBalance, formatNuyen } from "../../System/Nuyen"
import { BalanceLogTable } from "../../UI/BalanceLogTable"
import { Stat, StatBlock } from "../../UI/StatBlock"

type Page = "character" | "party"

export const NuyenPage: FC = () => {
  const [activePage, setActivePage] = useState<Page>("character")
  const character = useCharacterData()
  if (!character) return null

  return (
    <>
      <Tabs value={activePage} onChange={(_, value) => setActivePage(value)}>
        <Tab value="character" label="Character" />
        <Tab value="party" label="Party" />
      </Tabs>

      {activePage === "character" ? (
        <NuyenLog log={character.nuyen} gear={character.gear} />
      ) : (
        <NuyenLog log={LuckyDogs.nuyen} gear={LuckyDogs.gear} />
      )}
    </>
  )
}

interface NuyenLogProps {
  log: BalanceLog
  gear: GearData[]
}

const NuyenLog: FC<NuyenLogProps> = ({ log, gear }) => {
  const nuyenBalance = calcNuyenBalance(log)

  const gearTotal = gear
    .filter((gear) => typeof gear.cost === "number")
    .map((gear) => gear.cost as number)
    .reduce((sum, cost) => sum + cost, 0)

  return (
    <Paper>
      <StatBlock>
        <Stat name={"Total Balance"} value={formatNuyen(nuyenBalance)} />
        <Stat name={"Gear Total"} value={formatNuyen(gearTotal)} />
        <Stat
          name={"Net Worth"}
          value={formatNuyen(gearTotal + nuyenBalance)}
        />
      </StatBlock>
      <BalanceLogTable log={log} formatValue={formatNuyen} />
    </Paper>
  )
}
