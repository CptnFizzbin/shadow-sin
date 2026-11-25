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
 * Creates a predicate that matches an item when every term in `searchTerms` is found,
 * case-insensitively, somewhere in the text `getSearchTexts` returns for that item.
 *
 * @param getSearchTexts - Returns the searchable text for an item.
 * @param searchTerms - Terms that must all match for the predicate to return `true`. An empty array never matches.
 * @returns A predicate suitable for `Array.prototype.filter`.
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
