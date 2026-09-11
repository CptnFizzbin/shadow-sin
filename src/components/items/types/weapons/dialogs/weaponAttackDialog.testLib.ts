import { act, fireEvent, screen, within } from "@testing-library/react"
import { vi } from "vitest"

export class WeaponAttackDialogPom {
  private readonly dialog: HTMLElement

  constructor(dialog: HTMLElement) {
    this.dialog = dialog
  }

  static async findDialog(title = "Test Pistol") {
    return await screen.findByRole("dialog", { name: title })
  }

  goNext() {
    fireEvent.click(within(this.dialog).getByRole("button", { name: /^next$/i }))
  }

  goBack() {
    fireEvent.click(within(this.dialog).getByRole("button", { name: /^back$/i }))
  }

  clickBackToWeapons() {
    fireEvent.click(within(this.dialog).getByRole("button", { name: /back to weapons/i }))
  }

  selectWeapon(name: string) {
    fireEvent.click(within(this.dialog).getByRole("button", { name: new RegExp(name, "i") }))
  }

  toggleShowDefaultingSkills() {
    fireEvent.click(within(this.dialog).getByRole("checkbox", { name: /show defaulting skills/i }))
  }

  checkModifier(label: string) {
    fireEvent.click(within(this.dialog).getByRole("checkbox", { name: new RegExp(label, "i") }))
  }

  rollAttack() {
    fireEvent.click(within(this.dialog).getByRole("button", { name: /roll attack test/i }))
    act(() => vi.runAllTimers())
  }

  setDefenseHits(value: string) {
    fireEvent.change(within(this.dialog).getByLabelText(/defense hits/i), { target: { value } })
  }

  getStepHeader() {
    return within(this.dialog).queryByRole("heading", { name: "Step Name" })?.textContent
  }

  getPoolText() {
    const el = within(this.dialog).getByText(/^Attack$/).parentElement
    return el?.textContent ?? ""
  }

  getPoolContainerText() {
    const el = within(this.dialog).getByText(/^Attack$/).parentElement?.parentElement
    return el?.textContent ?? ""
  }

  getNetHits() {
    const el = within(this.dialog).getByText("Net Hits").parentElement
    return el?.textContent ?? ""
  }

  getTotalDv() {
    const el = within(this.dialog).getByText("Total DV").parentElement
    return el?.textContent ?? ""
  }

  clickSkill(skillName: string) {
    fireEvent.click(within(this.dialog).getByRole("button", { name: new RegExp(skillName, "i") }))
  }

  getButton(name: string) {
    return within(this.dialog).getByRole("button", { name: new RegExp(name, "i") })
  }

  public within() {
    return within(this.dialog)
  }
}
