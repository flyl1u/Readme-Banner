# Task retrospective

This records the reference task's actual progression. Apply the reasoning when relevant; do not turn each detail into a rule for every README.

## End-to-end process

1. Inspect repository instructions, Git status/history, README language variants, existing hero files, and the existing project icon. The repository was the fly-brief skill source, not a client-report workspace.
2. Read the user-selected fly-ppt instructions and its visual/material guidance. Inspect the approved hand-drawn sample. Reuse genuine, attributed Agent SVG logos instead of inventing them.
3. Check official documentation for the six named hosts' skill mechanisms. Separate "has a logo," "supports skills," and "this skill was tested on this host."
4. Author one shared scene for English and Chinese versions requested at the time. Build static SVG, standalone HTML, and PNG previews. The Readme-Banner workflow uses English unless localization is explicitly requested.
5. Inspect the full images. Load the SVG through an actual image element at README and mobile widths, check for overflow and external requests, and retain source/license records.
6. Keep local coherent commits while the user reviews. Do not publish during a preview-only request.
7. First correction: slightly enlarge the left title and reduce the right diagram as a unit. The concrete change was 92 to 100 px for the name and a 0.93 diagram scale. These values were a modest revision, not a permanent preset.
8. Second correction: route all six Agent arrows into the skill's left side. Six adjacent arrowheads made the center crowded even though the direction was correct.
9. Third correction: rearrange the six icons into two columns and three rows, collect them with a light hand-drawn brace, and use one short input arrow. The user preferred this grouped version.
10. Recover and display all three exact versions in one labeled comparison, plus a local page with stack, side-by-side, and enlarge modes. Do not reconstruct discarded versions from memory.
11. After explicit selection and push authorization, fetch the remote. It contained a README paragraph-spacing change. Rebase the three local commits onto that remote commit, verify the remote edit survives and the SVGs still match the selected version, push normally, and confirm the remote/local heads agree and the worktree is clean.
12. For this reusable skill, inspect the current English CodexPulse and fly-brief banners again. CodexPulse demonstrates that the same style can explain a state change without a six-Agent hub.

## Corrections that affect future decisions

| Observation or failure | Correction | Reusable judgment |
| --- | --- | --- |
| The right illustration competed with the name. | Reduce art and its labels together; slightly enlarge the name. | Preserve title dominance without changing the whole style. |
| All arrows reached the left side but looked crowded. | Reorder equivalent inputs, add a brace, and share one arrow. | Correct topology is necessary; a readable diagram also needs fewer competing marks. |
| A slide ID such as `hero.zh-CN` failed the earlier builder. | Use stable lowercase IDs; retain an established asset filename at integration time. | Internal IDs and public filenames do not need to be identical. |
| Text height passed a font-size estimate but failed the actual font box. | Increase label-box space and measure in a browser. | Account for actual glyph metrics, especially handwritten fonts. |
| The in-app browser had no connected backend. | Report the limit and use the available local Chrome renderer. | Verify with an available renderer and name the real verification scope. |
| A comparison ID began with a digit and failed a CSS `#id` selector. | Use letter-prefixed IDs or exact attribute selectors. | A valid HTML ID is not necessarily a directly usable CSS identifier. |
| Reusing one preview filename hid the difference between revisions. | Preserve versioned snapshots and Git blobs. | A review comparison must represent the actual saved versions. |
| The remote advanced while local versions were under review. | Fetch, inspect, integrate on the new base, verify, then push. | Preserve remote edits; a preview task does not authorize publication. |

## What is intentionally not generalized

Six Agents, the exact four report rows, the choice of a report as output, bilingual output, three mandatory variants, the original repository's commit-language ratio, and a 7% scale adjustment are all case details. The reusable skill keeps the visual hierarchy, truthful explanation, thoughtful grouping, source-based iteration, comparison accuracy, and remote-first integration behavior.

## Later font regression

The referenced "Generate README SVG banner" task localized fly-favicon. Its first Chinese version used KaiTi rather than convincing handwriting. Image loading and font bounds had passed, exposing a gap in those checks. The task's manual fix used Xiaolai vector outlines. The reusable skill now bundles licensed English/CJK glyph data and defaults to outlined publication, with real coverage and outline-bound checks. Native text is an explicit editing tradeoff, not a way to claim the same style across systems. See [lettering.md](lettering.md).

The first portable-lettering fix changed every English label to slanted Kalam. The user preferred the corrected small lettering but the original rounded upright "Papertrail" title, eyebrow, and product/card name. The final combination uses upright Comic Relief for those display roles, Kalam for small supporting text, and unchanged Xiaolai Chinese outlines. This is a font-selection correction within the outline pipeline, not a return to system-font fallback.
