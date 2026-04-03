import { InputAdornment } from "@mui/material"
import IconButton from "@mui/material/IconButton"
import type { TextFieldProps } from "@mui/material/TextField"
import TextField from "@mui/material/TextField"
import { RiCloseLine, RiSearchLine } from "@remixicon/react"
import type { FC } from "react"

interface SearchFieldProps extends Omit<TextFieldProps, "onChange"> {
  value: string
  onChange: (query: string) => void
}

export const SearchField: FC<SearchFieldProps> = ({
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
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => onChange("")} size="small">
                <RiCloseLine />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      {...props}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export function filterBySearch<TData>(getSearchTexts: (item: TData) => string[], searchTerms: string[]) {
  return (item: TData): boolean => {
    const searchText = getSearchTexts(item).join("|").toLowerCase()
    return searchTerms.some((term) => searchText.includes(term))
  }
}
