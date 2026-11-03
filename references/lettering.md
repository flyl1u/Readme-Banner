# Handwriting reliability

## Why the old fallback was unreliable

The original helper emitted native `<text>` with Comic Sans MS, Segoe Print, Bradley Hand, and `cursive`. A local machine might have one of those fonts, while a GitHub viewer might not. Those Latin families also do not guarantee Chinese glyphs. A localized scene could explicitly pick KaiTi or get a serif/sans-serif fallback: it would fit its box and load correctly but would not have the requested hand-drawn lettering.

The user-referenced fly-favicon task demonstrated this exact failure. Its final manual correction used Xiaolai glyph outlines. The reusable helper now applies that solution to ordinary generation, including English, rather than leaving each project to rediscover it.

## Publication default

`textMode: 'outline'` is the default. All authored labels and `draw.text()` use bundled OFL outline data with separate visual roles:

- `letteringStyle: 'upright'` is the default. Comic Relief Regular/Bold gives the large project title, eyebrow, and product/card names the rounded upright character preferred in the original references. It is an open replacement close to the references' Comic Sans appearance, not a bundled copy of Microsoft's font.
- Left-side introductory copy also uses regular-weight `upright`: the fly-brief English reference uses Comic Sans for its promise and support line, not a slanted face. Comic Relief preserves that rounded character as portable outlines.
- `letteringStyle: 'body'` retains Kalam Regular/Bold for optional softer diagram captions. Do not select it automatically for all small text or use its slant for the approved upright left column.
- Explicit Chinese uses Xiaolai Regular in either role. Mixed labels use the appropriate glyph geometry for each character. CJK currently has one genuine font weight; English bold uses a real bold font rather than a synthetic browser weight.

The initial outline fix had changed every English label to Kalam. That solved portability but changed the large-title style. Separate roles preserve the approved heading character and corrected Chinese lettering. A later refinement aligns the English left-side promise and support line with the upright fly-brief reference as well. A system fallback is not needed for either role.

The runtime checks the data checksums, resolves every code point, and checks the actual glyph bounds before export. Unsupported glyphs or missing/corrupt assets fail with a specific error. There is no silent system-font fallback. NFC normalization handles ordinary precomposed Latin accents; this is not a general complex-script shaping engine.

Only glyph paths used in the current banner enter its final SVG, not the whole font database. The SVG contains no font requests, uses no webfont CSS, and keeps the same letter geometry when opened as an image. The full CJK data in the installed skill allow future wording, not just the handful of characters used in one earlier project.

Keep editable words in `scene.cjs`, then rebuild. Final glyph paths remain vector artwork but are not native editable text objects. SVG title/description and per-label accessibility metadata retain the wording. Do not present the final paths as native text editing.

The skill and its ordinary output remain English by default. A Chinese output still requires the user's localization request and `allowCjk: true`; bundling a CJK font does not change that language policy.

## Explicit native-text mode

Use `textMode: 'native'` only when native SVG text editing is an explicit requirement. That mode honors `font`, but the output may use system fallback. Its build report says `portableHandwriting: false`, `coverageChecked: false`, and includes a warning. Do not switch to it just to bypass a missing glyph or a layout error.

Comparison-page headings intentionally use native UI text. The compared banner SVGs are preserved byte for byte; comparison generation must not re-letter saved historical versions.

Raw authored `<text>` in the scene's art is blocked in outline mode. Use separate labels or `draw.text()` instead. Third-party marks containing their own lettering are source assets, not automatically restyled label text; inspect and preserve their identity, and check their portability separately.

## Verification

```text
node scripts/test_lettering.cjs
```

After lettering-code changes, build an English starter and an explicitly localized mixed English/Chinese fixture. Inspect full-size and README-width PNGs; check actual SVG image loading. The outline report must list the actual bundled families and pinned hashes, with `portableHandwriting: true` and `coverageChecked: true`. Do not mistake an ordinary browser font-metrics pass for this check.

When investigating a regression, distinguish three failures: wrong visual font choice, unsupported glyph coverage, and renderer/system fallback. Verify the saved final SVG, not just the scene's declared `font` string. A useful stress test forces a nonexistent font family: outlined banner pixels should remain unchanged, while a native-text control should change.

Font provenance, licenses, data regeneration, and exact checksums are in [assets/lettering/SOURCES.md](../assets/lettering/SOURCES.md). Ordinary generation uses Node alone; Python/fontTools are needed only when regenerating the bundled font data.
