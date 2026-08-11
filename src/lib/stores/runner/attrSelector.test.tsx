import { renderHook } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { AttributesProvider } from "#/lib/contexts/runner/attributesProvider.tsx"
import type { AttributeInfo } from "#/system/attributeInfo.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

import { useAttrSelector } from "./attrSelector.ts"

const infos = Object.fromEntries(
  Object.values(AttributeKey).map((key) => [key, { min: 1, max: 6 }]),
) as Record<AttributeKey, AttributeInfo>

describe("useAttrSelector", () => {
  it("reads the nearest AttributesProvider — entity-agnostic, no Runner assumed", () => {
    // Arrange
    const Wrapper: FC<PropsWithChildren> = ({ children }) => (
      <AttributesProvider values={{ [AttributeKey.agility]: 5 }} infos={infos}>
        {children}
      </AttributesProvider>
    )

    // Act
    const { result } = renderHook(
      () => useAttrSelector(({ forAttr }) => forAttr(AttributeKey.agility).value),
      { wrapper: Wrapper },
    )

    // Assert — e.g. a drone-mounted weapon reading the drone's own agility, not a Runner's
    expect(result.current).toBe(5)
  })
})
