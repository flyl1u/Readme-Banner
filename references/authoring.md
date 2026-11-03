# Authoring and verification

## Runtime

Node.js 20 or newer. SVG and offline HTML export use Node built-ins and the bundled glyph data; they need no packages, system fonts, or network. PNG export uses `playwright` with Chrome/Edge/Chromium when available, otherwise `sharp`. Use the environment's dependency locator before installing anything. Resolution checks normal modules, `FLY_README_NODE_MODULES`, `NODE_PATH`, and modules adjacent to the running Node executable. `FLY_README_BROWSER` selects a browser executable when automatic discovery is unsuitable.

```text
node <skill>/scripts/build.cjs --doctor
node <skill>/scripts/build.cjs <project>/scene.cjs --out <project>/output/hero-v1 --renderer browser
node <skill>/scripts/build.cjs <project>/scene.cjs --out <project>/output/hero-v1 --formats svg,html
```

Use environment variables for local runtime paths; do not put usernames, cache versions, absolute skill paths, or browser paths in project source. The scripts write output only to the requested directory, do not modify a README or Git state, and do not install dependencies.

## Scene contract

Write the scene in the target project or copy the relevant starter there. A scene is local JavaScript executed by Node; author it yourself or inspect it before execution.

```javascript
module.exports = ({draw: d, sceneDir}) => ({
  id: 'hero',
  title: 'ProjectName - a concrete useful outcome',
  description: 'An English explanation of the depicted relationship.',
  width: 1680,
  height: 640,
  background: d.paper(),
  art: d.box({x: 800, y: 240, w: 350, h: 170, fill: '#F4D786'}),
  labels: [
    {text: 'ProjectName', x: 60, y: 190, w: 505, h: 150,
      size: 86, bold: true, letteringStyle: 'upright', letterSpacing: -3},
    {text: 'One concrete result.', x: 66, y: 340, w: 490, h: 57,
      size: 32, letteringStyle: 'upright'},
  ],
  sources: ['List actual content, asset, and license sources here.'],
});
```

This minimal syntax example is not a completed product explanation. A finished scene needs a subject-specific right diagram. Export `{title, sources, variants: [sceneA, sceneB]}` only when multiple directions or language variants are actually needed. IDs must be unique and use a lowercase letter followed by letters, digits, or hyphens.

Labels use canvas pixels: `text`, `x`, `y`, `w`, `h`, `size`, optional `color`, `bold`, `align` (`left`, `center`, `right`), `rotate`, `lineHeight`, and `letterSpacing`. Newlines are allowed, but measure their real height. Bounds include the rotated label box and the actual outline bounds. Default labels use bundled handwritten glyphs and export as paths. Their words remain in the source and the label group's `aria-label`.

Use `letteringStyle: 'upright'` (the default) for the title, eyebrow, and product/card names. This selects rounded Comic Relief, including a true bold weight. Keep the left promise and support line in regular-weight `upright` too, following fly-brief. Reserve `letteringStyle: 'body'` for softer diagram captions; font size alone does not select a family. Chinese continues to use Xiaolai in both styles. `bold` and font size do not silently choose a slanted heading face. The starters demonstrate the approved combination.

Set a scene's `textMode: 'native'` only for an explicitly requested native-text editing requirement. Only that mode uses a label's `font` field. Legacy `font` strings do not override the bundled handwriting in default outline mode. Native exports carry a portability warning in the report. See [lettering.md](lettering.md) before changing this policy.

## Drawing helpers

- `paper({width,height,color,dots})`: light paper and optional dots.
- `path(d,{color,width,fill,opacity})`: rounded pencil path.
- `box({x,y,w,h,fill,rotate,seed})`: a restrained irregular outline.
- `arrow({from,to,bend,width,head,color})`: one arrowhead aligned with the last curve tangent. Leave the object gap yourself.
- `brace({x,y,h,color})`: right-side grouping brace with a middle outlet.
- `symbol({kind,cx,cy,size,color})`: generic `document`, `link`, `notes`, `image`, `chat`, or `check` symbol. These are not brand marks.
- `image({file,x,y,w,h,alt})`: embed a local SVG/PNG/JPEG/WebP without stretching its aspect ratio. SVG resources are checked for active/external content.
- `tile({cx,cy,size,fill,rotate,seed,kind,file})`: generic symbol or real local image in a hand-drawn frame.
- `group({art,labels},{scale,origin})`: transform the diagram's art and label geometry together. For the reference's modest reduction, `scale: .93, origin: [1610,320]` keeps the right edge and vertical midpoint stable.
- `text(label,index)`: outlined lettering for advanced art fragments. Prefer separate labels so review/reporting can inspect their bounds. Raw authored `<text>` in art is rejected in outline mode instead of bypassing the font guarantee.

Arbitrary SVG fragments remain available. Do not change content semantics to fit helper functions. All copy and metadata default to English. For a later explicitly requested localization, `allowCjk: true` on a scene disables the Han-character check; the user instruction must authorize that change. The check also inspects nested SVG images, so translate hidden title metadata on a copied generic/project mark when appropriate and record that modification.

## Output and review

For each scene ID, the default build writes:

- `<id>.svg`: static, self-contained vector file, with bundled letter shapes exported as paths by default.
- `<id>.png`: full canvas preview.
- `<id>-readme.png`: image at 980 px width.
- `<id>-mobile.png`: image at 358 px width.
- `preview.html`: self-contained local image viewer.
- `build-report.json`: actual renderer, outline bounds/native-font measurement status, glyph-coverage/portability results, original font and data hashes, image load checks, source SVG hashes, and warnings.
- `SOURCES.md`: the scene's source notes when provided.

The browser route measures each separate label and loads the final SVG as an image. Outline mode checks real glyph coverage and geometry without a browser; `fontMetricsChecked` is reserved for native text, and `labelBoundsChecked` records browser measurement of either representation. A successful build still needs visual inspection: it does not prove arrow spacing, icon fidelity, truth of claims, or good visual emphasis. Sharp cannot verify browser image behavior; its thumbnails are scaled raster output. The outlined letter shapes themselves are independent of the renderer's installed fonts.

For repository maintenance, keep `scene.cjs` and asset notes near the hero. For rebuilds without this installed skill, copy `draw.cjs`, `runtime.cjs`, `build.cjs`, and `lettering.cjs` into a project-owned `tools/readme/scripts/` directory, and copy `assets/lettering/` into `tools/readme/assets/lettering/`. This relative layout is required by the lettering loader. Copy `compare.cjs` only if future comparisons are needed. Preserve the included OFL notices and manifest checksums. The finished SVG itself needs none of these build resources.

## Compare actual versions

Save a manifest such as:

```json
{
  "title": "README banner comparison",
  "items": [
    {"label": "01 Original", "file": "hero-v1/hero.svg", "description": "Separate input arrows"},
    {"label": "02 Grouped", "file": "hero-v2/hero.svg", "description": "A shared input"}
  ]
}
```

Files resolve relative to the manifest. Recover old SVGs from the known Git revisions or saved output if necessary. The comparison never changes them; its report records the exact input hashes. Different aspect ratios are rejected instead of silently cropping a version.

```text
node <skill>/scripts/compare.cjs <project>/output/variants.json --out <project>/output/comparison
```

This writes `comparison.svg`, `comparison.png`, `comparison.html`, and `comparison-report.json`. HTML supports stack/side layouts and click-to-enlarge. With `--formats svg,html`, no renderer is needed. Do not label a sequence of genuinely different content as equivalent design alternatives without explaining the difference.
