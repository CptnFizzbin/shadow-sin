import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardContent from "@mui/material/CardContent"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiFlashlightLine, RiGroupLine, RiUserLine } from "@remixicon/react"
import type { FC } from "react"

export type ImprovementCategory = "attribute" | "skill" | "skillGroup"

interface ImprovementCategoryPickerProps {
  onSelectCategory: (category: ImprovementCategory) => void
}

const CATEGORIES = [
  {
    key: "attribute" as ImprovementCategory,
    label: "Attribute",
    description: "Boost a physical or mental attribute",
    icon: <RiUserLine size={24} />,
    color: "#1e40af",
  },
  {
    key: "skill" as ImprovementCategory,
    label: "Active Skill",
    description: "Increase an active skill rating",
    icon: <RiFlashlightLine size={24} />,
    color: "#065f46",
  },
  {
    key: "skillGroup" as ImprovementCategory,
    label: "Skill Group",
    description: "Raise all skills in a group together",
    icon: <RiGroupLine size={24} />,
    color: "#7c3aed",
  },
]

export const ImprovementCategoryPicker: FC<ImprovementCategoryPickerProps> = ({
  onSelectCategory,
}) => (
  <Stack sx={{ gap: 1.5 }}>
    <Typography variant="subtitle2" color="text.secondary">
      What do you want to improve?
    </Typography>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
        gap: 1.5,
      }}
    >
      {CATEGORIES.map((category) => (
        <Card key={category.key} variant="outlined">
          <CardActionArea
            onClick={() => onSelectCategory(category.key)}
            sx={{ height: "100%" }}
          >
            <CardContent sx={{ p: 1.5 }}>
              <Stack sx={{ alignItems: "center", gap: 0.75, py: 0.5 }}>
                <Box sx={{ color: category.color }}>{category.icon}</Box>
                <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
                  {category.label}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
                  {category.description}
                </Typography>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  </Stack>
)
