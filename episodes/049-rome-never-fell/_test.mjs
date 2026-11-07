const names = ["rome","fall","crowd","roads","aqueduct","pantheon","gears","steam","ruins","train","crumble","nova"];
const P = { rome: { seal: 1 }, fall: { crack: [[0,0],[0.8,1]], fall: [[0,0],[1,0],[2.4,1]] }, crowd: { fill: [[0,0],[2,1]], gold: [[0,0],[1.8,0],[2.6,1]] }, roads: { draw: [[0,0],[2.6,1]], zoom:[1.0,1.08] },
  aqueduct: {}, pantheon: { beam: 1, sphere: [[0,0],[1,0],[2.4,1]] }, gears: { open: [[0,0],[1.6,1]], ecl: [[0,0],[1.6,0],[2.8,1]] }, steam: { spin: 4 }, ruins: { fade: [[0,0],[2.5,1]] }, train: {}, crumble: { crumble: [[0,0],[2.8,1]] }, nova: {} };
export default { END: 36, bg: "#141312", accent: "#F2D68A", xf: 0.3, hook: false,
  scenes: names.map((n, i) => ({ a: i * 3, b: i * 3 + 3, draw: n, p: P[n] })),
  captions: names.map((n, i) => [i * 3 + 0.2, i * 3 + 2.8, "Sample caption text for " + n + " here"]),
};
