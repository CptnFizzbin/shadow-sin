import { createAction } from "@reduxjs/toolkit"

import type { AgentData } from "#/system/matrix/agentData.ts"

export const saveAgent = createAction<AgentData>("agents/save")
export const removeAgent = createAction<string>("agents/remove")
