import { PXMM, tileSource, viewScale, type Layout, type View } from './layout'

export interface Source {
  img: HTMLImageElement
  fit: boolean
  view: View
}

const dims = (img: HTMLImageElement) => ({ w: img.naturalWidth, h: img.naturalHeight })
const toV = (src: Source, L: Layout) => ({ s: viewScale(L, dims(src.img), src.fit, src.view.zoom), ox: src.view.ox, oy: src.view.oy })
const tiles = (L: Layout) => Array.from({ length: L.cols * L.rows }, (_, i) => [i % L.cols, Math.floor(i / L.cols)] as const)
const toBlob = (cv: HTMLCanvasElement) => new Promise<Blob>((res) => cv.toBlob((b) => res(b!), 'image/png'))
const sheetLabel = (L: Layout, c: number, r: number) => `Sheet ${r * L.cols + c + 1} of ${L.cols * L.rows} · row ${r + 1}, col ${c + 1}`

/** Draws tile (c,r) into g with its top-left at (x, y); k = canvas px per mm. Image parts outside the picture stay white. */
function drawTile(g: CanvasRenderingContext2D, src: Source, L: Layout, c: number, r: number, k: number, x = 0, y = 0) {
  const { img } = src
  const { sx, sy, sw, sh } = tileSource(L, c, r, toV(src, L))
  const f = (L.tileW * k) / sw
  const x0 = Math.max(0, sx), y0 = Math.max(0, sy)
  const x1 = Math.min(img.naturalWidth, sx + sw), y1 = Math.min(img.naturalHeight, sy + sh)
  g.fillStyle = '#fff'
  g.fillRect(x, y, L.tileW * k, L.tileH * k)
  if (x1 > x0 && y1 > y0) g.drawImage(img, x0, y0, x1 - x0, y1 - y0, x + (x0 - sx) * f, y + (y0 - sy) * f, (x1 - x0) * f, (y1 - y0) * f)
}

/** One sheet's tile at screen resolution, ppm = CSS px per mm. */
export function drawSheetTile(cv: HTMLCanvasElement, src: Source, L: Layout, c: number, r: number, ppm: number) {
  const k = ppm * (window.devicePixelRatio || 1)
  cv.width = Math.max(1, Math.round(L.tileW * k))
  cv.height = Math.max(1, Math.round(L.tileH * k))
  drawTile(cv.getContext('2d')!, src, L, c, r, k)
}

/** Tile at 300 DPI, one canvas at a time so huge images never hold more than one. */
function renderTile(src: Source, L: Layout, c: number, r: number) {
  const cv = document.createElement('canvas')
  cv.width = Math.round(L.tileW * PXMM)
  cv.height = Math.round(L.tileH * PXMM)
  drawTile(cv.getContext('2d')!, src, L, c, r, cv.width / L.tileW)
  return cv
}

let urls: string[] = []

export async function printSheets(src: Source, L: Layout, m: number) {
  urls.forEach(URL.revokeObjectURL)
  urls = []
  let box = document.getElementById('print')
  if (!box) {
    box = document.createElement('div')
    box.id = 'print'
    document.body.append(box)
  }
  box.textContent = ''
  let style = document.getElementById('pageStyle')
  if (!style) {
    style = document.createElement('style')
    style.id = 'pageStyle'
    document.head.append(style)
  }
  style.textContent = `@page { size: A4 ${L.landscapeSheets ? 'landscape' : 'portrait'}; margin: 0 }`
  const imgs: HTMLImageElement[] = []
  for (const [c, r] of tiles(L)) {
    const url = URL.createObjectURL(await toBlob(renderTile(src, L, c, r)))
    urls.push(url)
    const sheet = document.createElement('div')
    sheet.className = 'sheet'
    sheet.style.width = L.sheetW + 'mm'
    sheet.style.height = L.sheetH + 'mm'
    const img = new Image()
    img.src = url
    imgs.push(img)
    Object.assign(img.style, { left: m + 'mm', top: m + 'mm', width: L.tileW + 'mm', height: L.tileH + 'mm' })
    sheet.append(img)
    if (m >= 4) {
      const t = 0.2, len = 3
      for (const [cx, cy] of [[m, m], [m + L.tileW, m], [m, m + L.tileH], [m + L.tileW, m + L.tileH]]) {
        const left = cx === m, top = cy === m
        for (const [x, y, w, h] of [[left ? cx - len : cx, cy - t / 2, len, t], [cx - t / 2, top ? cy - len : cy, t, len]]) {
          const d = document.createElement('div')
          d.className = 'mark'
          Object.assign(d.style, { left: x + 'mm', top: y + 'mm', width: w + 'mm', height: h + 'mm' })
          sheet.append(d)
        }
      }
      const lab = document.createElement('div')
      lab.className = 'label'
      lab.textContent = sheetLabel(L, c, r)
      lab.style.top = '0.8mm' // margin >= 4mm fits the 2.4mm text
      sheet.append(lab)
    }
    box.append(sheet)
  }
  await Promise.all(imgs.map((i) => i.decode()))
  window.print()
}

export async function downloadSheets(src: Source, L: Layout, m: number) {
  for (const [c, r] of tiles(L)) {
    const cv = document.createElement('canvas')
    cv.width = Math.round(L.sheetW * PXMM)
    cv.height = Math.round(L.sheetH * PXMM)
    const g = cv.getContext('2d')!
    const o = Math.round(m * PXMM), tw = Math.round(L.tileW * PXMM), th = Math.round(L.tileH * PXMM)
    g.fillStyle = '#fff'
    g.fillRect(0, 0, cv.width, cv.height)
    g.drawImage(renderTile(src, L, c, r), o, o)
    if (m >= 4) {
      g.fillStyle = '#000'
      const t = Math.round(0.2 * PXMM), len = Math.round(3 * PXMM)
      for (const [cx, cy] of [[o, o], [o + tw, o], [o, o + th], [o + tw, o + th]]) {
        g.fillRect(cx === o ? cx - len : cx, cy - t / 2, len, t)
        g.fillRect(cx - t / 2, cy === o ? cy - len : cy, t, len)
      }
      g.font = `${2.4 * PXMM}px sans-serif`
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.fillText(sheetLabel(L, c, r), cv.width / 2, 2 * PXMM)
    }
    const a = document.createElement('a')
    a.href = URL.createObjectURL(await toBlob(cv))
    a.download = `sheet-${r * L.cols + c + 1}.png`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 10000)
    await new Promise((res) => setTimeout(res, 300)) // browsers drop back-to-back downloads
  }
}
