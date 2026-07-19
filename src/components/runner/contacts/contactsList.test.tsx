import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { ContactData } from "#/system/contactData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { ContactsList } from "./contactsList.tsx"

const fixer: ContactData = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Mr. Johnson",
  connection: 4,
  loyalty: 3,
}

// Mirrors how real parents (ContactsBuilderSection, the contacts route) wire
// ContactsList: they own the store subscription and pass the live list down,
// so this small wrapper keeps the list's `contacts` prop bound to the store.
const LiveContactsList: FC = () => {
  const contacts = useRunnerStoreSelector(Selectors.contacts.selectContacts)
  return <ContactsList contacts={contacts} />
}

function renderWithContacts(contacts: ContactData[]) {
  const runnerData = runnerDataFactory((data) => {
    data.contacts = contacts
    return data
  })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<LiveContactsList />, { wrapper: Wrapper })

  return store
}

describe("ContactsList", () => {
  it("shows contacts passed in", () => {
    // Arrange / Act
    renderWithContacts([fixer])

    // Assert
    expect(screen.getByText("Mr. Johnson")).toBeDefined()
  })

  it("adding a contact dispatches addContact with a generated id and updates the store", async () => {
    // Arrange
    const store = renderWithContacts([])

    // Act
    fireEvent.click(screen.getByRole("button", { name: /add contact/i }))
    const dialog = await screen.findByRole("dialog", { name: "Add Contact" })
    fireEvent.change(within(dialog).getByLabelText(/^name/i), {
      target: { value: "Fixer Sam" },
    })
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert: state updated...
    await waitFor(() => expect(store.state.contacts).toHaveLength(1))
    expect(store.state.contacts[0].name).toBe("Fixer Sam")
    expect(store.state.contacts[0].id).not.toBe("")
    // ...and the UI re-rendered off that same state.
    expect(await screen.findByText("Fixer Sam")).toBeDefined()
  })

  it("removing a contact, once confirmed, dispatches removeContact and updates the store", async () => {
    // Arrange
    const store = renderWithContacts([fixer])

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Remove" }))
    fireEvent.click(await screen.findByRole("button", { name: "Remove" }))

    // Assert: state updated...
    await waitFor(() => expect(store.state.contacts).toHaveLength(0))
    // ...and the UI re-rendered off that same state.
    expect(screen.queryByText("Mr. Johnson")).toBeNull()
  })

  it("opens the legwork dialog with the GM and Player test information", async () => {
    // Arrange
    renderWithContacts([fixer])

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Legwork" }))
    const dialog = await screen.findByRole("dialog", { name: "Legwork: Mr. Johnson" })

    // Assert
    expect(within(dialog).getByText("Contact Knowledge Test: Connection + Connection")).toBeDefined()
    expect(within(dialog).getByText("Legwork Test: Charisma + Etiquette + Loyalty")).toBeDefined()
  })
})
