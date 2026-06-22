# CHRONOS // TYPE-O

A cinematic, scroll-driven landing page for a fictional luxury skeleton-tourbillon
watch — recreated from the reference video. Dark HUD aesthetic, gold/amber + teal
accents, big stat numbers, and scroll-triggered reveals.

## Run it

It's a static site — no build step. Just open it:

```bash
cd chronos
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

| File            | Purpose                                                        |
|-----------------|----------------------------------------------------------------|
| `index.html`    | Markup: hero + 3 spec panels + order/CTA, plus the HUD frame.  |
| `css/style.css` | Full design system, layout, and all keyframe animations.       |
| `js/watch.js`   | Hand-built SVG skeleton tourbillon, injected into the hero.    |
| `js/main.js`    | Scroll progress, nav state, hero parallax, reveals, counters.  |

## Notes

- The watch is a hand-crafted SVG (gold tonneau case, skeleton dial, animated
  tourbillon + hands). To use real product renders instead, drop an image into
  `.watch-wrap` in place of the injected SVG.
- Fully responsive; respects `prefers-reduced-motion`.
- No dependencies beyond Google Fonts (Anton, Archivo, Space Mono).
