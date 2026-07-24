import DeleteIcon from "@mui/icons-material/Delete"
import DownloadIcon from "@mui/icons-material/Download"
import EditIcon from "@mui/icons-material/Edit"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Paper from "@mui/material/Paper"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { useNavigate, useRouter } from "@tanstack/react-router"
import { useState } from "react"

import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import type { RunnerLoadError } from "#/runner/runnerLoadError.ts"
import { useRunnerManager } from "#/runner/runnerManagerContext.tsx"
import type { RunnerData } from "#/system/runnerData.ts"

import { downloadTextFile } from "./exportImport/exportUtils.ts"

interface RunnerRosterListProps {
  runners: Record<string, RunnerData>
  errors?: RunnerLoadError[]
}

export default function RunnerRosterList({
  runners,
  errors = [],
}: RunnerRosterListProps) {
  const navigate = useNavigate()
  const router = useRouter()
  const confirmDialog = useConfirmDialog()
  const runnerManager = useRunnerManager()
  const [menuState, setMenuState] = useState<{ anchorEl: HTMLElement, runner: RunnerData } | null>(null)

  const sortedRunners = Object.values(runners).sort((a, b) =>
    a.profile.alias.localeCompare(b.profile.alias),
  )

  const totalItems = sortedRunners.length + errors.length

  const handleExportError = (loadError: RunnerLoadError) => {
    const jsonContent = JSON.stringify(loadError.rawData, null, 2)
    downloadTextFile(jsonContent, `invalid-runner-${loadError.runnerId}.json`, "application/json")
  }

  const handleDeleteError = async (loadError: RunnerLoadError) => {
    await runnerManager.deleteRunner(loadError.runnerId)
    await router.invalidate()
  }

  const confirmAndDeleteRunner = async (runner: RunnerData) => {
    const confirmed = await confirmDialog.confirm({
      title: "Delete runner?",
      body: (
        <Typography>
          Are you sure you want to{" "}
          <Typography component="span" color="error">permanently delete</Typography>
          {" "}<Typography component="span" sx={{ fontWeight: "bold" }}>{runner.profile.alias}</Typography>?
          {" "}This cannot be undone.
        </Typography>
      ),
      slotProps: {
        confirmButton: { label: "Delete" },
      },
    })

    if (confirmed) {
      await runnerManager.deleteRunner(runner.id)
      await router.invalidate()
    }
  }

  const closeMenu = () => setMenuState(null)

  const handleEditRunner = (runner: RunnerData) => {
    closeMenu()
    navigate({ to: "/edit/$runnerId", params: { runnerId: runner.id } })
  }

  const handleDeleteRunner = (runner: RunnerData) => {
    closeMenu()
    void confirmAndDeleteRunner(runner)
  }

  return (
    <Paper>
      <List disablePadding>
        {sortedRunners.map((runner, index) => (
          <ListItem
            key={runner.id}
            divider={index < totalItems - 1}
            secondaryAction={(
              <Tooltip title="Runner actions">
                <IconButton
                  edge="end"
                  aria-label="runner actions"
                  onClick={(event) => {
                    event.stopPropagation()
                    setMenuState({ anchorEl: event.currentTarget, runner })
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            )}
            disablePadding
          >
            <ListItemButton
              onClick={() =>
                navigate({
                  to: "/$runnerId",
                  params: { runnerId: runner.id },
                })}
              sx={{
                transition: "background-color 0.15s ease",
                pr: 7,
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="h2">{runner.profile.alias}</Typography>
                }
                secondary={(
                  <Typography color="text.secondary">
                    {[runner.biology.metatype, runner.profile.archetype]
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
            key={loadError.runnerId}
            divider={index < errors.length - 1}
            secondaryAction={(
              <>
                <Tooltip title="Export raw data as JSON">
                  <IconButton
                    edge="end"
                    aria-label="export invalid runner"
                    onClick={() => handleExportError(loadError)}
                    sx={{ mr: 0.5 }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete runner">
                  <IconButton
                    edge="end"
                    aria-label="delete invalid runner"
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
                  Invalid runner
                </Typography>
              )}
              secondary={(
                <Typography color="text.secondary">
                  ID: {loadError.runnerId} · {loadError.errorMessage}
                </Typography>
              )}
            />
          </ListItem>
        ))}
      </List>

      <Menu
        anchorEl={menuState?.anchorEl}
        open={menuState !== null}
        onClose={closeMenu}
      >
        <MenuItem onClick={() => menuState && handleEditRunner(menuState.runner)}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={() => menuState && handleDeleteRunner(menuState.runner)} sx={{ color: "error.main" }}>
          <ListItemIcon sx={{ color: "error.main" }}><DeleteIcon fontSize="small" /></ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      {confirmDialog.dialog}
    </Paper>
  )
}
