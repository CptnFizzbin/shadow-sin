import type { Duration } from "#/utils/duration/duration.ts"

export class AvailabilityFormulas {
  /**
   * Returns the interval of an Availability Test (an Extended Negotiation + Charisma Test against
   * the item's Availability rating) for an item costing `cost` nuyen.
   */
  public static getTestInterval(cost: number): Duration {
    if (cost <= 100) return { hours: 12 }
    if (cost <= 1_000) return { days: 1 }
    if (cost <= 10_000) return { days: 2 }
    return { weeks: 1 }
  }
}
