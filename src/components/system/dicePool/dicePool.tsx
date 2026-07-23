import ButtonBase from "@mui/material/ButtonBase"
import Collapse from "@mui/material/Collapse"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine, RiDice6Line } from "@remixicon/react"
import type { FC } from "react"
import { useContext, useState } from "react"

import { DiceTrayContext } from "#/components/dice/diceTrayContext.ts"
import { DieFace } from "#/components/system/dice/dieFace.tsx"

import type { DiceGroupList } from "./diceGroup.tsx"
import { isDiceGroup } from "./diceGroup.tsx"
import { getPoolSize } from "./dicePoolData.tsx"

interface DicePoolProps {
  name: string
  groups: DiceGroupList
}

export const DicePool: FC<DicePoolProps> = ({ name, groups }) => {
  const [isOpen, setIsOpen] = useState(false)
  const diceTrayApi = useContext(DiceTrayContext)

  const diceGroups = groups.flat().filter(isDiceGroup)
  const total = getPoolSize(diceGroups)
  const penalties = diceGroups.filter((group) => group.size < 0)
  const contributions = diceGroups.filter((group) => group.size >= 0)

  return (
    <ButtonBase
      component="div"
      onClick={() => setIsOpen((open) => !open)}
      aria-expanded={isOpen}
      sx={{
        display: "block",
        width: "100%",
        textAlign: "left",
        border: "1px solid",
        borderColor: "divider",
        padding: 1,
      }}
    >
      <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
        <Typography sx={{ flexGrow: 1, fontWeight: "bold" }}>{name}</Typography>

        <Typography sx={{ fontWeight: "bold", fontVariantNumeric: "tabular-nums" }}>
          {total}
        </Typography>

        <RiArrowDownSLine
          size={18}
          style={{
            transform: isOpen ? "rotate(180deg)" : undefined,
            transition: "transform 0.2s ease",
            flexShrink: 0,
          }}
        />

        <Divider orientation="vertical" flexItem />

        <IconButton
          size="small"
          aria-label={`Roll ${name}`}
          onClick={(event) => {
            event.stopPropagation()
            diceTrayApi?.setDice(total)
          }}
        >
          <RiDice6Line size={16} />
        </IconButton>
      </Stack>

      <Collapse in={!isOpen}>
        <Stack sx={{ gap: 1, paddingTop: 1 }}>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5, color: "text.secondary" }}>
            {Array.from({ length: total }, (_, index) => (
              <DieFace key={index} value={null} size={18} />
            ))}
          </Stack>

          {penalties.length > 0 && (
            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5 }}>
              {penalties.map((group) => (
                <Stack
                  key={group.id ?? group.name}
                  direction="row"
                  sx={{
                    gap: 0.5,
                    paddingX: 0.75,
                    paddingY: 0.25,
                    border: "1px solid",
                    borderColor: group.color ?? "error.main",
                  }}
                >
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{ fontWeight: "bold", color: group.color ?? "error.main" }}
                  >
                    {group.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{ fontWeight: "bold", color: group.color ?? "error.main" }}
                  >
                    {group.size}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Collapse>

      <Collapse in={isOpen}>
        <Stack sx={{ gap: 0.5, paddingTop: 1 }} onClick={(event) => event.stopPropagation()}>
          {contributions.map((group) => (
            <Stack
              key={group.id ?? group.name}
              direction="row"
              sx={{ justifyContent: "space-between" }}
            >
              <Typography variant="body2">{group.name}</Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold", fontVariantNumeric: "tabular-nums" }}>
                {group.size}
              </Typography>
            </Stack>
          ))}

          <Divider />

          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography sx={{ fontWeight: "bold" }}>Total</Typography>
            <Typography sx={{ fontWeight: "bold", fontVariantNumeric: "tabular-nums" }}>
              {total}
            </Typography>
          </Stack>
        </Stack>
      </Collapse>
    </ButtonBase>
  )
}
