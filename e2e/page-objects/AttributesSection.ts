import type { Page } from "@playwright/test"

/**
 * POM for the Attributes section of the character builder.
 */
export class AttributesSection {
  constructor(private readonly page: Page) {}

  private row(abbr: string) {
    return this.page
      .getByText(`${abbr}:`, { exact: true })
      .locator("xpath=ancestor::div[.//button][1]")
  }

  /**
   * Click the increment button for the attribute identified by its
   * abbreviation label (e.g. "BOD", "AGI") the given number of times.
   * Passing `times = 0` is a valid no-op.
   */
  async increment(abbr: string, times = 1): Promise<void> {
    if (times <= 0) return
    const incBtn = this.row(abbr).getByRole("button").last()
    for (let i = 0; i < times; i++) {
      await incBtn.click()
    }
  }

  /**
   * Click the decrement button for the attribute the given number of times.
   * Passing `times = 0` is a valid no-op.
   */
  async decrement(abbr: string, times = 1): Promise<void> {
    if (times <= 0) return
    const decBtn = this.row(abbr).getByRole("button").first()
    for (let i = 0; i < times; i++) {
      await decBtn.click()
    }
  }

  /**
   * Read the current value of the attribute from the screen and click
   * increment or decrement until the displayed value matches `targetValue`.
   *
   * The attribute row renders the value as "X / max" (e.g. "3 / 6").
   * This method parses X from that text, then clicks the appropriate button
   * the exact number of times needed — so callers never need to compute deltas.
   */
  async setValue(abbr: string, targetValue: number): Promise<void> {
    const row = this.row(abbr)
    // The value cell contains text like "3 / 6". We locate it by matching the
    // "/ " separator that is always present.
    const valueText = await row.locator("text=/ ").textContent()
    const currentValue = Number.parseInt(valueText?.trim().split(" / ")[0] ?? "0", 10)
    const delta = targetValue - currentValue
    if (delta > 0) {
      await this.increment(abbr, delta)
    } else if (delta < 0) {
      await this.decrement(abbr, -delta)
    }
  }
}
