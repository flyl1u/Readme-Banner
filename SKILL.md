---
name: readme-banner
description: Create or refine an English SVG introduction banner at the top of a project README, using a large project title, concise purpose, and a clear hand-drawn product diagram on light paper. Use when the user says Readme-Banner or requests a README hero/header SVG in this style, including local previews, revisions, and version comparisons. Not for rewriting an entire README, website heroes, standalone logos, or slide decks.
---

# Readme-Banner

Make the top of a README explain the project at a glance: a dominant name and short promise on the left, one useful product relationship on the right. Deliver a static, self-contained SVG and an actual PNG preview.

Write banner copy, SVG titles/descriptions, alt text, source notes, filenames, and comparison labels in English. Do not infer Chinese output from the conversation language or the repository's README language. Preserve real product identifiers. A later explicit localization request can override this default; do not translate unrelated README prose.

## Understand the project, then choose the picture

Inspect the repository instructions, current README image links, project description, relevant implementation, existing icon, and Git status. Use the user's named reference projects; do not scan unrelated local projects for assets. Read [references/design.md](references/design.md) and inspect the two bundled English reference PNGs before the first design.

Establish the project's audience, concrete input or trigger, useful result, and the one relationship the diagram should explain. Keep capability claims tied to the repository or official evidence. A brand icon does not prove compatibility or completed testing.

- Multiple equivalent inputs or hosts: group them, then show a single input into the product and one useful output. The fly-brief reference uses this shape.
- A change in order, state, or behavior: show a concrete before/after example. The CodexPulse reference uses this shape.
- A short sequence or another relationship: draw that relationship directly. The two starters are examples, not a required icon count or diagram grammar.

Use the existing project icon when available. Draw original generic symbols for generic concepts; obtain actual brand marks from supplied assets, official resources, or an attributed icon library. Do not generate or guess brand logos. Keep provenance and licenses outside the banner artwork.

## Compose and build

Start around 1680 x 640. Give the left title room to dominate; keep the right illustration subordinate. Use near-white or ivory paper, dark pencil lines, soft pastel fills, a restrained yellow underline, and subtle irregular outlines. Shorten copy or simplify a picture before shrinking text into illegibility. Numeric starting points and semantic checks are in the design reference.

When arrows crowd the target, reconsider the object arrangement before adjusting curves. For equivalent hosts, two columns of icons with a light brace and one shared arrow can replace six adjacent arrowheads. Do not merge paths when the individual routes carry different meanings. Keep left-to-right input/output direction unless the user's subject requires otherwise.

Author a project-owned `scene.cjs`. The helpers accept arbitrary SVG art and separate text labels; they do not constrain the picture to a fixed template. The skill is self-contained and does not require fly-ppt.

Publish hand lettering as bundled vector outlines, the default `textMode: 'outline'`. Use rounded, upright lettering for the project title, eyebrow (such as "Agent Skill"), and product/card names: `letteringStyle: 'upright'` is the default and uses OFL Comic Relief regular/bold. Keep the softer small-text treatment with `letteringStyle: 'body'` (Kalam); explicitly requested Chinese uses Xiaolai in either role. Do not replace the approved upright headings with slanted handwriting just because both are hand-drawn. A `cursive` stack, KaiTi, or a passing text-bounds check does not establish the intended style. Missing glyphs/assets fail clearly. Words remain editable in `scene.cjs`; use `textMode: 'native'` only for an explicit need to edit SVG text itself, and disclose its system-font dependence. See [references/lettering.md](references/lettering.md).

```text
node <skill>/scripts/build.cjs <project>/scene.cjs --out <project>/output/hero-v1
```

Read [references/authoring.md](references/authoring.md) when writing or building a scene. Use only the relevant starter:

- [assets/starters/grouped-flow.cjs](assets/starters/grouped-flow.cjs): fictional input group, product icon, local document output.
- [assets/starters/before-after.cjs](assets/starters/before-after.cjs): fictional project-order transformation.

SVG and HTML generation use Node.js alone. PNG rendering uses an available browser or Sharp. Locate installed runtimes and modules through the environment's dependency tool when provided; do not write machine-specific paths into source files. Keep output in the target project, not in this installed skill folder.

## Inspect, revise, and compare

Actually inspect the full PNG and the README-width preview after each layout or asset change. Check title dominance, English text, text boundaries, true logo appearance, negative space, arrow direction, and distance from arrowheads to objects. Inspect the image at mobile width for cropping and overflow; a scaled desktop banner does not make every small diagram label readable on a phone.

The builder checks actual outline bounds and glyph coverage before rendering, then checks an actual SVG image at desktop/mobile widths when it can use a browser. For the default mode, `build-report.json` must report `lettering.portableHandwriting: true` and `lettering.coverageChecked: true`. Native font metrics are not the same as outline bounds. Sharp output is raster validation only; do not describe it as a browser check.

Keep successive accepted directions in distinct output directories or snapshot filenames. When asked to compare, recover the actual saved versions or Git blobs rather than reconstructing them from memory. Preserve equal aspect ratios and identify meaningful differences. Use [scripts/compare.cjs](scripts/compare.cjs) for a single labeled comparison PNG and an offline HTML page with stack, side-by-side, and enlarge controls. One focused direction is normally enough; do not force three alternatives into every request.

For a request like "slightly larger title and smaller diagram," retain the established visual language and change the hierarchy modestly. Scale diagram text and shapes together. For arrow congestion, try a different arrangement or a shared connector instead of packing endpoints more tightly. [references/retrospective.md](references/retrospective.md) records the actual revision decisions and technical corrections behind these rules.

## Integrate and deliver

Update the existing top image asset and English alt text when README integration is in scope. Preserve language links, badges, headings, and unrelated body edits. Prefer an existing asset name over leaving an unused new hero. A static SVG must contain its own resources: no scripts, foreignObject, remote fonts, remote images, API key, or build step to view it. Default lettering paths preserve the style without installed fonts; source labels and SVG accessibility metadata preserve the wording.

Leave maintainable scene source and actual asset/license notes with the project. If continued editing must work without this skill installed, copy the needed helper files and bundled lettering assets into the project using their relative layout. Disclose font fallback limits when native text is explicitly requested. Include the requested SVG link and inline PNG in the response; include a comparison only when useful or requested.

Respect the current request's publishing scope. "Preview first" means prepare and show local work; an earlier push for another task does not authorize this banner's publication. If the user authorizes pushing, fetch and inspect the remote changes, place the intended banner changes on the current remote base, verify unrelated remote edits remain, then perform a normal push. If the remote advances, inspect and integrate the new changes before retrying. Do not force-push to bypass divergence. Follow the target repository's commit rules; do not invent a universal commit-language quota from this reference repository.
