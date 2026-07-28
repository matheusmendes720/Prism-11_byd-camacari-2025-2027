"""
D3 base — cross-refs validator.

Run from `_study_notes_d3/`: python _validate_xrefs.py
"""
import re
import sys
from pathlib import Path

HERE = Path(__file__).parent if "__file__" in globals() else Path.cwd()
ALL_DOCS = sorted(HERE.glob("*.md"))
DOC_NAMES = {p.stem: p for p in ALL_DOCS}

PAT_D3_DOC = re.compile(r"\bD3-(\d)\.(\d)(?:\.(\d))?\b")
PAT_FENCE = re.compile(r"```.*?```", re.DOTALL)


def strip_code_blocks(content):
    return PAT_FENCE.sub("", content)


def is_self_reference(doc_stem, ref):
    if doc_stem.startswith(f"D3-{ref.split('-', 1)[1]}"):
        return True
    return False


def is_valid_doc_name(stem):
    return any(name == stem or name.startswith(stem + "-") for name in DOC_NAMES)


def main():
    print("=" * 70)
    print(f"D3 base — cross-refs validator ({len(ALL_DOCS)} docs)")
    print("=" * 70)

    ref_counts = {}
    broken = []
    skipped_self = 0
    total_refs = 0

    for p in ALL_DOCS:
        content = strip_code_blocks(p.read_text(encoding="utf-8"))
        for m in PAT_D3_DOC.finditer(content):
            ref = m.group(0)
            total_refs += 1
            if is_self_reference(p.stem, ref):
                skipped_self += 1
                continue
            ref_counts[ref] = ref_counts.get(ref, 0) + 1
            expected = ref
            if not is_valid_doc_name(expected):
                broken.append((p.name, ref, expected))

    print(f"\n[Summary] total cross-refs found: {total_refs}")
    print(f"[Summary] skipped (self-refs): {skipped_self}")
    print(f"[Summary] valid cross-refs: {sum(ref_counts.values())}")
    print(f"[Summary] unique valid cross-refs: {len(ref_counts)}")
    print(f"[Summary] broken cross-refs: {len(broken)}")

    print(f"\n[Top 10 most-cited D3 docs/refs]")
    for ref, count in sorted(ref_counts.items(), key=lambda x: -x[1])[:10]:
        print(f"  {ref:14s} : {count:4d} citations")

    if broken:
        print(f"\n[!] Broken cross-refs ({len(broken)}):")
        by_doc = {}
        for doc, ref, expected in broken:
            by_doc.setdefault(doc, []).append((ref, expected))
        for doc, items in by_doc.items():
            print(f"  {doc}:")
            for ref, expected in items[:5]:
                print(f"    - references {ref} (expected: {expected}.md)")
            if len(items) > 5:
                print(f"    ... and {len(items) - 5} more")
    else:
        print("\n[OK] No broken cross-refs!")

    print("=" * 70)


if __name__ == "__main__":
    main()