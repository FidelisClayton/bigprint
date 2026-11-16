---
name: Bigprint
description: A precise poster editor whose canvas is the cutting mat you trim the sheets on, measured in real millimetres.
colors:
  proof-magenta-dark: "#e06a9d"
  proof-magenta-fill-dark: "#bc4777"
  proof-magenta-deep-dark: "#a53c68"
  proof-magenta-soft-dark: "rgb(224 106 157 / 0.14)"
  proof-magenta-light: "#b8336a"
  proof-magenta-deep-light: "#9f2a5b"
  proof-magenta-soft-light: "rgb(184 51 106 / 0.1)"
  panel-dark: "#0a0c0c"
  panel-2-dark: "#131716"
  mat-dark: "#0d1e1b"
  ink-dark: "#e8efeb"
  mute-dark: "#8c9c95"
  line-dark: "rgb(255 255 255 / 0.09)"
  line-strong-dark: "rgb(255 255 255 / 0.18)"
  grid-dark: "rgb(110 210 180 / 0.075)"
  grid-major-dark: "rgb(110 210 180 / 0.17)"
  ruler-bg-dark: "#0a1715"
  ruler-line-dark: "rgb(110 210 180 / 0.3)"
  ruler-ink-dark: "#8fb9ab"
  sel-bg-dark: "#202826"
  sel-line-dark: "#5d6a65"
  ctl-dark: "#7b8984"
  panel-light: "#f6f8f7"
  panel-2-light: "#ecf1ee"
  mat-light: "#e6ece8"
  ink-light: "#121a16"
  mute-light: "#55635d"
  line-light: "rgb(19 36 29 / 0.13)"
  line-strong-light: "rgb(19 36 29 / 0.26)"
  grid-light: "rgb(19 36 29 / 0.075)"
  grid-major-light: "rgb(19 36 29 / 0.17)"
  ruler-bg-light: "#dbe3df"
  ruler-ink-light: "#3d4a44"
  paper: "#ffffff"
  paper-empty-dark: "rgb(255 255 255 / 0.035)"
  paper-empty-light: "rgb(255 255 255 / 0.55)"
  cut-light-dark: "rgb(255 255 255 / 0.55)"
  cut-light-light: "rgb(255 255 255 / 0.75)"
  cut-dark-dark: "rgb(0 0 0 / 0.35)"
  cut-dark-light: "rgb(0 0 0 / 0.22)"
typography:
  wordmark:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.035em"
  heading:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  figure:
    fontFamily: "Geist Mono Variable, ui-monospace, monospace"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
  ui:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
    fontFeature: "tnum"
  measure:
    fontFamily: "Geist Mono Variable, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
  ruler:
    fontFamily: "Geist Mono Variable, ui-monospace, monospace"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1
rounded:
  hair: "2px"
  chip: "3px"
  seg-item: "4px"
  control: "5px"
  container: "6px"
  card: "8px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
components:
  button-primary:
    backgroundColor: "{colors.proof-magenta-fill-dark}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "36px"
    typography: "{typography.ui}"
  button-primary-hover:
    backgroundColor: "{colors.proof-magenta-deep-dark}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink-dark}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "36px"
  button-secondary-hover:
    backgroundColor: "{colors.panel-2-dark}"
  button-text:
    textColor: "{colors.mute-dark}"
    padding: "0 4px"
    height: "28px"
  input-measure:
    backgroundColor: "{colors.panel-2-dark}"
    textColor: "{colors.ink-dark}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "36px"
    typography: "{typography.measure}"
  segmented:
    backgroundColor: "{colors.panel-2-dark}"
    textColor: "{colors.mute-dark}"
    rounded: "{rounded.container}"
    padding: "3px"
    height: "36px"
  segmented-selected:
    backgroundColor: "{colors.sel-bg-dark}"
    textColor: "{colors.ink-dark}"
    rounded: "{rounded.seg-item}"
  segmented-step-selected:
    backgroundColor: "{colors.proof-magenta-fill-dark}"
    textColor: "{colors.paper}"
    rounded: "{rounded.seg-item}"
  orientation-tile:
    backgroundColor: "{colors.panel-2-dark}"
    textColor: "{colors.mute-dark}"
    rounded: "{rounded.container}"
    height: "68px"
  orientation-tile-selected:
    backgroundColor: "{colors.sel-bg-dark}"
    textColor: "{colors.ink-dark}"
  sheet-row:
    rounded: "{rounded.container}"
    padding: "8px 12px"
    typography: "{typography.ui}"
  sheet-row-selected:
    backgroundColor: "{colors.proof-magenta-soft-dark}"
    textColor: "{colors.proof-magenta-dark}"
  sheet-label:
    textColor: "{colors.mute-dark}"
    rounded: "{rounded.chip}"
    padding: "1px 6px"
    typography: "{typography.label}"
