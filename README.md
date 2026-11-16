# Bigprint

Bigprint splits one image into A4 sheets. Print them on an ordinary printer, tape them together, and you have an A3 or A2 poster.

Upload a picture, frame it inside the poster's real proportions, then print or download the sheets. The app states the final size in millimetres, including what your printer's unprintable margin takes away.

## Privacy

Everything runs in your browser. The image is never uploaded, there is no account and no watermark.

## Run

```sh
npm install
npm run dev      # local dev server
npm test         # layout tests (Vitest)
npm run lint
npm run build    # static site in dist/
```

## Deploy

`.github/workflows/pages.yml` builds the site and publishes `dist` to GitHub Pages on every push to `main`. In the repository settings, set Pages > Source to "GitHub Actions". The build uses relative asset paths (`base: './'`), so it works under a sub-path such as `https://<user>.github.io/bigprint/`.

## Printing

Choose "Actual size" or 100% in the print dialog and set margins to None. Check one sheet with a ruler before taping.

## License

[MIT](LICENSE)
