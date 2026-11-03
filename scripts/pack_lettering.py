#!/usr/bin/env python3
"""Rebuild pinned outline data from an OFL font. Runtime builds need only Node."""
import argparse
import gzip
import hashlib
import json
from pathlib import Path


def pack(font_file, family, weight, source, output, latin=False):
    from fontTools.ttLib import TTFont
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.boundsPen import BoundsPen

    raw = Path(font_file).read_bytes()
    font = TTFont(font_file)
    cmap = font.getBestCmap()
    if latin:
        cmap = {cp: name for cp, name in cmap.items() if cp <= 0x24F or 0x1E00 <= cp <= 0x1EFF or 0x2000 <= cp <= 0x22FF}
    glyph_set = font.getGlyphSet()
    glyphs = {}

    def number(value):
        return format(value, '.3f').rstrip('0').rstrip('.') if value else '0'

    for name in sorted(set(cmap.values())):
        pen = SVGPathPen(glyph_set, ntos=number)
        glyph_set[name].draw(pen)
        bounds_pen = BoundsPen(glyph_set)
        glyph_set[name].draw(bounds_pen)
        glyphs[name] = {'advance': font['hmtx'][name][0], 'bounds': bounds_pen.bounds, 'path': pen.getCommands()}

    kerning = {}
    if latin:
        if 'kern' in font:
            for table in font['kern'].kernTables:
                for (left, right), value in getattr(table, 'kernTable', {}).items():
                    if left in glyphs and right in glyphs and value:
                        key = left + '\0' + right
                        kerning[key] = kerning.get(key, 0) + value
        if 'GPOS' in font:
            gpos = font['GPOS'].table
            lookup_ids = {idx for record in (gpos.FeatureList.FeatureRecord if gpos.FeatureList else []) if record.FeatureTag == 'kern' for idx in record.Feature.LookupListIndex}
            for idx in sorted(lookup_ids):
                lookup = gpos.LookupList.Lookup[idx]
                tables = []
                if lookup.LookupType == 2:
                    tables = lookup.SubTable
                elif lookup.LookupType == 9:
                    tables = [s.ExtSubTable for s in lookup.SubTable if s.ExtensionLookupType == 2]
                for table in tables:
                    for left in set(table.Coverage.glyphs).intersection(glyphs):
                        if table.Format == 1:
                            records = table.PairSet[table.Coverage.glyphs.index(left)].PairValueRecord
                            pairs = [(r.SecondGlyph, getattr(r.Value1, 'XAdvance', 0)) for r in records if r.SecondGlyph in glyphs]
                        else:
                            first = table.ClassDef1.classDefs.get(left, 0)
                            pairs = [(right, getattr(table.Class1Record[first].Class2Record[table.ClassDef2.classDefs.get(right, 0)].Value1, 'XAdvance', 0)) for right in glyphs]
                        for right, value in pairs:
                            if value:
                                key = left + '\0' + right
                                kerning[key] = kerning.get(key, 0) + value

    data = {'schema': 'fly-readme.outlines/v1', 'sourceFamily': family, 'weight': weight,
            'source': source, 'sourceSha256': hashlib.sha256(raw).hexdigest(),
            'license': 'OFL-1.1', 'unitsPerEm': font['head'].unitsPerEm,
            'cmap': {str(cp): name for cp, name in sorted(cmap.items())},
            'glyphs': glyphs, 'kerning': kerning}
    encoded = json.dumps(data, ensure_ascii=True, separators=(',', ':')).encode('utf-8')
    compressed = gzip.compress(encoded, compresslevel=9, mtime=0)
    target = Path(output)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(compressed)
    print(json.dumps({'file': target.name, 'family': family, 'weight': weight,
                      'codepoints': len(cmap), 'glyphs': len(glyphs), 'bytes': len(compressed),
                      'sha256': hashlib.sha256(compressed).hexdigest(),
                      'sourceSha256': data['sourceSha256']}, ensure_ascii=True))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('font')
    parser.add_argument('--family', required=True)
    parser.add_argument('--weight', choices=['regular', 'bold'], default='regular')
    parser.add_argument('--source', required=True)
    parser.add_argument('--out', required=True)
    parser.add_argument('--latin', action='store_true')
    args = parser.parse_args()
    pack(args.font, args.family, args.weight, args.source, args.out, args.latin)