---

# Design System: Bigprint

## Overview

**Creative North Star: "The Measured Cutting Mat"**

Bigprint is a canvas editor in the Figma/Framer family whose canvas is the self-healing mat the person will trim the sheets on. The mat carries a fine 10 mm grid with brighter 50 mm lines, millimetre rulers on the top and left edges mark exactly 0 to the poster's real width and height, and the sheets sit on it as white paper artboards at true scale. Everything around the mat is a quiet instrument: near-black (dark) or near-white (light) panels divided by 1px hairlines, Geist for words, Geist Mono for every number that is a measurement.

The system is dense and exact rather than airy. Panels are fixed-width columns with 20px gutters; type stays between 11px and 18px except for the wordmark and the final-size figure, which is the one large number on screen because the honest final size is the product's promise. Colour is almost entirely green-grey neutrals; one muted print-proof magenta marks what is active, selected or primary.

Both themes are first-class and carry the same structure. Dark is a green-black mat under near-black panels; light is a pale grey-green mat under near-white panels. The theme follows the system preference until the person toggles it, and the toggle reveals the new theme as a circle growing from the button.

The visual world rejects the empty gallery wall (an earlier, rejected direction) and the stock dark editor with a blue accent.

**Key Characteristics:**
- A measured mat canvas: 10 mm minor grid, 50 mm major grid, mm rulers that end exactly at the poster's extent.
- Paper is the only object with a shadow.
- One muted magenta accent; every other surface is a green-tinted neutral.
- Geist Mono for every millimetre, percentage and step number; tabular numerals everywhere.
- Small radii (2px to 8px) and 1px hairlines; no decorative chrome.

## Colors

A green-grey neutral world with a single print-proof magenta; dark and light themes share token names and roles.

### Primary
- **Proof Magenta** (`proof-magenta-dark` / `proof-magenta-light`): the accent as text and line. Selected sheet outline (1.5px ring on the canvas), selected sheet name in the Sheets list and on the canvas label, the focus ring, the caret, the drag-over dashed outline, and error text.
- **Proof Magenta Fill** (`proof-magenta-fill-dark` / `proof-magenta-light`): solid fills under white text. The primary button, the active step pill in the top bar, the selected cell of a sheet's position map, text selection, and the "Release to place the photo" pill. In dark it is darker than the text magenta so white text keeps AA contrast.
- **Proof Magenta Deep** (`proof-magenta-deep-*`): primary button hover.
- **Proof Magenta Wash** (`proof-magenta-soft-*`): the background of the selected row in the Sheets list.

### Neutral
- **Instrument Black / Instrument White** (`panel-*`): top bar, Sheets panel, inspector, mobile action bar, page background.
- **Raised Panel** (`panel-2-*`): resting fill of inputs, segmented controls and unselected orientation tiles; hover fill of secondary buttons, sheet rows and the theme toggle.
- **Cutting Mat** (`mat-*`): the canvas background. Deep green-black in dark, pale grey-green in light.
- **Mat Grid** (`grid-*`, `grid-major-*`): 1px canvas lines every 10 mm, brighter every 50 mm. Mint-tinted in dark, ink-tinted in light.
- **Ruler** (`ruler-bg-*`, `ruler-line-*`, `ruler-ink-*`): the top (26px) and left (36px) ruler bands, their edge line, and their ticks and numbers.
- **Ink** (`ink-*`): primary text, hover ring on a sheet.
- **Mute** (`mute-*`): secondary text, field names, unselected segments, the "mm" unit, unselected sheet labels.
- **Hairline / Strong Hairline** (`line-*`, `line-strong-*`): 1px panel dividers and container borders; strong for input and secondary-button borders, slider track, dashed empty-sheet outline, thumbnail outline.
- **Selection Neutral** (`sel-bg-*`, `sel-line-*`, `ink`): the selected state for non-step choices (Size, Fill/Fit, orientation). In light it inverts to ink; in dark it is a lifted grey-green with a mid-grey border.
- **Control** (`ctl-*`): slider range and thumb border.
- **Paper** (`paper`): sheet artboards on the mat. Empty sheets are a faint translucent white (`paper-empty-*`) with a dashed outline.
- **Cut Line** (`cut-light-*` + `cut-dark-*`): the two-tone 1px line drawn on inner sheet edges of the assembled poster, readable over any photo.

### Named Rules
**The One Proof Colour Rule.** Magenta marks only what is active, selected or primary: the current step, the selected sheet, the primary action, focus and the caret. Non-step selections (size, fit, orientation) use the neutral selection colour, never magenta.

**The Green Neutral Rule.** Every neutral carries the mat's green tint (HSL hue 140 to 180). No pure greys in UI chrome, and no blue anywhere.

## Typography

