#!/usr/bin/env bash
set -euo pipefail

python3 - "$@" <<'PY'
from __future__ import annotations

import argparse
import datetime as dt
import re
import sys
import unicodedata
from pathlib import Path


PART_DEFAULT_SLUGS = [
    "1-introduction",
    "2-judgment-gap",
    "3-waivers-of-agency",
    "4-veil-piercing",
    "5-conclusion",
]

AUTHOR_MAP: dict[str, str] = {}
LABEL_MAP: dict[str, str] = {}


def parse_csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog="paper-to-blog.sh",
        description="Convert a paper source into a Hugo branch bundle."
    )
    parser.add_argument("source", type=Path, help="Source .tex or .md file")
    parser.add_argument(
        "output_dir",
        type=Path,
        help="Output branch bundle directory, e.g. content/English/posts/slug",
    )
    parser.add_argument(
        "--source-format",
        choices=("tex", "markdown"),
        default=None,
        help="Override source format detection",
    )
    parser.add_argument("--title", default=None, help="Landing page title")
    parser.add_argument(
        "--bib",
        type=Path,
        default=None,
        help="Optional BibTeX file used to preserve author names in textual citations",
    )
    parser.add_argument("--description", default=None, help="Frontmatter description")
    parser.add_argument("--date", default=None, help="Hugo date value")
    parser.add_argument("--draft", default="false", choices=("true", "false"))
    parser.add_argument("--lang", default="en", help="Language code, e.g. en or zh")
    parser.add_argument("--translation-key", default=None)
    parser.add_argument("--categories", default="Essays")
    parser.add_argument(
        "--tags",
        default="AI governance,judgment,accountability,waivers of agency",
    )
    parser.add_argument(
        "--url-prefix",
        default=None,
        help="Absolute site path for this bundle, e.g. /en/posts/waivers-of-agency",
    )
    parser.add_argument(
        "--child-slugs",
        default=",".join(PART_DEFAULT_SLUGS),
        help="Comma-separated child page filenames without .md",
    )
    parser.add_argument(
        "--child-titles",
        default=None,
        help="Optional comma-separated child page titles",
    )
    parser.add_argument(
        "--combine-tail-from",
        type=int,
        default=5,
        help="One-based section number from which remaining sections are combined",
    )
    parser.add_argument(
        "--append-heading-to-index",
        action="append",
        default=[],
        help="Markdown top-level heading to append to _index.md, useful for glossaries",
    )
    parser.add_argument(
        "--append-heading-to-tail",
        action="append",
        default=[],
        help="Markdown top-level heading to append to the final child page",
    )
    parser.add_argument(
        "--drop-heading",
        action="append",
        default=[],
        help="Markdown top-level heading to omit from output",
    )
    return parser.parse_args()


def split_top_level_markdown(text: str) -> tuple[list[str], dict[str, str]]:
    parts: dict[str, list[str]] = {}
    order: list[str] = []
    current: str | None = None
    for line in text.splitlines():
        if line.startswith("## "):
            current = line[3:].strip()
            order.append(current)
            parts[current] = []
            continue
        if current is not None:
            parts[current].append(line)
    return order, {key: "\n".join(value).strip() for key, value in parts.items()}


def strip_markdown_hr(text: str) -> str:
    text = re.sub(r"(?m)^\s*-{3,}\s*$", "", text.strip())
    return re.sub(r"\n{3,}", "\n\n", text).strip()


def truncate_description(text: str, limit: int = 220) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= limit:
        return text
    prefix = text[:limit].rstrip()
    if " " in prefix:
        prefix = prefix.rsplit(" ", 1)[0]
    return prefix.rstrip(".,;:") + "..."


def simple_slug(value: str) -> str:
    value = unicodedata.normalize("NFKD", value)
    value = value.encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^a-zA-Z0-9]+", "-", value.lower()).strip("-")
    return value or "section"


