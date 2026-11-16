# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + TypeScript + shadcn/ui + Tailwind CSS. Static client-side build, hosted on GitHub Pages from its own public GitHub repository.

## Users

Anyone with an ordinary home or office A4 printer who wants one picture printed larger than A4 (a poster, a map, a child's drawing, a photo) without going to a print shop. They are not print professionals: paper sizes beyond A4, DPI and bleed are unfamiliar terms.

## Product Purpose

Bigprint splits one image into A4 sheets that, once printed and taped together, form a larger poster. The person uploads an image, frames it inside the poster's real proportions, and prints the sheets. Success: the taped poster comes out at the stated size, the sheets line up, and the person never had to understand printer settings beyond "print at actual size".

## Positioning

Everything runs in the browser: the image never leaves the person's device, there is no account, upload or watermark. Sizes are honest: the app states the exact final image size in millimetres, including what the printer's unprintable margin takes away.

## Operating Context

The person uses it on a laptop or desktop next to their printer, then cuts and tapes paper on a table. Print dialogs differ per browser and printer and often scale pages by default; the app must tell people to print at 100% / actual size and to check one sheet with a ruler.

## Capabilities and Constraints

- Poster sizes: A3 (2 A4 sheets: portrait A3 = 2 landscape sheets stacked, landscape A3 = 2 portrait sheets side by side) and A2 (4 A4 sheets, 2×2). Default A2. Four A4 sheets make A2, not A3.
- Portrait or landscape poster.
- Printer margin in mm (default 5, 0–20). Each sheet prints its tile inside this margin; the final image is cols × (210 or 297 − 2m) by rows × (297 or 210 − 2m). Margin 0 gives exact A3/A2 for borderless printers.
- Framing: image starts cover-fit; drag to pan, wheel/slider to zoom (1× to 5× of cover); "fit whole image" contain mode with white fill.
- Output: print (one tile per A4 page via @page, 300 DPI renders, crop marks and sheet label in the margin when margin ≥ 4 mm) and download each sheet as a full-page A4 PNG at 300 DPI.
- Assembly instructions: trim the white margin on inner edges, tape from behind, measure the result.
- Undecided: more poster sizes (A1, A0), Letter paper, overlap/glue strips, PDF export.

## Brand Commitments

Name: Bigprint. Public open-source project.

## Evidence on Hand

A working prototype at `/home/clayton/src/random-stuff/poster-tiler/index.html` (verified print PDFs: 2 pages for A3, 4 for A2). No users, testimonials or usage numbers exist; none may be invented.

## Product Principles

- Honest sizes: always show the real final size in mm, never round to "A2" when the margin shrinks it.
- Private by construction: no network calls with the image, no accounts.
- One path to paper: upload, frame, print. Extra options stay out of the way.
- Plain language for people who only know A4.

## Accessibility & Inclusion

Keyboard-operable framing (arrow keys to pan, +/- to zoom) and labeled controls; WCAG AA contrast.