**Display Font:** Geist Variable (with ui-sans-serif, system-ui)
**Body Font:** Geist Variable
**Label/Mono Font:** Geist Mono Variable (with ui-monospace)

**Character:** A single neo-grotesk for all words, paired with its own mono for measurements, so numbers read as instrument readouts. The body sets `tabular-nums` globally so changing values never jitter.

### Hierarchy
- **Wordmark** (600, 28px desktop / 22px under 900px, line-height 1, -0.035em): "Bigprint" in the top bar only.
- **Figure** (Geist Mono 400, 26px, -0.02em): the final image size ("400 × 574 mm") pinned at the bottom of the inspector, the unit in mute.
- **Heading** (600, 18px, line-height 1.25, -0.01em): panel and section titles ("Sheets", "Poster", "Paper", "Image", "Assembly").
- **Body** (500, 14px): the upload card's prompt and the drag-over pill.
- **UI** (400, 13px, 1.4): default text for controls, field names, sheet rows, assembly steps. Buttons use 500.
- **Measure** (Geist Mono 400, 13px): margin input value, zoom percentage, inline sizes in assembly steps.
- **Label** (11px): sheet labels on the canvas ("Sheet 2 · A4") and step numbers (mono) in the step control and assembly list.
- **Ruler** (Geist Mono 500, 10px): ruler numbers, drawn on canvas.

### Named Rules
**The Mono Measurement Rule.** Every millimetre value, percentage and step number is Geist Mono. Words stay in Geist.

**The One Big Number Rule.** The final-size figure is the largest text in the app after the wordmark. No other value is set larger.

## Layout

A three-column editor at 1100px and wider: Sheets panel (280px, left), canvas (fluid), inspector (300px, right), under a 64px top bar. Between 900px and 1099px the Sheets panel hides. Under 900px the layout stacks: a 56px top bar, the canvas at 58dvh (min 340px), the inspector below, and a fixed bottom action bar carrying the primary action; step numbers in the step control show only from 640px.

The canvas keeps one pixels-per-mm scale (capped at 3) for every step, sized so both the assembled poster and the pulled-apart sheets fit, so steps only move things and never rescale. Canvas padding is 28px (14px under 600px) inside the rulers, with 24px reserved above and below for sheet labels. Pulled-apart sheets sit 30 mm apart. Bottom-row labels go below the poster so no label covers the image.

Panel rhythm: 20px horizontal and vertical padding per section, 16px between fields, 8px between a field name and its control, 1px hairline between sections. The final-size block is pinned to the inspector's bottom with its own top hairline.

## Elevation & Depth

Flat. Depth comes from tonal layers (panel, raised panel, mat) and 1px hairlines. The only shadow in the system is the paper lift under the sheets on the mat: under the assembled poster as one backing (so inner cut lines carry no shadow), and under each sheet when pulled apart.

