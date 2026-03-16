"""Convierte Portable Text de Sanity a Markdown sin dependencias externas."""

from __future__ import annotations

MARK_WRAPPERS: dict[str, tuple[str, str]] = {
    "strong": ("**", "**"),
    "em": ("_", "_"),
    "code": ("`", "`"),
    "underline": ("", ""),        # Markdown no tiene underline nativo
    "strike-through": ("~~", "~~"),
}

HEADING_LEVELS: dict[str, str] = {
    "h1": "#", "h2": "##", "h3": "###",
    "h4": "####", "h5": "#####", "h6": "######",
}


def _render_block(block: dict, mark_defs: list) -> str:
    style = block.get("style", "normal")
    link_map = {m["_key"]: m for m in mark_defs if m.get("_type") == "link"}

    parts = []
    for child in block.get("children", []):
        text = child.get("text", "")
        for mark in child.get("marks", []):
            if mark in link_map:
                href = link_map[mark].get("href", "")
                text = f"[{text}]({href})"
            elif mark in MARK_WRAPPERS:
                w = MARK_WRAPPERS[mark]
                text = f"{w[0]}{text}{w[1]}"
        parts.append(text)

    content = "".join(parts)

    if style in HEADING_LEVELS:
        return f"{HEADING_LEVELS[style]} {content}"
    if style == "blockquote":
        return f"> {content}"
    return content


def portable_text_to_markdown(blocks: list) -> str:
    """
    Convierte Portable Text de Sanity a Markdown.
    Soporta: párrafos, headings (h1-h6), blockquote,
    listas (bullet/number), imágenes de bloque y código.
    """
    if not blocks:
        return ""

    lines: list[str] = []
    i = 0

    while i < len(blocks):
        block = blocks[i]
        block_type = block.get("_type", "")

        if block_type == "image":
            url = block.get("asset", {}).get("url", "")
            alt = block.get("alt", "")
            if url:
                lines += [f"![{alt}]({url})", ""]

        elif block_type == "code":
            lang = block.get("language", "")
            code = block.get("code", "")
            lines += [f"```{lang}", code, "```", ""]

        elif block_type == "block":
            list_item = block.get("listItem")
            mark_defs = block.get("markDefs", [])
            rendered = _render_block(block, mark_defs)

            if list_item in ("bullet", "number"):
                counter = 2
                prefix = "-" if list_item == "bullet" else "1."
                items = [f"{prefix} {rendered}"]

                while i + 1 < len(blocks):
                    nxt = blocks[i + 1]
                    if nxt.get("_type") == "block" and nxt.get("listItem") == list_item:
                        i += 1
                        nr = _render_block(nxt, nxt.get("markDefs", []))
                        p = f"{counter}." if list_item == "number" else "-"
                        items.append(f"{p} {nr}")
                        counter += 1
                    else:
                        break

                lines += items + [""]

            elif rendered.strip():
                lines += [rendered, ""]

        i += 1

    return "\n".join(lines).strip()
