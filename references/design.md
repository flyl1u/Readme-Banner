# Visual decisions

## Inspect the reference images

- [fly-brief](../assets/style-references/fly-brief.png): a large left title; six genuine host icons arranged in two columns; a brace and shared arrow into a skill with its own icon; a distinct report output.
- [CodexPulse](../assets/style-references/codex-pulse.png): the same paper, lettering, and hierarchy; two sidebar illustrations show a specific order change. The selected project keeps its identity as it moves.

These are style and explanation references, not templates to copy word for word. A diagram of a sidebar is an illustration, not evidence of a real application screenshot. See [sources.md](sources.md) for exact upstream files and provenance.

## Starting proportions

| Element | Starting point on a 1680 x 640 canvas | Judgment |
| --- | --- | --- |
| Safe margin | About 60-80 px | Keep rotated edges and descenders inside the canvas. |
| Left text region | About 32-36% of width | The project name remains the first thing seen. |
| Project name | About 88-104 px | Measure the actual name; longer names need more room. |
| Main promise | About 30-34 px, one short line | State what becomes easier or what changes. |
| Optional support line | About 21-24 px | Omit it if it repeats the promise. |
| Diagram labels | About 24-30 px | Keep essential labels readable at normal README width. |
| Outlines | About 2.5-3.5 px | One main stroke plus at most one faint second stroke. |
| Arrow/object gap | About 18-28 px | Measure to the actual rotated silhouette. |
| Card rotation | Usually within 2-4 degrees | Preserve logo geometry and stable text baselines. |

These are useful defaults, not validation targets. The narrower report rows in fly-brief carry subordinate detail; they are not the right size for an essential sentence.

## Palette and typography

- Paper: `#FBF8EF` (ivory) or `#FCFCFA` (near-white).
- Ink: `#343932`; secondary text: `#6E7065`.
- Focus: `#F4D786`.
- Auxiliary fills: peach `#F6DFD2`, sage `#DDEDE2`, blue `#DFEAFA`, lilac `#E8E2EF`.
- Low-contrast dots are optional. Do not turn paper texture into visual noise.
- Title, eyebrow, and product/card-name lettering is rounded and upright, using bundled Comic Relief regular/bold outlines (`letteringStyle: 'upright'`, the default). The approved examples have this distinct character; "hand-drawn" does not mean slanted.
- The left promise and support line use `letteringStyle: 'upright'` in regular weight. The fly-brief English SVG uses upright Comic Sans for both lines (32 px and 21 px); bundled Comic Relief is the portable visual match. Do not choose Kalam merely because these labels are small. Softer diagram captions may use `letteringStyle: 'body'` (Kalam). Explicit Chinese localization keeps the approved Xiaolai outlines in either role.
- A font's bounding box can be much taller than its point size. Reserve real ascender/descender space and measure the actual glyph geometry. A system font name, `cursive`, KaiTi, or a passing bounds check does not prove handwritten appearance or Chinese glyph coverage. Do not silently substitute a serif or sans-serif when handwriting is requested.
- Native SVG text is an explicit editing tradeoff, not the default publication mode. See [lettering.md](lettering.md).

Avoid large shadows, 3D bevels, neon, glass, decorative page numbers, footnotes, and production labels in the banner. Put references and tool details in source notes.

## Diagram judgment

Arrange objects before drawing connections. A group brace can express that several equivalent tools all use one capability. The shared arrow still communicates a left-side input without creating a stack of arrowheads at the skill. Keep separate routes only when their distinctions are the subject.

Use a real project mark for the product, a larger primary object than its surrounding inputs, and a visibly different output artifact. A document output should look like a document, not like another integration icon. The actual result may instead be a reordered list, transformed file, resolved issue, or another project-specific outcome.

In before/after diagrams, keep panel dimensions, row spacing, and identities consistent. Highlight the same entity in both states. A long diagonal arrow can show its movement when that is the central behavior; otherwise a simple directional arrow is enough.

Keep one main reading path. Avoid placing all named products around a central hub when this forces unrelated arrow directions or violates an explicitly requested left-to-right flow.

## Review questions

1. Can a new reader identify the project and say what it does after one glance?
2. Does the right illustration explain a concrete relationship rather than decorate the name?
3. Are factual claims supported, and are schematic illustrations distinguishable from real evidence?
4. Do the title, promise, product mark, and result have a clear order of emphasis?
5. Are names, strokes, icons, and arrowheads separated at README width?
6. Is the file still understandable as an externally embedded SVG image, without scripts or remote resources?

Fix failed judgments in the source and rebuild. Structural validation alone does not settle any of these questions.