### Shadow Vocabulary
- **Paper Lift, light** (`box-shadow: 0 1px 2px rgb(19 36 29 / 0.14), 0 6px 16px rgb(19 36 29 / 0.12)`): sheets on the mat.
- **Paper Lift, dark** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.4), 0 8px 20px rgb(0 0 0 / 0.35)`): sheets on the mat.

### Named Rules
**The Only Paper Lifts Rule.** Shadows belong to paper on the mat. Panels, cards, buttons and the upload card stay flat.

## Shapes

Small, precise corners. Paper sheets are square-cornered like real A4. Controls use 5px; containers (segmented track, orientation tiles, sheet rows) 6px; segmented items 4px inside them; the floating upload card 8px. Thumbnails and position-map cells use 2px, canvas sheet labels 3px. Circles appear only on the slider thumb, slider track ends and the numbered assembly badges.

Borders are 1px hairlines. Rings are 1.5px (focus, selected sheet, hovered sheet). Dashed lines mean "nothing here yet" or "drop here": empty sheet outlines and the drag-over outline.

## Components

### Buttons
Compact and quiet; the primary is the only filled button.
- **Shape:** gently squared (5px), 36px tall, 16px horizontal padding, 13px medium text.
- **Primary:** magenta fill with white text; hover deepens to magenta deep. One per screen: "Continue to print", "Print N sheets", "Choose image".
- **Secondary:** transparent with a strong hairline border and ink text; hover fills with the raised panel ("Download PNGs").
- **Text:** 28px tall, mute text with a strong-hairline underline offset 4px; hover turns ink ("Replace image", "Back to framing").
- **Press / Focus / Disabled:** every button scales to 0.97 on press; focus is a 1.5px magenta outline offset 2px; disabled is 45% opacity.

### Segmented control
- **Style:** raised-panel track, 1px hairline, 6px radius, 3px inset, 36px tall; items mute, hover ink.
- **Selected:** a pill that slides between items (clip-path, 220ms); text colour changes exactly with the pill. The step control uses the magenta fill; every other segmented control uses the neutral selection colour.
- **Step control:** "Upload · Frame · Print" with mono step numbers, completed steps show a check; later steps are disabled until an image exists.

### Inputs / Fields
- **Style:** raised-panel fill, strong hairline, 5px radius, 36px tall, mono value, the unit ("mm") in mono mute inside the right edge.
- **Focus:** border and 1.5px outline turn magenta, no offset.
- **Slider:** 3px track in strong hairline, control-colour range, 14px circular thumb with a 2px control-colour border on panel fill.

### Orientation tiles
68px tall, 6px radius, a 24px outline icon above the label. Unselected: raised panel, hairline, mute. Selected: neutral selection fill and border.

### Navigation
The top bar is a three-part grid: wordmark left, step control centred, theme toggle and primary action right, on panel with a bottom hairline. The theme toggle is a 36px icon button whose sun and moon cross-rotate and scale.

### Sheets list (signature)
One row per sheet: a true-proportion thumbnail of that sheet's tile (2px radius, strong-hairline outline; dashed placeholder before an image), the name ("Sheet 2 · A4") and position words ("top right"), and a position map of 12×14px cells in the poster's grid. Selected row: magenta wash, magenta name, magenta map cell. Hover row: raised panel; hovering a row also rings that sheet on the canvas in ink.

### Cutting mat canvas (signature)
The mat, grid and rulers are drawn on canvas from the theme tokens. Rulers mark 0 to the poster's exact width and height in mm, with ticks every 10 mm (longer every 50 mm), numbers every 50 mm and a longer tick and number at the exact end. Sheets show the assembled poster with two-tone cut lines on inner edges and only outer margins visible; in the print step they pull apart to full A4 pages with black crop marks when the margin is 4 mm or more. Sheet labels sit above each sheet in 11px mute; selected is magenta, hovered ink.

### Upload card
A floating 8px-radius card centred on the poster, panel at 92% opacity with a hairline, holding the prompt, the primary button and a privacy line in mute. On drag-over it dims to 35% and a magenta pill reads "Release to place the photo" while each sheet shows a dashed magenta outline.

### Motion
Motion is authored, short and interruptible. Tokens: `--ease-out` cubic-bezier(0.23, 1, 0.32, 1) for arrivals and feedback; `--ease-in-out` cubic-bezier(0.77, 0, 0.175, 1) for things that move from one place to another on the canvas and the segmented pill; `--ease-drawer` cubic-bezier(0.32, 0.72, 0, 1) for the mobile action bar.
- **Feedback:** button press scale 0.97 (160ms), colour changes 150ms, sheet ring and label colour 120ms linear.
- **Canvas moves:** layout changes (size, orientation, margin) morph sheets and the grid in 260ms; pulling sheets apart takes 420ms with a 30ms stagger per sheet, reassembling 260ms. Moves start from wherever the sheet visibly is, so a new change interrupts cleanly. Ruler end numbers cross-fade from old to new value. Sheet labels hide while sheets move and fade back at the new spot. Sheets removed by an A2 to A3 switch fade out (160ms); added sheets fade in (200ms).
- **Arrivals:** the photo wipes into each sheet row by row, top to bottom, over 600ms total; Sheets list rows rise 6px and fade in (260ms, 40ms stagger), canvas labels follow from 300ms. Changing values (final size) swap with a 180ms 2px-blur cross-fade. The inspector swaps settings for assembly with a 120ms fade out and a 220ms rise-in.
- **Theme:** a circular reveal from the toggle over 450ms.
- **Never animates:** pan and zoom while dragging or with the keyboard, window resizes, focus rings, and the mat scale between steps. Under reduced motion every transition becomes a 120ms colour or opacity fade, press scale and the theme reveal are off, and canvas moves jump.

## Do's and Don'ts

### Do:
- **Do** set every measurement (mm, %, step numbers) in Geist Mono and keep tabular numerals on.
- **Do** keep magenta for the current step, selected sheet, primary action, focus and caret; use the neutral selection colour for other choices.
- **Do** draw new canvas elements in real millimetres at the shared pixels-per-mm scale, on the 10 mm / 50 mm grid.
- **Do** keep the final size visible as one large mono figure with its unit in mute.
- **Do** use the paper lift only for paper on the mat, and hairlines for everything else.
- **Do** use `--ease-in-out` for canvas moves and `--ease-out` for arrivals, and give every animation a reduced-motion opacity fallback.

### Don't:
- **Don't** introduce a blue accent or a second accent colour.
- **Don't** make the magenta brighter or more saturated (no neon); dark text-magenta is `#e06a9d` and fills stay at `#bc4777` or darker under white text.
- **Don't** put shadows on panels, cards or controls.
- **Don't** use radii above 8px on rectangles or round the paper sheets.
- **Don't** let a label or control cover the image on the assembled poster.
- **Don't** animate pan, zoom or resize.
