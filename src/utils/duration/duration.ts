export enum DurationUnit {
  // abstract
  initPasses = "initPasses",
  combatRounds = "combatRounds",

  // temporal
  seconds = "seconds",
  minutes = "minutes",
  hours = "hours",
  days = "days",
  weeks = "weeks",
  months = "months",
}

export interface Duration extends Partial<Record<DurationUnit, number>> {}

export const DurationUnitLabels: Record<DurationUnit, string> = {
  [DurationUnit.initPasses]: "Initiative Passes",
  [DurationUnit.combatRounds]: "Combat Rounds",
  [DurationUnit.seconds]: "Seconds",
  [DurationUnit.minutes]: "Minutes",
  [DurationUnit.hours]: "Hours",
  [DurationUnit.days]: "Days",
  [DurationUnit.weeks]: "Weeks",
  [DurationUnit.months]: "Months",
}

export const StandardDurations: Duration[] = [
  { initPasses: 1 },
  { combatRounds: 1 },
  { minutes: 1 },
  { hours: 1 },
  { days: 1 },
  { weeks: 1 },
  { months: 1 },
]

export const SECONDS_PER_COMBAT_ROUND = 3
export const SECONDS_PER_MINUTE = 60
export const MINUTES_PER_HOUR = 60
export const HOURS_PER_DAY = 24
export const DAYS_PER_WEEK = 7
export const WEEKS_PER_MONTH = 4
