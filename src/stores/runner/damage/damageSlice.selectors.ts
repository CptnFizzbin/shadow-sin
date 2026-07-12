import { selectWoundInterval } from "#/components/system/damage/damageUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { DamageTrackKey } from "#/system/damageTrackKey.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export interface DamageTrackInfo {
  max: number
  current: number
  woundInterval: number
}

export function selectPhysicalTrack(state: RunnerData): DamageTrackInfo {
  return {
    max: 8 + Math.ceil(state.attributes[AttributeKey.body] / 2),
    current: state.damage.physical,
    woundInterval: selectWoundInterval(DamageTrackKey.physical)(state),
  }
}

export function selectStunTrack(state: RunnerData): DamageTrackInfo {
  return {
    max: 8 + Math.ceil(state.attributes[AttributeKey.willpower] / 2),
    current: state.damage.stun,
    woundInterval: selectWoundInterval(DamageTrackKey.stun)(state),
  }
}

export function selectMatrixTrack(state: RunnerData): DamageTrackInfo {
  return {
    max: 0,
    current: state.damage.matrix,
    woundInterval: 3,
  }
}
