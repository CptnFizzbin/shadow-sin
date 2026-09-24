# Testing conventions

Unit tests use the **Arrange / Act / Assert** (AAA) pattern, with three labelled comment blocks in each test body:

```ts
it("does something", () => {
  // Arrange
  const sheet = makeSheet(...)

  // Act
  const { result } = renderHook(() => useMyHook(), { wrapper: makeWrapper(sheet) })

  // Assert
  expect(result.current).toBe(expected)
})
```

Suites run sequentially unless a `describe` opts in with `describe.concurrent(...)`. Opt in when every test inside
(including nested `describe`s, which inherit it) builds its own state in its own `// Arrange` step — not from a `let`
that a `beforeEach` reassigns, or a module-level singleton the tests mutate. Do **not** mark a suite concurrent when
it:

- Renders via `@testing-library/react` (`render`/`renderHook`) — those tests share and tear down the single
  `document`, so interleaved tests corrupt each other's DOM.
- Uses `vi.useFakeTimers()`/`vi.setSystemTime()` — fake timers are one global mock shared by the whole file.
- Tests a module-level singleton where the tests intentionally chain off each other's mutations.