def toml_quote(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def toml_array(values: list[str]) -> str:
    return "[" + ", ".join(f'"{toml_quote(value)}"' for value in values) + "]"


def frontmatter(
    *,
    title: str,
    date: str,
    draft: str,
    description: str | None,
    categories: list[str],
    tags: list[str],
    translation_key: str | None,
    weight: int | None = None,
    build_list_never: bool = False,
    show_toc: bool = True,
    hide_summary: bool = False,
    show_post_nav_links: bool | None = None,
) -> str:
    lines = ["+++"]
    lines.append(f'date = "{toml_quote(date)}"')
    lines.append(f"draft = {draft}")
    lines.append(f'title = "{toml_quote(title)}"')
    if description:
        lines.append(f'description = "{toml_quote(description)}"')
        lines.append(f'summary = "{toml_quote(description)}"')
    if categories:
        lines.append(f"categories = {toml_array(categories)}")
    if tags:
        lines.append(f"tags = {toml_array(tags)}")
    if translation_key:
        lines.append(f'translationKey = "{toml_quote(translation_key)}"')
    if weight is not None:
        lines.append(f"weight = {weight}")
    lines.append(f"ShowToc = {str(show_toc).lower()}")
    if hide_summary:
        lines.append("hideSummary = true")
    if show_post_nav_links is not None:
        lines.append(f"ShowPostNavLinks = {str(show_post_nav_links).lower()}")
    if build_list_never:
        lines.append("")
        lines.append("[build]")
        lines.append('  list = "never"')
    lines.append("+++")
    return "\n".join(lines) + "\n\n"


def find_braced(text: str, open_brace: int) -> tuple[str, int]:
    depth = 0
    for idx in range(open_brace, len(text)):
        char = text[idx]
        if char == "{" and (idx == 0 or text[idx - 1] != "\\"):
            depth += 1
        elif char == "}" and (idx == 0 or text[idx - 1] != "\\"):
            depth -= 1
            if depth == 0:
                return text[open_brace + 1 : idx], idx + 1
    return text[open_brace + 1 :], len(text)


def replace_one_arg_command(text: str, command: str, wrapper) -> str:
    marker = "\\" + command + "{"
    start = 0
    chunks: list[str] = []
    while True:
        idx = text.find(marker, start)
        if idx == -1:
            chunks.append(text[start:])
            break
        chunks.append(text[start:idx])
        inner, end = find_braced(text, idx + len(command) + 1)
        chunks.append(wrapper(convert_latex_inline(inner)))
        start = end
    return "".join(chunks)


def replace_footnotes(text: str) -> str:
    marker = "\\footnote{"
    start = 0
    chunks: list[str] = []
    while True:
        idx = text.find(marker, start)
        if idx == -1:
            chunks.append(text[start:])
            break
        chunks.append(text[start:idx])
        inner, end = find_braced(text, idx + len("\\footnote"))
        converted = convert_latex_inline(inner).strip()
        chunks.append(f" ({converted})" if converted else "")
        start = end
    return "".join(chunks)


def replace_href(text: str) -> str:
    marker = "\\href{"
    start = 0
    chunks: list[str] = []
    while True:
        idx = text.find(marker, start)
        if idx == -1:
            chunks.append(text[start:])
            break
        chunks.append(text[start:idx])
        url, mid = find_braced(text, idx + len("\\href"))
        if mid < len(text) and text[mid] == "{":
            label, end = find_braced(text, mid)
            label = convert_latex_inline(label).strip() or url
            chunks.append(f"{label} ({url})")
            start = end
        else:
            chunks.append(url)
            start = mid
    return "".join(chunks)


def replace_citations(text: str) -> str:
    def textual_repl(match: re.Match[str]) -> str:
        keys = [key.strip() for key in match.group("keys").split(",") if key.strip()]
        names = [AUTHOR_MAP.get(key, "") for key in keys]
        names = [name for name in names if name]
        return "; ".join(names)

    text = re.sub(
        r"\\citet(?:\[[^\]]*\])?(?:\[[^\]]*\])?\{(?P<keys>[^{}]*)\}",
        textual_repl,
        text,
    )
    citation = re.compile(r"\\citep?(?:\[[^\]]*\])?(?:\[[^\]]*\])?\{[^{}]*\}")

    def repl(match: re.Match[str]) -> str:
        value = match.group(0)
        options = re.findall(r"\[([^\]]*)\]", value)
        kept = "; ".join(convert_latex_inline(option).strip() for option in options if option.strip())
        return f" ({kept})" if kept else ""

    return citation.sub(repl, text)


def replace_refs(text: str) -> str:
    def section_repl(match: re.Match[str]) -> str:
        label = match.group(1)
        return "§" + LABEL_MAP.get(label, label)

    text = re.sub(r"\\S\\ref\{([^{}]+)\}", section_repl, text)
    text = re.sub(r"\\ref\{([^{}]+)\}", lambda m: LABEL_MAP.get(m.group(1), m.group(1)), text)
    return text


def convert_latex_inline(text: str) -> str:
    text = replace_refs(text)
    text = replace_citations(text)
    text = replace_footnotes(text)
    text = replace_href(text)
    text = replace_one_arg_command(text, "emph", lambda inner: f"*{inner}*")
    text = replace_one_arg_command(text, "textit", lambda inner: f"*{inner}*")
    text = replace_one_arg_command(text, "textbf", lambda inner: f"**{inner}**")
    text = replace_one_arg_command(text, "url", lambda inner: inner)
    replacements = {
        "``": '"',
        "''": '"',
        "\\S\\S": "§§",
        "\\S": "§",
        "\\ldots": "...",
        "\\dots": "...",
        "\\texteuro": "€",
        "\\c{c}": "ç",
        "\\&": "&",
        "\\%": "%",
        "\\$": "$",
        "\\#": "#",
        "\\_": "_",
        "\\textbackslash": "\\",
        "\\ ": " ",
        "~": " ",
    }
    for before, after in replacements.items():
        text = text.replace(before, after)
    text = text.replace("---", "—").replace("--", "–")
    text = re.sub(r"\\[a-zA-Z]+\*?(?:\[[^\]]*\])?", "", text)
    text = text.replace("{", "").replace("}", "")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r" +([,.;:!?])", r"\1", text)
    return text.strip()


