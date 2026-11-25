export const DamageFormulas = {
  /**
   * Matrix Damage Track capacity for a System-rated device or construct (Commlink, MatrixNode,
   * Agent) — the same `8 + Ceil(X / 2)` condition-monitor formula used for a Runner's own
   * Physical/Stun tracks, sized off System instead of Body/Willpower.
   */
  matrixMax: ({ system }: { system: number }): number => 8 + Math.ceil(system / 2),
}
