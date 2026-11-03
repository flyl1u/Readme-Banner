# Bundled outline lettering

These are precompiled glyph drawing data, not system-font registrations. The data stay under SIL Open Font License 1.1. Original copyright notices and the complete licenses are retained beside them. Generated banner documents are not relicensed by the font license.

| Role | Original font | Pinned upstream identity | License |
| --- | --- | --- | --- |
| Upright English regular | Comic Relief Regular, Comic Relief Project Authors | [Google Fonts](https://github.com/google/fonts/blob/main/ofl/comicrelief/ComicRelief-Regular.ttf), Git blob `89bf0faafd3e901f11a5468b2b6bc89b20eb48c1` | [OFL-ComicRelief.txt](OFL-ComicRelief.txt) |
| Upright English bold | Comic Relief Bold, Comic Relief Project Authors | [Google Fonts](https://github.com/google/fonts/blob/main/ofl/comicrelief/ComicRelief-Bold.ttf), Git blob `14f8bf9dc98cc6c572864860c14b817ec4a34aff` | [OFL-ComicRelief.txt](OFL-ComicRelief.txt) |
| Body English regular | Kalam Regular, Indian Type Foundry | [Google Fonts](https://github.com/google/fonts/blob/main/ofl/kalam/Kalam-Regular.ttf), Git blob `0c956a29348e69bff24a1ae8952fd0b42569311c` | [OFL-Kalam.txt](OFL-Kalam.txt) |
| Body English bold | Kalam Bold, Indian Type Foundry | [Google Fonts](https://github.com/google/fonts/blob/main/ofl/kalam/Kalam-Bold.ttf), Git blob `321272d977887fefb4911789a2691d3131d1bcf0` | [OFL-Kalam.txt](OFL-Kalam.txt) |
| Explicit Chinese localization | Xiaolai Regular v3.126, LXGW and Nozomi Seto | [Upstream release](https://github.com/lxgw/kose-font/releases/tag/v3.126), `Xiaolai-Regular.ttf`; original SHA-256 in `manifest.json` | [OFL-Xiaolai.txt](OFL-Xiaolai.txt) |

The Xiaolai input was the exact pinned font used by the user-referenced fly-favicon correction. Its SHA-256 was verified before compilation. The license is the unmodified upstream OFL notice retained with that correction. The Comic Relief and Kalam download bytes were verified against their Git blob IDs before compilation. Comic Relief is the upright open replacement used to approximate the references' Comic Sans character; no Microsoft font is redistributed by this skill.

`pack_lettering.py` converts Unicode mappings, advance widths, glyph bounds, and SVG outlines using fontTools SVGPathPen and BoundsPen. Kalam data include Latin characters and supported punctuation, plus horizontal kerning. Xiaolai data retain the source font's complete mapped glyph coverage, including 44,871 code points. CJK is loaded only when needed. This preserves future Chinese words without relying on a small task-specific text subset.

The data files have independent SHA-256 checksums in `manifest.json`. Runtime generation uses Node built-ins (`fs`, `zlib`, `crypto`) only. Python and fontTools are needed only to regenerate these data, not to create a new banner. No user needs to install the source fonts in their operating system.

To rebuild from the pinned source files:

```text
python scripts/pack_lettering.py ComicRelief-Regular.ttf --family "Comic Relief" --source https://github.com/google/fonts/blob/main/ofl/comicrelief/ComicRelief-Regular.ttf --out assets/lettering/upright-regular.json.gz --latin
python scripts/pack_lettering.py ComicRelief-Bold.ttf --family "Comic Relief" --weight bold --source https://github.com/google/fonts/blob/main/ofl/comicrelief/ComicRelief-Bold.ttf --out assets/lettering/upright-bold.json.gz --latin
python scripts/pack_lettering.py Kalam-Regular.ttf --family Kalam --source https://github.com/google/fonts/blob/main/ofl/kalam/Kalam-Regular.ttf --out assets/lettering/latin-regular.json.gz --latin
python scripts/pack_lettering.py Kalam-Bold.ttf --family Kalam --weight bold --source https://github.com/google/fonts/blob/main/ofl/kalam/Kalam-Bold.ttf --out assets/lettering/latin-bold.json.gz --latin
python scripts/pack_lettering.py Xiaolai-Regular.ttf --family Xiaolai --source https://github.com/lxgw/kose-font/releases/tag/v3.126 --out assets/lettering/cjk-regular.json.gz
```

Update manifest checksums after an intentional source update. Do not change checksums to hide missing or corrupted assets. These glyph paths support English and explicitly requested Chinese layout; this helper is not a general shaping engine for complex scripts.