def convert_latex_block(text: str) -> str:
    text = re.sub(r"(?m)^%.*\n?", "", text)
    text = re.sub(r"\\label\{[^{}]*\}", "", text)
    text = re.sub(r"\\begin\{(?:center|document)\}|\\end\{(?:center|document)\}", "", text)
    text = re.sub(r"\\(?:thispagestyle|bibliographystyle|bibliography)\{[^{}]*\}", "", text)
    text = re.sub(r"\\medskip|\\noindent", "", text)
    text = re.sub(r"\\subsubsection\{([^{}]+)\}", lambda m: "### " + convert_latex_inline(m.group(1)), text)
    text = re.sub(r"\\subsection\{([^{}]+)\}", lambda m: "## " + convert_latex_inline(m.group(1)), text)
    text = re.sub(r"\\section\{([^{}]+)\}", lambda m: "# " + convert_latex_inline(m.group(1)), text)
    lines = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            lines.append("")
            continue
        if line.startswith("#"):
            lines.append(line)
        else:
            lines.append(convert_latex_inline(line))
    text = "\n".join(lines)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def extract_tex_title(text: str) -> str:
    match = re.search(r"\{\\LARGE\\bfseries\s+(.+?)\\par\}", text, flags=re.S)
    if match:
        return convert_latex_inline(match.group(1))
    match = re.search(r"pdftitle=\{([^{}]+)\}", text)
    if match:
        return convert_latex_inline(match.group(1))
    return "Untitled Paper"


def collect_label_map(body: str) -> dict[str, str]:
    labels: dict[str, str] = {}
    section = 0
    subsection = 0
    subsubsection = 0
    current = ""
    for line in body.splitlines():
        if re.search(r"\\section\{", line):
            section += 1
            subsection = 0
            subsubsection = 0
            current = str(section)
        if re.search(r"\\subsection\{", line):
            subsection += 1
            subsubsection = 0
            current = f"{section}.{subsection}"
        if re.search(r"\\subsubsection\{", line):
            subsubsection += 1
            current = f"{section}.{subsection}.{subsubsection}"
        for label in re.findall(r"\\label\{([^{}]+)\}", line):
            labels[label] = current
    return labels


def parse_bib_authors(text: str) -> dict[str, str]:
    authors: dict[str, str] = {}
    for entry in re.finditer(r"@\w+\s*\{\s*([^,\s]+)\s*,(.*?)(?=\n@\w+\s*\{|\Z)", text, re.S):
        key = entry.group(1).strip()
        body = entry.group(2)
        match = re.search(r"author\s*=\s*\{(.+?)\}\s*,?\s*(?:\n\s*\w+\s*=|\n\})", body, re.S | re.I)
        if not match:
            continue
        raw = re.sub(r"\s+", " ", match.group(1)).strip()
        raw = raw.replace("\\&", "&")
        parts = [part.strip().strip("{}") for part in re.split(r"\s+and\s+", raw) if part.strip()]
        surnames = []
        for part in parts:
            if "," in part:
                surname = part.split(",", 1)[0].strip()
            else:
                surname = part.split()[-1] if part.split() else part
            surnames.append(surname.strip("{}"))
        if not surnames:
            continue
        if len(surnames) == 1:
            authors[key] = surnames[0]
        elif len(surnames) == 2:
            authors[key] = f"{surnames[0]} and {surnames[1]}"
        else:
            authors[key] = f"{surnames[0]} et al."
    return authors


