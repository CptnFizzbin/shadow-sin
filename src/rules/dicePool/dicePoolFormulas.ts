export const DicePoolFormulas = {
  /** Whether an Active Skill test rolls a Defaulting penalty: the skill is untrained and `defaulting` is allowed. */
  isDefaulting: ({ rawValue, defaulting }: { rawValue: number, defaulting: boolean }): boolean =>
    rawValue < 1 && defaulting,
}
