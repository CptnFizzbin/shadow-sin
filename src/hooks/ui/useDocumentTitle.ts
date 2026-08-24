import { useEffect } from "react"

/**
 * Sets `document.title` for as long as the calling component is mounted, restoring whatever
 * title was in place beforehand once it unmounts.
 */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    return () => {
      document.title = previousTitle
    }
  }, [title])
}