def parse_tex(text: str) -> dict:
    global LABEL_MAP
    title = extract_tex_title(text)
    abstract_match = re.search(r"\\begin\{abstract\}(.*?)\\end\{abstract\}", text, flags=re.S)
    abstract = convert_latex_block(abstract_match.group(1)) if abstract_match else ""
    keywords_match = re.search(r"\\noindent\\textbf\{Keywords:\}\s*(.+)", text)
    keywords = convert_latex_inline(keywords_match.group(1)) if keywords_match else ""
    body_match = re.search(r"(\\section\{.+)", text, flags=re.S)
    body = body_match.group(1) if body_match else text
    body = re.split(r"\\bibliographystyle|\\bibliography|\\end\{document\}", body)[0]
    LABEL_MAP = collect_label_map(body)
    section_re = re.compile(r"\\section\{([^{}]+)\}")
    matches = list(section_re.finditer(body))
    sections = []
    for idx, match in enumerate(matches):
        start = match.start()
        end = matches[idx + 1].start() if idx + 1 < len(matches) else len(body)
        section_title = convert_latex_inline(match.group(1))
        section_text = convert_latex_block(body[start:end])
        section_text = re.sub(r"^# .+\n?", "", section_text, count=1).strip()
        sections.append({"title": section_title, "body": section_text})
    return {"title": title, "abstract": abstract, "keywords": keywords, "sections": sections}


def parse_markdown(text: str, args: argparse.Namespace) -> dict:
    title_match = re.search(r"^#\s+(.+)$", text, flags=re.M)
    title = title_match.group(1).strip() if title_match else "Untitled Paper"
    order, blocks = split_top_level_markdown(text)
    abstract = strip_markdown_hr(blocks.get("摘要", ""))
    keywords = strip_markdown_hr(blocks.get("关键词", ""))
    drop = set(args.drop_heading)
    append_elsewhere = set(args.append_heading_to_index) | set(args.append_heading_to_tail)
    section_heads = [
        heading
        for heading in order
        if re.match(r"^[一二三四五六七八九十]+、", heading)
        and heading not in drop
        and heading not in append_elsewhere
    ]
    sections = []
    for heading in section_heads:
        body = strip_markdown_hr(blocks[heading])
        body = re.sub(r"^### ", "## ", body, flags=re.M)
        body = re.sub(r"^#### ", "### ", body, flags=re.M)
        sections.append({"title": heading, "body": body.strip()})
    extras = {heading: strip_markdown_hr(blocks.get(heading, "")) for heading in order}
    notes: dict[str, str] = {}
    if "注释" in blocks:
        note_text = strip_markdown_hr(blocks["注释"])
        for match in re.finditer(r"^\[(\d+)\]\s+(.+?)(?=^\[\d+\]\s+|\Z)", note_text, re.S | re.M):
            notes[match.group(1)] = re.sub(r"\s+", " ", match.group(2)).strip()
    return {
        "title": title,
        "abstract": abstract,
        "keywords": keywords,
        "sections": sections,
        "extras": extras,
        "notes": notes,
    }


def group_sections(sections: list[dict], combine_tail_from: int) -> list[dict]:
    if combine_tail_from <= 0 or combine_tail_from > len(sections):
        return sections
    head = sections[: combine_tail_from - 1]
    tail = sections[combine_tail_from - 1 :]
    if not tail:
        return head
    combined_body_parts = []
    for index, section in enumerate(tail):
        if index > 0:
            combined_body_parts.append(f"## {section['title']}")
        combined_body_parts.append(section["body"])
    combined_title = tail[0]["title"]
    return head + [{"title": combined_title, "body": "\n\n".join(combined_body_parts).strip()}]


def nav_block(
    *,
    lang: str,
    base: str | None,
    child_slugs: list[str],
    child_titles: list[str],
    index: int | None,
) -> str:
    if not base:
        return ""
    base = "/" + base.strip("/")
    labels = {
        "en": {
            "contents": "Contents",
            "previous": "Previous",
            "next": "Next",
        },
        "zh": {
            "contents": "目录",
            "previous": "上一节",
            "next": "下一节",
        },
    }.get(lang, {"contents": "Contents", "previous": "Previous", "next": "Next"})
    if index is None:
        rows = [f"- [{title}]({base}/{slug}/)" for title, slug in zip(child_titles, child_slugs)]
        return "## " + labels["contents"] + "\n\n" + "\n".join(rows)
    links = [f"[{labels['contents']}]({base}/)"]
    if index > 0:
        links.insert(0, f"[{labels['previous']}: {child_titles[index - 1]}]({base}/{child_slugs[index - 1]}/)")
    if index < len(child_slugs) - 1:
        links.append(f"[{labels['next']}: {child_titles[index + 1]}]({base}/{child_slugs[index + 1]}/)")
    return "---\n\n" + " | ".join(links)


