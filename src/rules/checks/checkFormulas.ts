import type { Duration, DurationUnit } from "#/data/duration/duration.ts"
import { DurationUtils } from "#/data/duration/durationUtils.ts"

export class CheckFormulas {
  public static getDuration(inputs: { interval: Duration, attempts: number, simplify?: boolean }): Duration {
    const { interval, attempts } = inputs
    const duration: Duration = { ...interval }

    Object.keys(duration).forEach((key) => {
      const period = key as DurationUnit
      duration[period] = duration[period]! * attempts
    })

    return inputs.simplify
      ? DurationUtils.simplify(duration)
      : duration
  }
}
