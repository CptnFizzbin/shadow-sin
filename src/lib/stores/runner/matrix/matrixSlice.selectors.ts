import type { RunnerData } from "#/system/runnerData.ts"

export function selectMatrixNode(state: RunnerData): RunnerData["matrix"] {
  return state.matrix
}

export function selectMatrixNodeName(state: RunnerData): string {
  return state.matrix.name
}

export function selectMatrixNodeSystem(state: RunnerData): number {
  return state.matrix.system
}

export function selectMatrixNodeFirewall(state: RunnerData): number {
  return state.matrix.firewall
}

export function selectMatrixNodeResponse(state: RunnerData): number {
  return state.matrix.response
}

export function selectMatrixNodeSignal(state: RunnerData): number {
  return state.matrix.signal
}

export function selectMatrixNodeNumberOfPrograms(state: RunnerData): number {
  return state.matrix.numberOfPrograms
}
