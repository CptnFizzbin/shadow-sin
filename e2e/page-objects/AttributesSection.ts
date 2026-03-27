import type { Page } from "@playwright/test"

/**
 * POM for the Attributes section of the character builder.
 */
export class AttributesSection {
  constructor(private readonly page: Page) {}

  /**
   * Click the increment button for the attribute identified by its
   * abbreviation label (e.g. "BOD", "AGI") the given number of times.
   * Passing `times = 0` is a valid no-op (useful when computing increments
   * programmatically and the attribute is already at the target value).
   */
  async increment(abbr: string, times = 1): Promise<void> {
    if (times <= 0) return
    const row = this.page
      .getByText(`${abbr}:`, { exact: true })
      .locator("xpath=ancestor::div[.//button][1]")
    const incBtn = row.getByRole("button").last()
    for (let i = 0; i < times; i++) {
      await incBtn.click()
    }
  }
}
