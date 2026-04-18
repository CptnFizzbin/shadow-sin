#!/usr/bin/env python3
"""Fix MUI v9 migration: move system props to sx={{}}."""

import re
import sys
from pathlib import Path

SYSTEM_PROPS = {
    "gap", "alignItems", "justifyContent", "flexGrow", "flexShrink", "flexWrap", "alignSelf",
    "padding", "paddingTop", "paddingLeft", "paddingRight", "paddingBottom", "paddingX", "paddingY",
    "px", "py", "pt", "pb", "pl", "pr",
    "margin", "marginTop", "marginLeft", "marginRight", "marginBottom", "marginX", "marginY",
    "mx", "my", "mt", "mb", "ml", "mr",
    "textAlign", "fontWeight", "fontSize", "lineHeight", "letterSpacing",
    "width", "height", "minWidth", "maxWidth", "minHeight", "maxHeight",
    "overflow", "overflowX", "overflowY",
    "display", "bgcolor",
    "border", "borderTop", "borderLeft", "borderRight", "borderBottom", "borderRadius", "borderColor",
    "position", "top", "bottom", "left", "right",
    "flexDirection",
}

COMPONENTS = frozenset({"Stack", "Box", "Typography"})
COMPONENT_PATTERN = re.compile(r"<(Stack|Box|Typography)(?=[\s\n\t\r/{>])")


def read_value(text, i):
    """Read a prop value at position i. Returns (value_str, new_i)."""
    n = len(text)
    if i >= n:
        return "", i

    if text[i] == '"':
        j = i + 1
        while j < n:
            if text[j] == "\\" and j + 1 < n:
                j += 2
            elif text[j] == '"':
                return text[i : j + 1], j + 1
            else:
                j += 1
        return text[i:], n

    elif text[i] == "'":
        j = i + 1
        while j < n:
            if text[j] == "\\" and j + 1 < n:
                j += 2
            elif text[j] == "'":
                return text[i : j + 1], j + 1
            else:
                j += 1
        return text[i:], n

    elif text[i] == "{":
        depth = 0
        in_str = False
        str_char = None
        j = i
        while j < n:
            c = text[j]
            if in_str:
                if c == "\\" and j + 1 < n:
                    j += 2
                    continue
                elif c == str_char:
                    in_str = False
            elif c in ('"', "'"):
                in_str = True
                str_char = c
            elif c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    return text[i : j + 1], j + 1
            j += 1
        return text[i:], n

    return "", i


def parse_props(text):
    """
    Parse JSX props from text.
    Returns (props_list, trailing_ws).
    Each prop is a dict: {name, value, leading_ws, spread}.
    """
    props = []
    i = 0
    n = len(text)
    trailing_ws = ""

    while i < n:
        ws_start = i
        while i < n and text[i] in " \t\n\r":
            i += 1
        leading_ws = text[ws_start:i]

        if i >= n:
            trailing_ws = leading_ws
            break

        if text[i] == ">":
            trailing_ws = leading_ws
            break
        if text[i : i + 2] == "/>":
            trailing_ws = leading_ws
            break

        # Handle spread: {...expr}
        if text[i] == "{":
            value, new_i = read_value(text, i)
            props.append({"name": None, "value": value, "leading_ws": leading_ws, "spread": True})
            i = new_i
            continue

        # Read prop name (handles aria-label, data-testid etc.)
        m = re.match(r"[a-zA-Z_][a-zA-Z0-9_\-]*", text[i:])
        if not m:
            i += 1
            continue

        name = m.group(0)
        i += len(name)

        # Skip whitespace after name
        while i < n and text[i] in " \t":
            i += 1

        if i < n and text[i] == "=":
            i += 1
            value, i = read_value(text, i)
            props.append({"name": name, "value": value, "leading_ws": leading_ws, "spread": False})
        else:
            props.append({"name": name, "value": None, "leading_ws": leading_ws, "spread": False})

    return props, trailing_ws


def sx_entry(name, value):
    """Convert a system prop name+value to sx object entry string."""
    if value is None:
        return f"{name}: true"
    if value.startswith('"') or value.startswith("'"):
        return f"{name}: {value}"
    if value.startswith("{") and value.endswith("}"):
        return f"{name}: {value[1:-1]}"
    return f"{name}: {value}"


