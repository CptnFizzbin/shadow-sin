import type { AgentData } from "#/system/matrix/agentData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectAgents(state: RunnerData): AgentData[] {
  return state.agents
}
