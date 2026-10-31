import { readFileSync } from "node:fs";
import { Shader, Hud, Elapsed, Caption, Flash, Shade, SERIF, SANS } from "./comps.jsx";
const read = (f) => readFileSync(new URL(f, import.meta.url), "utf8");
const LIB = read("./lib.glsl");
const PARK = LIB + read("./park.glsl"), EARTH = LIB + read("./earth.glsl"), SKY = LIB + read("./sky.glsl");
const W = 1080, H = 1920, END = 60.7;
const PK = { cam: 0, lift: 0, float: 0, rise: 0, shake: 0, panx: 0, tilt: 0 };
const EA = { dist: 5.6, orb: 0.3, camy: 0, tx: 0, ty: 0, spin: 0, leak: 0, quake: 0, shake: 0, sun: 0.6, diag: 0 };
const el = (t) => { const P = [[9.3, 0], [22.6, 3], [31.3, 5], [38.9, 7], [42.2, 8], [48.46, 10]];
  if (t <= P[0][0]) return 0; for (let i = 1; i < P.length; i++) if (t <= P[i][0]) { const [a, x] = P[i - 1], [b, y] = P[i]; return x + (y - x) * (t - a) / (b - a); } return 10; };
const SC = [
  { a: 0, b: 3.55, g: PARK, p: { ...PK, cam: [0, 0.45], tilt: [1.6, 1.2] } },
  { a: 3.55, b: 8.45, g: PARK, p: { ...PK, cam: [0.45, 1.2] }, hud: { cat: "A NORMAL NOON", label: "GRAVITY", value: "9.81 m/s²", sub: "PULLING YOU DOWN · LIKE ALWAYS", dot: "#4FD1A5" } },
  { a: 8.45, b: 12.6, g: PARK, p: { ...PK, cam: [1.2, 1.5], rise: [[0, 0], [0.85, 0], [4.15, 0.04]] }, hud: { at: 0.85, cat: "SWITCHED OFF", label: "GRAVITY", value: "0.00 m/s²", sub: "NOTHING PULLS YOU DOWN", vcol: "#FF6B5E" } },
  { a: 12.6, b: 17.0, g: EARTH, p: { ...EA, spin: [0, 0.5], orb: [0.2, 0.35] }, hud: { cat: "BUT YOU'RE STILL MOVING", label: "YOUR SPEED", value: "1,266 km/h", sub: "SPINNING WITH THE EARTH" } },
  { a: 17.0, b: 22.45, g: EARTH, p: { ...EA, dist: [5.6, 3.2], ty: [0, 0.75], tx: [0, -0.2], spin: [0.5, 0.7], orb: [0.35, 0.3], diag: [[0, 0], [0.6, 0], [3.5, 1]] }, hud: { cat: "NOTHING BENDS YOUR PATH", label: "YOU MOVE IN A", value: "Straight line", sub: "THE GROUND CURVES AWAY BENEATH YOU" } },
  { a: 22.45, b: 25.75, g: PARK, p: { ...PK, cam: [0.9, 1.2], lift: [0.08, 0.2], rise: [0.06, 0.16], tilt: [0, -0.1] }, hud: { cat: "3 SECONDS IN", label: "YOUR FEET", value: "+12 cm", sub: "OFF THE GRASS · STILL RISING" } },
  { a: 25.75, b: 31.25, g: PARK, p: { ...PK, cam: [1.5, 1.8], panx: [1.9, 2.1], tilt: [-0.35, -0.1], lift: [0.2, 0.32], rise: 0.2, float: [[0, 0], [0.5, 0], [4.8, 1]] }, hud: { cat: "THE FOUNTAIN", label: "ITS WATER", value: "Floating", sub: "SURFACE TENSION PULLS IT INTO BALLS", dot: "#5CB8F0" } },
  { a: 31.25, b: 38.95, g: SKY, p: { fly: [0, 1], climb: [[0, 0], [4.55, 0], [7.4, 1]] }, hud: { cat: "EVERY PLANE IN THE SKY", label: "ALTITUDE GAINED", value: null, sub: "STILL MAKING LIFT · NO WEIGHT" } },
  { a: 38.95, b: 42.2, g: EARTH, p: { ...EA, dist: [4.6, 4.2], spin: [0.9, 1.05], leak: [0.0, 0.9] }, hud: { cat: "HIGH ABOVE", label: "THE ATMOSPHERE", value: "Leaking", sub: "INTO SPACE", dot: "#5CB8F0" } },
  { a: 42.2, b: 48.4, g: EARTH, p: { ...EA, dist: [4.2, 3.7], spin: [1.05, 1.25], leak: 0.9, quake: [[0, 0], [1.3, 0], [2.5, 1]], shake: [[0, 0], [1.3, 0], [3.5, 0.5], [6.2, 0.9]] }, hud: { cat: "DEEP BELOW", label: "EARTHQUAKES", value: "Everywhere", sub: "THE CRUSHED ROCK PUSHES BACK" } },
  { a: 48.4, b: 53.35, g: PARK, p: { ...PK, cam: [1.0, 1.2], lift: [[0, 1.0], [1.26, 1.0], [1.72, 0, "ease-in"], [4.95, 0]], rise: [[0, 1.3], [1.26, 1.3], [1.72, 0, "ease-in"], [4.95, 0]], tilt: [[0, -0.5], [1.26, -0.5], [1.72, 0]], shake: [[0, 0], [1.7, 0], [1.75, 1.0], [2.4, 0]] } },
  { a: 53.35, b: 56.45, g: EARTH, p: { ...EA, dist: [7.5, 8.5], orb: [0.9, 1.0], spin: [1.4, 1.5], sun: 1.6, tx: [-0.6, -0.8] }, hud: { cat: "AND EARTH?", label: "ITS ORBIT SHIFTED", value: "30 cm", sub: "OUT OF A 940 MILLION KM LOOP", dot: "#F2C14E" } },
];
const CAP = [
  [3.66, 5.3, "It's noon in a city park."], [5.44, 8.3, "Gravity is pulling you down, like always."],
  [8.54, 10.1, "Then... it's gone."], [10.3, 12.5, "Nothing flies away. Not yet."],
  [12.72, 14.25, "You're still spinning with the Earth"], [14.28, 16.9, "at almost 1,300 km/h."],
  [17.04, 19.0, "But now nothing bends your path,"], [19.1, 22.3, "so the ground slowly curves away beneath you."],
  [22.6, 25.7, "Three seconds in, your feet leave the grass."], [25.86, 27.1, "The fountain stops falling."],
  [27.18, 31.1, "Its water pulls itself into wobbling, floating balls."], [31.34, 33.8, "Every plane in the sky is still making lift,"],
  [33.94, 35.7, "with nothing holding it down."], [35.82, 38.9, "In 10 seconds, they shoot half a kilometre up."],
  [39.12, 42.1, "High above, the air starts leaking into space."], [42.28, 45.8, "Deep below, the crushed rock of the planet pushes back."],
  [46.0, 48.3, "Earthquakes, everywhere at once."], [48.46, 49.3, "Ten."], [49.4, 50.85, "Gravity snaps back."],
  [50.98, 53.3, "You drop about a metre. You'll be fine."], [53.46, 54.25, "And Earth?"], [54.3, 56.4, "It drifted 30 cm off its orbit."],
];
export default async ({ project }) => {
  const p = await project({ dir: ".", size: "1080x1920", fps: 30, background: "#05060A" });
  for (const f of ["LiberationSerif-Regular.ttf", "LiberationSerif-Italic.ttf", "LiberationSans-Bold.ttf"]) await p.add("/usr/share/fonts/truetype/liberation/" + f);
  const voice = await p.add("../voice.mp3");
  const scenes = SC.map((s) => {
    const dur = +(s.b - s.a).toFixed(3);
    const h = s.hud;
    const showEl = s.a >= 8.45 && s.a < 48.4;
    return (
      <frame at={s.a} duration={dur} width={W} height={H} layout="none">
        <Shader glsl={s.g} dur={dur} params={s.p} />
        {h || showEl ? <Shade /> : null}
        {h && h.value !== null ? <Hud at={h.at || 0} dur={dur - (h.at || 0)} {...h} /> : null}
        {h && h.value === null ? (
          <frame at={0} duration={dur} width={W} height={H} layout="none">
            <Hud at={0} dur={dur} {...h} value="" />
            <frame x={68} y={196} width={700} height={110} layout="none" motion={{ timeline: { at: 4.55, duration: 2.6, easing: "ease-in", targets: [{ target: "alt", counter: { from: 0, to: 490, decimals: 0, prefix: "+", suffix: " m" } }] } }}>
              <frame name="alt" x={0} y={0} width={700} height={110} layout="none">
                <text x={0} y={0} width={700} fontFamily={SERIF} fontSize={96} color="#FFFFFF" shadow={{ x: 0, y: 3, blur: 14, color: "#00000080" }}>+0 m</text>
              </frame>
            </frame>
          </frame>) : null}
        {showEl ? <Elapsed at={s.a < 9.3 ? 9.3 - s.a : 0} dur={s.a < 9.3 ? dur - (9.3 - s.a) : dur} from={+el(Math.max(s.a, 9.3)).toFixed(2)} to={+el(s.b).toFixed(2)} note="TIME SLOWED ~4×" /> : null}
      </frame>
    );
  });
  const title = (
    <frame at={0} duration={3.55} width={W} height={H} layout="none" animate={[{ property: "opacity", keyframes: [{ at: 0, value: 1 }, { at: 3.3, value: 1 }, { at: 3.55, value: 0 }] }]}>
      <text x={50} y={330} width={980} align="center" fontFamily={SERIF} fontSize={90} lineHeight={1.12} color="#FFFFFF" shadow={{ x: 0, y: 4, blur: 18, color: "#00000070" }}>What if gravity switched off for 10 seconds?</text>
    </frame>
  );
  const ten = (
    <frame at={48.4} duration={1.25} width={W} height={H} layout="none" animate={[{ property: "opacity", keyframes: [{ at: 0, value: 0 }, { at: 0.08, value: 1 }, { at: 1.0, value: 1 }, { at: 1.25, value: 0 }] }]}>
      <rect x={0} y={0} width={W} height={H} fill="#00000059" />
      <text x={0} y={700} width={W} align="center" fontFamily={SERIF} fontSize={260} color="#FFFFFF" shadow={{ x: 0, y: 6, blur: 30, color: "#000000A0" }}>10.0 s</text>
    </frame>
  );
  const back = [
    <Hud at={49.66} dur={51.0 - 49.66} cat="GRAVITY SNAPS BACK" label="GRAVITY" value="9.81 m/s²" sub="EVERYTHING FALLS AT ONCE" dot="#4FD1A5" />,
    <Hud at={51.0} dur={53.35 - 51.0} cat="YOU LAND" label="YOU FALL" value="1.3 m" sub="LIKE STEPPING OFF A CHAIR · YOU'LL BE FINE" dot="#4FD1A5" />,
  ];
  const endCard = (
    <frame at={56.45} duration={END - 56.45} width={W} height={H} layout="none" animate={[{ property: "opacity", from: 0, to: 1, at: 0, duration: 0.4 }]}>
      <rect x={0} y={0} width={W} height={H} fill="#05060A" />
      <text x={110} y={700} width={860} align="center" fontFamily={SERIF} fontSize={74} lineHeight={1.15} color="#FFFFFF">What if gravity switched off for 10 seconds?</text>
      <text x={140} y={1000} width={800} align="center" fontFamily={SANS} fontWeight={700} fontSize={24} letterSpacing={2.5} lineHeight={1.5} color="#FFFFFFA6">{"SIMPLIFIED PHYSICS · FOR FUN\nASSUMES NEW YORK'S LATITUDE"}</text>
      <text x={140} y={1150} width={800} align="center" fontFamily={SANS} fontWeight={700} fontSize={34} letterSpacing={2.5} color="#FFFFFF">WHERE WOULD YOU BE STANDING?</text>
      <text x={140} y={1215} width={800} align="center" fontFamily={SANS} fontWeight={700} fontSize={22} letterSpacing={2.5} color="#FFFFFF80">FOLLOW FOR MORE WHAT IFS</text>
    </frame>
  );
  p.compose(
    <frame width={W} height={H} layout="none">
      {scenes}
      {title}
      {back}
      {CAP.map(([a, b, t]) => <Caption at={a} dur={+(b - a).toFixed(3)} text={t} />)}
      {ten}
      <Flash at={9.3} dur={0.45} />
      <Flash at={49.66} dur={0.3} />
      {endCard}
    </frame>,
    { at: 0, dur: END }
  );
  p.cut(voice, { at: 0 });
};
