import ButtonBase from "@mui/material/ButtonBase";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { FC } from "react";
import type { QualityData } from "#/lib/system/types/qualityData.ts";

export interface QualityRowProps {
  quality: QualityData;
  onClick: () => void;
}

export const QualityRow: FC<QualityRowProps> = ({ quality, onClick }) => {
  const bpLabel =
    quality.bpValue !== undefined ? `${quality.bpValue} BP` : "— BP";

  return (
    <Paper
      component={ButtonBase}
      onClick={onClick}
      elevation={1}
      aria-label={`Open quality ${quality.name}`}
      sx={{
        display: "flex",
        width: "100%",
        textAlign: "left",
        borderRadius: 1,
        px: 1,
        py: 0.5,
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Typography>{quality.name}</Typography>
        <Typography variant="caption" color="secondary.main">
          {bpLabel}
        </Typography>
      </Stack>
    </Paper>
  );
};
