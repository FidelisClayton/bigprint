---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["index.html"]
---

# Bigprint app (single screen, three steps)

Mode: Operate. Audience: anyone with an A4 printer making a poster at home. Task: upload one image, frame it in the poster's true proportions, print or download the A4 sheets. Constraints: three steps (Upload, Frame, Print), opens straight into the tool, calm and premium, Figma/Framer-grade editor craft, dark and light themes, must not read as a stock dark editor. Replaces the earlier Gallery Mount build, which the user rejected as empty, dull, form-like and unfinished.

Approved comps: `.impeccable/mocks/decision/r3-dark.png` (approved) and `.impeccable/mocks/decision/r3-light.png`; accent to be calmer than shown.

## Direction contract

THESIS: Bigprint is a precise editor whose canvas is the cutting mat you will trim the sheets on, measured in real millimetres. Refuses both the empty gallery wall and the stock dark editor with a blue accent.

OWN-WORLD: Dark default: green-black self-healing cutting-mat canvas with a fine 10 mm grid and brighter 50 mm lines, near-black panels with 1px hairlines. Light: pale grey-green mat, near-white panels. One muted print-proof magenta, never neon, only for the active step, selected sheet and primary action. Geist for UI, Geist Mono for every measurement. Small radii, no shadows beyond the canvas sheets' paper lift.

STORY: The visitor drops a photo, sees it span the sheet artboards at true scale against millimetre rulers, picks size, orientation and margin while the final size updates, then sees the sheets pulled apart with crop marks and assembly steps and prints.

FIRST VIEWPORT: Top bar: Bigprint wordmark left, Upload · Frame · Print segmented control centre, theme toggle and primary "Continue to print" right. Left panel "Sheets": one row per sheet with thumbnail, "Sheet 2 · A4", position words, and a 2×2 position map. Centre canvas: mm rulers top and left marking 0 to the poster's width and height; the poster's sheet artboards labelled above ("Sheet 2 · A4"), one continuous image across them with hairline cut lines; selected sheet outlined in magenta. Right inspector: Poster (Size, Orientation), Paper (Printer margin), Image (Fill/Fit, Zoom), then large mono "400 × 574 mm" pinned at the bottom. Signature move: the measured cutting-mat canvas with rulers marking the real poster extent.

FORM: Canvas editor in the Figma/Framer family, user-pinned (user named Figma/Framer and chose mockup A, then asked for it to be less generic); the roll was not rerun because the user pinned the direction, which replaced the earlier rolled direction. seed:3819858697131432

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
