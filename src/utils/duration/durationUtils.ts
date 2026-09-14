import * as dateFns from "date-fns"

import type { Duration } from "./duration.ts"
import {
  DAYS_PER_WEEK,
  DurationUnit,
  HOURS_PER_DAY,
  MINUTES_PER_HOUR,
  SECONDS_PER_COMBAT_ROUND,
  SECONDS_PER_MINUTE,
  WEEKS_PER_MONTH,
} from "./duration.ts"

function integerDevision(dividned: number, divisor: number): [quotient: number, remainder: number] {
  return [
    Math.floor(dividned / divisor),
    dividned % divisor,
  ]
}

export class DurationUtils {
  public static equals(a: Duration, b: Duration): boolean {
    const simpleA = this.simplify(a)
    const simpleB = this.simplify(b)

    return (Object.values(DurationUnit) as DurationUnit[])
      .every((unit) => (simpleA[unit] ?? 0) === (simpleB[unit] ?? 0))
  }

  public static format(duration: Duration): string {
    let formatted = dateFns.formatDuration(duration)

    if (duration.combatRounds) {
      const plural = duration.combatRounds !== 1
      const combatRounds = `${duration.combatRounds} ${plural ? "combat rounds" : "combat round"}`
      formatted = formatted === ""
        ? combatRounds
        : `${formatted}, ${combatRounds}`
    }

    if (duration.initPasses) {
      const plural = duration.initPasses !== 1
      const initPasses = `${duration.initPasses} ${plural ? "initiative passes" : "initiative pass"}`
      formatted = formatted === ""
        ? initPasses
        : `${formatted}, ${initPasses}`
    }

    return formatted
  }

  public static simplify(duration: Duration) {
    const simplified: Duration = { ...duration }

    for (const period of Object.values(DurationUnit) as DurationUnit[]) {
      const periodValue = simplified[period]
      if (!periodValue) continue

      switch (period) {
        case DurationUnit.combatRounds:
          simplified.seconds = (simplified.seconds ?? 0) + periodValue * SECONDS_PER_COMBAT_ROUND
          delete simplified.combatRounds
          break
        case DurationUnit.seconds: {
          if (periodValue < SECONDS_PER_MINUTE) continue
          const [minutes, seconds] = integerDevision(periodValue, SECONDS_PER_MINUTE)
          simplified.minutes = (simplified.minutes ?? 0) + minutes
          simplified.seconds = seconds
          break
        }
        case DurationUnit.minutes: {
          if (periodValue < MINUTES_PER_HOUR) continue
          const [hours, minutes] = integerDevision(periodValue, MINUTES_PER_HOUR)
          simplified.hours = (simplified.hours ?? 0) + hours
          simplified.minutes = minutes
          break
        }
        case DurationUnit.hours: {
          if (periodValue < HOURS_PER_DAY) continue
          const [days, hours] = integerDevision(periodValue, HOURS_PER_DAY)
          simplified.days = (duration.days ?? 0) + days
          simplified.hours = hours
          break
        }
        case DurationUnit.days: {
          if (periodValue < DAYS_PER_WEEK) continue
          const [weeks, days] = integerDevision(periodValue, DAYS_PER_WEEK)
          simplified.weeks = (simplified.weeks ?? 0) + weeks
          simplified.days = days
          break
        }
        case DurationUnit.weeks: {
          if (periodValue < WEEKS_PER_MONTH) continue
          const [months, weeks] = integerDevision(periodValue, WEEKS_PER_MONTH)
          simplified.months = (simplified.months ?? 0) + months
          simplified.weeks = weeks
          break
        }
        default:
          break
      }
    }

    return simplified
  }
}
