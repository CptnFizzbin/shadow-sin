import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import type { TextFieldProps } from "@mui/material/TextField"
import TextField from "@mui/material/TextField"
import { RiCloseLine, RiSearchLine } from "@remixicon/react"
import type { FC } from "react"

interface SearchFieldProps extends Omit<TextFieldProps, "onChange"> {
  value: string
  onChange: (query: string) => void
}

export const SearchField: FC<SearchFieldProps> = ({
  value,
  onChange,
  ...props
}) => {
  return (
    <TextField
      size="small"
      fullWidth
      slotProps={{
        input: {
          sx: { paddingRight: 0.5 },
          startAdornment: (
            <InputAdornment position="start">
              <RiSearchLine />
            </InputAdornment>
          ),
          endAdornment: value
            ? (
                <InputAdornment position="end">
                  <IconButton onClick={() => onChange("")} size="small">
                    <RiCloseLine />
                  </IconButton>
                </InputAdornment>
              )
            : null,
        },
      }}
      value={value}
      {...props}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

/**
 * Creates a predicate that checks whether any of the provided search terms appear in an item's searchable text.
 *
 * @param getSearchTexts - Function that returns an array of strings describing the item; these strings are joined with `"|"` and converted to lowercase before matching.
 * @param searchTerms - Array of search terms to test as substrings against the joined searchable text. Each term is compared as-is against the lowercased searchable text (lowercase terms beforehand for case-insensitive matching).
 * @returns `true` if any term in `searchTerms` is a substring of the item's concatenated searchable text, `false` otherwise.
 */
export function filterBySearch<TData>(
  getSearchTexts: (item: TData) => string[],
  searchTerms: string[],
) {
  return (item: TData): boolean => {
    if (searchTerms.length === 0) {
      return false
    }

    const searchText = getSearchTexts(item).join("|").toLowerCase()
    const matchesTerm = (term: string) => searchText.includes(term.toLowerCase())

    return searchTerms.every(matchesTerm)
  }
}
