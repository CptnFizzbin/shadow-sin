import { Box, Button, Dialog, DialogContent, Tab, Tabs } from "@mui/material"
import { FC, useState } from "react"

import { LoginForm } from "./LoginForm"
import { SignupForm } from "./SignupForm"

interface LoginDialogProps {
  open?: boolean

  onClose(): void
}

export const LoginDialog: FC<LoginDialogProps> = ({
  open = false,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<string>("login")

  return (
    <Dialog open={open}>
      <DialogContent sx={{ padding: 1, width: 400 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
              orientation="vertical"
              sx={{ flexGrow: 1 }}
            >
              <Tab label="Login" value="login" />
              <Tab label="Sign Up" value="signup" />
            </Tabs>
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            {activeTab === "login" && <LoginForm onLogin={onClose} />}
            {activeTab === "signup" && <SignupForm onSignup={onClose} />}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
