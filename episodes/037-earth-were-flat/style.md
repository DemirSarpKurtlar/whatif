# Style notes — "Toy Planet" (Higgsfield Content Factory)
Reference: https://static-public-media.higgsfield.ai/what-if-styles/published/cf3a78be...85b05 (720x1280, 50 s, studied 14 frames).
We reproduce the LOOK only — none of its story, wording or scenes.

## Look
- **Tilt-shift miniature 3D**: everything looks like a hand-made toy / clay diorama. Strong depth-of-field blur at the top and bottom
  of the frame, sharp horizontal band in the middle (classic tilt-shift). Background objects (clouds, houses) are soft blobs.
- **Tiny globe dioramas**: a chunky toy globe floating in a black starfield (soft bokeh star dots), with a little village, roads,
  lollipop trees and houses sitting on top of the planet; oversized puffy white clouds hugging the globe.
- **Materials**: matte, slightly waxy/plasticine, soft rounded bevels on every edge; no hard outlines; gentle specular only on water.
  Water has a white foam lip along coastlines. Soft contact shadows, warm key light + cool fill.
- **Palette (pastel, warm)**: grass #8CCB5E / #A6D46A, sand #F2D49B, water #4FA3E0 → #7FC1EE, cream walls #F4E9D8,
  roofs terracotta #E07A4F / coral #D95B43 / blue #5B8FD9, trunks #9A6B45, clouds pure white with lavender-grey shade,
  character: mustard sweater #F2B33D, red scarf #E8553E, navy trousers. Sky scenes: hazy cream→pale blue (#F3E6CF → #BFD9EE).
  Space scenes: near-black navy with warm bokeh stars.
- **Characters**: chunky chibi toy figure (big round head, short limbs), cute, expressive by pose only.

## Typography / labels
- Captions: heavy rounded-ish bold sans, ALL CAPS, white with a dark outline, 1-2 lines, centred low-middle of frame;
  key word highlighted (yellow box). → our engine's `style: "flat"` captions (Inter Display Black, outlined, yellow hot words,
  red numbers) are the closest match.
- Labels: small white sticker/pill tags taped onto the scene ("EQUATOR", "POLES"), with a little arrow; big numbers with a coloured unit
  pill ("1,670 [km/h]"). → flat HUD pills + big numbers with tag pill.
- Toy 3D arrows (yellow, chunky) to show directions/forces.

## Camera / pacing
- Slow orbits and push-ins around the toy globe; drone-like glides low over the miniature village; occasional fast whip/tumble.
- Cuts every ~2-3 s, each cut adds one new idea/label. Soft crossfades or whip cuts, no harsh flashes (gentle white flash at most).
- Mood: playful, curious, cosy — even disasters look like toys.

## How 037 applies it
- One custom raymarched shader `shaders/toydisc.glsl`: a chunky "cookie" flat-earth disc (grass top, layered soil sides, white ice lip),
  toy houses/lollipop trees, puffy clouds, yellow toy gravity arrows, a chibi walker, translucent air dome, toy sun, and a morph that
  crumples the disc into a round toy globe. Screen-space tilt-shift blur (7-tap golden-spiral DOF in the top/bottom bands).
- Overlays: `style: "flat"` (bold outlined captions, pill HUDs, big numbers).