def apply_markdown_notes(body: str, notes: dict[str, str]) -> str:
    if not notes:
        return body
    used: list[str] = []

    def marker_repl(match: re.Match[str]) -> str:
        number = match.group(1)
        if number not in used:
            used.append(number)
        return f"[^{number}]"

    body = re.sub(r"\^\[(\d+)\]\^", marker_repl, body)
    definitions = [f"[^{number}]: {notes[number]}" for number in used if number in notes]
    if definitions:
        body = body.rstrip() + "\n\n" + "\n".join(definitions)
    return body


def write_file(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text.rstrip() + "\n", encoding="utf-8")


def main() -> int:
    args = parse_args()
    source_text = args.source.read_text(encoding="utf-8")
    source_format = args.source_format
    if source_format is None:
        source_format = "tex" if args.source.suffix == ".tex" else "markdown"
    if source_format == "tex":
        global AUTHOR_MAP
        bib_path = args.bib
        if bib_path is None:
            candidates = sorted(args.source.parent.glob("*.bib"))
            bib_path = candidates[0] if len(candidates) == 1 else None
        if bib_path and bib_path.exists():
            AUTHOR_MAP = parse_bib_authors(bib_path.read_text(encoding="utf-8"))
    parsed = parse_tex(source_text) if source_format == "tex" else parse_markdown(source_text, args)

    title = args.title or parsed["title"]
    date = args.date or dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()
    categories = parse_csv(args.categories)
    tags = parse_csv(args.tags)
    child_slugs = parse_csv(args.child_slugs)
    sections = group_sections(parsed["sections"], args.combine_tail_from)
    if len(child_slugs) < len(sections):
        child_slugs.extend(
            f"{idx + 1}-{simple_slug(section['title'])}"
            for idx, section in enumerate(sections[len(child_slugs) :], start=len(child_slugs))
        )
    child_slugs = child_slugs[: len(sections)]
    if args.child_titles:
        child_titles = parse_csv(args.child_titles)
        if len(child_titles) < len(sections):
            child_titles.extend(section["title"] for section in sections[len(child_titles) :])
    else:
        child_titles = [section["title"] for section in sections]

    description = args.description or truncate_description(parsed.get("abstract", ""))
    translation_key = args.translation_key or simple_slug(title)
    args.output_dir.mkdir(parents=True, exist_ok=True)

    index_parts = []
    if parsed.get("abstract"):
        heading = "## Abstract" if args.lang != "zh" else "## 摘要"
        index_parts.append(heading + "\n\n" + parsed["abstract"])
    if parsed.get("keywords"):
        heading = "## Keywords" if args.lang != "zh" else "## 关键词"
        index_parts.append(heading + "\n\n" + parsed["keywords"])
    index_parts.append(
        nav_block(
            lang=args.lang,
            base=args.url_prefix,
            child_slugs=child_slugs,
            child_titles=child_titles,
            index=None,
        )
    )
    for heading in args.append_heading_to_index:
        extra = parsed.get("extras", {}).get(heading, "")
        if extra:
            index_parts.append(f"## {heading}\n\n{extra}")

    write_file(
        args.output_dir / "_index.md",
        frontmatter(
            title=title,
            date=date,
            draft=args.draft,
            description=description,
            categories=categories,
            tags=tags,
            translation_key=translation_key,
            show_toc=True,
            show_post_nav_links=False,
        )
        + "\n\n".join(part for part in index_parts if part.strip()),
    )

    for idx, section in enumerate(sections):
        body = section["body"]
        if idx == len(sections) - 1:
            for heading in args.append_heading_to_tail:
                extra = parsed.get("extras", {}).get(heading, "")
                if extra:
                    body = body.rstrip() + f"\n\n## {heading}\n\n{extra}"
        body = body.rstrip()
        body = re.sub(r"\n\s*-{3,}\s*$", "", body).rstrip()
        body = apply_markdown_notes(body, parsed.get("notes", {}))
        body = body + "\n\n" + nav_block(
            lang=args.lang,
            base=args.url_prefix,
            child_slugs=child_slugs,
            child_titles=child_titles,
            index=idx,
        )
        write_file(
            args.output_dir / f"{child_slugs[idx]}.md",
            frontmatter(
                title=child_titles[idx],
                date=date,
                draft=args.draft,
                description=None,
                categories=categories,
                tags=tags,
                translation_key=f"{translation_key}-{idx + 1}",
                weight=idx + 1,
                build_list_never=True,
                show_toc=True,
                hide_summary=True,
                show_post_nav_links=False,
            )
            + body,
        )

    return 0


if __name__ == "__main__":
    sys.exit(main())
PY
