import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

interface AddCombatantRowProps {
  onAdd: (input: { name: string, score: number, totalPasses: number, isPC: boolean }) => void
}

export const AddCombatantRow: FC<AddCombatantRowProps> = ({ onAdd }) => {
  const [name, setName] = useState("")
  const [score, setScore] = useState("")
  const [totalPasses, setTotalPasses] = useState("1")
  const [isPC, setIsPC] = useState(false)

  const handleAdd = () => {
    if (!name.trim() || !score) return
    onAdd({ name: name.trim(), score: Number(score), totalPasses: Number(totalPasses) || 1, isPC })
    setName("")
    setScore("")
    setTotalPasses("1")
    setIsPC(false)
  }

  return (
    <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap", alignItems: "center" }}>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ flexGrow: 1, minWidth: 120 }}
      />
      <TextField
        label="Score"
        type="number"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        sx={{ width: 90 }}
      />
      <TextField
        label="Passes"
        type="number"
        value={totalPasses}
        onChange={(e) => setTotalPasses(e.target.value)}
        sx={{ width: 90 }}
      />
      <ToggleButtonGroup
        exclusive
        size="small"
        value={isPC ? "pc" : "npc"}
        onChange={(_, value) => value && setIsPC(value === "pc")}
      >
        <ToggleButton value="pc">Runner</ToggleButton>
        <ToggleButton value="npc">NPC</ToggleButton>
      </ToggleButtonGroup>
      <Button variant="outlined" color="secondary" startIcon={<RiAddLine />} onClick={handleAdd}>
        Add
      </Button>
    </Stack>
  )
}
