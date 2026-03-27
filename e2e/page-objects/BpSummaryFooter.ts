import { expect } from "@playwright/test"
import type { Page } from "@playwright/test"

export interface BpLineItem {
  label: string
  /**
   * Expected BP cost for this line item.
   * Pass `0` to skip verification (the UI omits the value cell for zero-cost rows).
   */
  bp: number
}

/**
 * POM for the sticky BP summary footer at the bottom of the character builder.
 */
export class BpSummaryFooter {
  constructor(private readonly page: Page) {}

  async expectRemainingZero(): Promise<void> {
    await expect(
      this.page.getByRole("button").filter({ hasText: "0 remaining" }),
    ).toBeVisible()
  }

  private async expandDetail(): Promise<void> {
    await this.page.getByRole("button").filter({ hasText: "0 remaining" }).click()
    await this.page.getByRole("table").waitFor()
  }

  /**
   * Assert that the footer shows "0 remaining" then expand the detail table
   * and verify each non-zero line item shows the expected BP value.
   */
  async verify(lineItems: BpLineItem[]): Promise<void> {
    await this.expectRemainingZero()
    await this.expandDetail()
    for (const { label, bp } of lineItems) {
      if (bp === 0) continue
      const row = this.page.getByRole("table").locator("tr").filter({ hasText: label })
      await expect(row).toContainText(`${bp} BP`)
    }
  }
}
