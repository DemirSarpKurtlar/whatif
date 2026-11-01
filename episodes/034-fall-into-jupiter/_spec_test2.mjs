import { JP } from "./_jbase_tmp.mjs";
const S = { ...JP, space: 1, pd: 4.5, pdy: 0.0, look: 0.0, orb: 1.3, md: 9, man: 0, lens: 1.4 };
export default { END: 4, captions: [], scenes: [
 { a: 0, b: 1, glsl: "jupiter", p: { ...S, spin: 0 } },
 { a: 1, b: 2, glsl: "jupiter", p: { ...S, spin: 1.5 } },
 { a: 2, b: 3, glsl: "jupiter", p: { ...S, spin: 3 } },
 { a: 3, b: 4, glsl: "jupiter", p: { ...S, spin: 4.5 } },
]};
