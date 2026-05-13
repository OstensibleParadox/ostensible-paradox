# Paper-to-Blog Workflow

`paper-to-blog.sh` converts an academic paper into a Hugo branch bundle suitable
for the multilingual PaperMod site layout used in this repository.

## Output Shape

The script writes one branch bundle:

```text
content/English/posts/example-paper/
├── _index.md
├── 1-introduction.md
├── 2-section.md
├── 3-section.md
├── 4-section.md
└── 5-conclusion.md
```

The `_index.md` file is the public landing page. Child pages include:

- TOML front matter
- `translationKey`
- `build.list = "never"` so only the parent appears in post listings
- explicit previous/contents/next links

## Basic Usage

```sh
scripts/paper-to-blog.sh paper.tex content/English/posts/example-paper \
  --lang en \
  --title "Example Paper" \
  --date "2026-05-13T08:00:00+08:00" \
  --translation-key example-paper \
  --url-prefix /en/posts/example-paper
```

For a translated Markdown source:

```sh
scripts/paper-to-blog.sh paper_zh.md content/Chinese/posts/example-paper \
  --source-format markdown \
  --lang zh \
  --title "示例论文" \
  --translation-key example-paper \
  --url-prefix /zh/posts/example-paper
```

## Conversion Rules

For LaTeX input, the converter:

- removes document preamble, bibliography commands, labels, and document wrappers
- converts `\section`, `\subsection`, and `\subsubsection` to Markdown structure
- converts `\emph{}` / `\textit{}` to italics and `\textbf{}` to bold
- converts LaTeX quotes and common escapes such as `\S`, `\ldots`, `\&`, and `\_`
- strips `\citet{}` and `\citep{}` keys while preserving optional locator text
- converts footnotes to inline parentheticals

For Markdown input, it splits top-level `##` paper sections into child pages.
Translator note markers written as `^[1]^` are converted into per-page Markdown
footnotes when a `## 注释` section is present. Use `--append-heading-to-index`
for translated glossaries and `--append-heading-to-tail` for appendices that
should live on the final child page.

## Long Papers

By default, sections from the fifth paper section onward are combined into the
final child page:

```sh
--combine-tail-from 5
```

Set a larger value or `0` to avoid tail grouping.

## Current Waivers Paper Commands

```sh
scripts/paper-to-blog.sh \
  ~/Documents/1_under_peer/waivers/paper/20260331_main_anonymous.tex \
  content/English/posts/waivers-of-agency \
  --lang en \
  --title "Waivers of Agency: How AI Companies Exploit the Gap Between Rules and Judgment" \
  --date "2026-05-13T08:00:00+08:00" \
  --translation-key waivers-of-agency \
  --url-prefix /en/posts/waivers-of-agency \
  --child-titles "Introduction: The Judgment Deficit in AI Governance,The Judgment Gap in AI Governance,Waivers of Agency: When Rules Replace Judgment,Veil-Piercing as Institutional Judgment,Rules Without Judgment and Conclusion"

scripts/paper-to-blog.sh \
  ~/Documents/1_under_peer/waivers/paper/20260331_main_anonymous_zh.md \
  content/Chinese/posts/waivers-of-agency \
  --source-format markdown \
  --lang zh \
  --title "能动性放弃：人工智能企业如何利用规则与判断力之间的鸿沟" \
  --date "2026-05-13T00:00:00+08:00" \
  --translation-key waivers-of-agency \
  --url-prefix /zh/posts/waivers-of-agency \
  --child-titles "第一部分：引言：人工智能治理中的判断力赤字,第二部分：人工智能治理中的判断力鸿沟,第三部分：能动性放弃：当规则取代判断力,第四部分：刺破公司面纱作为制度性判断力,第五部分：规则、制度前提与结论" \
  --append-heading-to-index "术语对照表" \
  --drop-heading "参考文献"
```