def build_sx_value(system_props, existing_sx_value=None):
    """Build the sx={{ ... }} value string."""
    new_entries = [sx_entry(p["name"], p["value"]) for p in system_props]

    if existing_sx_value:
        inner = existing_sx_value.strip()
        # Strip outer JSX brace wrapper
        if inner.startswith("{") and inner.endswith("}"):
            inner = inner[1:-1].strip()
        # Strip inner JS object brace
        if inner.startswith("{") and inner.endswith("}"):
            inner_content = inner[1:-1].strip()
        else:
            inner_content = inner.strip()

        if inner_content:
            # Remove trailing comma if present
            if inner_content.endswith(","):
                inner_content = inner_content[:-1].rstrip()
            all_content = ", ".join(new_entries) + ", " + inner_content
        else:
            all_content = ", ".join(new_entries)
    else:
        all_content = ", ".join(new_entries)

    return "{{ " + all_content + " }}"


def find_tag_end(content, start):
    """Find position right after the closing > or /> of a JSX opening tag."""
    depth = 0
    in_str = False
    str_char = None
    i = start
    n = len(content)

    while i < n:
        c = content[i]
        if in_str:
            if c == "\\" and i + 1 < n:
                i += 2
                continue
            elif c == str_char:
                in_str = False
        elif c in ('"', "'"):
            in_str = True
            str_char = c
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
        elif c == ">" and depth == 0:
            return i + 1
        i += 1

    return n


def transform_tag(tag_text):
    """Move system props from a JSX opening tag into sx={{}}."""
    m = re.match(r"<(\w+)", tag_text)
    if not m:
        return tag_text

    component = m.group(1)
    if component not in COMPONENTS:
        return tag_text

    name_end = m.end()

    # The tag ends with > or />. Since find_tag_end guaranteed this, we can
    # check the last two characters to determine the closing sequence.
    if len(tag_text) >= 2 and tag_text[-2] == "/" and tag_text[-1] == ">":
        closing = "/>"
        props_end = len(tag_text) - 2
    elif tag_text[-1] == ">":
        closing = ">"
        props_end = len(tag_text) - 1
    else:
        return tag_text

    props_text = tag_text[name_end:props_end]
    props, trailing_ws = parse_props(props_text)

    # Separate system props, sx prop, and others
    system_props = [p for p in props if not p.get("spread") and p["name"] in SYSTEM_PROPS]
    sx_prop = next((p for p in props if not p.get("spread") and p["name"] == "sx"), None)
    other_props = [
        p for p in props
        if p.get("spread") or (p["name"] not in SYSTEM_PROPS and p["name"] != "sx")
    ]

    if not system_props:
        return tag_text  # Nothing to move

    # Build the merged sx value
    new_sx_value = build_sx_value(system_props, sx_prop["value"] if sx_prop else None)

    # Determine leading whitespace for the sx prop
    if sx_prop:
        sx_leading_ws = sx_prop["leading_ws"]
    else:
        sx_leading_ws = system_props[0]["leading_ws"]

    # Reconstruct the tag
    result = f"<{component}"

    for prop in other_props:
        result += prop["leading_ws"]
        if prop.get("spread"):
            result += prop["value"]
        elif prop["value"] is not None:
            result += f"{prop['name']}={prop['value']}"
        else:
            result += prop["name"]

    result += sx_leading_ws
    result += f"sx={new_sx_value}"
    result += trailing_ws
    result += closing

    return result


def process_file(file_path):
    """Process a single TSX/TS file."""
    content = Path(file_path).read_text()
    result_parts = []
    i = 0
    n = len(content)
    changed = False

    while i < n:
        m = COMPONENT_PATTERN.search(content, i)
        if not m:
            result_parts.append(content[i:])
            break

        tag_start = m.start()

        # Append content before this tag
        result_parts.append(content[i:tag_start])

        # Find end of the opening tag
        tag_end = find_tag_end(content, tag_start)
        tag_text = content[tag_start:tag_end]

        new_tag = transform_tag(tag_text)
        if new_tag != tag_text:
            changed = True

        result_parts.append(new_tag)
        i = tag_end

    if changed:
        Path(file_path).write_text("".join(result_parts))
        return True

    return False


def main():
    files = sys.argv[1:]
    if not files:
        print("Usage: python fix_mui_sx.py <file1> <file2> ...")
        return

    modified = 0
    for fp in files:
        try:
            if process_file(fp):
                modified += 1
                print(f"  Modified: {fp}")
        except Exception as exc:
            print(f"  ERROR {fp}: {exc}", file=sys.stderr)

    print(f"\nModified {modified}/{len(files)} files.")


if __name__ == "__main__":
    main()
