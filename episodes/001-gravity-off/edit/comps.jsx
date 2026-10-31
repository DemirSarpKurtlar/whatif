const W = 1080, H = 1920;
export const SERIF = "Liberation Serif", SANS = "Liberation Sans";
const anim = (k, v, dur) => {
  if (typeof v === "number") return null;
  if (Array.isArray(v) && typeof v[0] === "number" && v.length === 2 && !Array.isArray(v[1]))
    return { property: "effectParam", effectIndex: 0, effectParam: k, from: v[0], to: v[1], at: 0, duration: dur, easing: "ease-in-out" };
  return { property: "effectParam", effectIndex: 0, effectParam: k, keyframes: v.map(([at, value, easing]) => ({ at, value, easing: easing || "ease-in-out" })) };
};
const v0 = (v) => (typeof v === "number" ? v : Array.isArray(v[0]) ? v[0][1] : v[0]);
export const Shader = ({ glsl, dur, params }) => {
  const stat = {}; const an = [];
  for (const [k, v] of Object.entries(params)) { stat[k] = v0(v); const a = anim(k, v, dur); if (a) an.push(a); }
  return <rect x={0} y={0} width={W} height={H} fill="#000000" effects={[{ kind: "shader", params: { glsl, ...stat } }]} animate={an} />;
};
const fade = (dur, at = 0, inD = 0.35, outD = 0.25) => {
  const k = [];
  if (at > 0) k.push({ at: 0, value: 0, easing: "hold" });
  k.push({ at: at, value: 0 }, { at: at + inD, value: 1 });
  const hold = Math.max(at + inD + 0.01, dur - outD);
  if (hold < dur - 0.005) k.push({ at: hold, value: 1 });
  k.push({ at: dur, value: 0 });
  return [{ property: "opacity", keyframes: k }];
};
export const Shade = () => <rect x={0} y={0} width={W} height={420} fill={{ kind: "linear", angle: 180, stops: [{ offset: 0, color: "#000000", opacity: 0.45 }, { offset: 1, color: "#000000", opacity: 0 }] }} />;
export const Hud = ({ at = 0, dur, cat, label, value, sub, dot = "#E8473C", vcol = "#FFFFFF" }) => (
  <frame at={at} duration={dur} width={W} height={H} layout="none" animate={fade(dur, 0, 0.3, 0.2)}>
    <rect x={72} y={128} width={14} height={14} radius={7} fill={dot} />
    <text x={98} y={122} width={800} fontFamily={SANS} fontWeight={700} fontSize={25} letterSpacing={2.5} color="#FFFFFFE6" shadow={{ x: 0, y: 2, blur: 8, color: "#00000066" }}>{cat}</text>
    <text x={72} y={168} width={700} fontFamily={SANS} fontWeight={700} fontSize={23} letterSpacing={2} color="#FFFFFFBF" shadow={{ x: 0, y: 2, blur: 8, color: "#00000066" }}>{label}</text>
    {value ? <text x={68} y={196} width={960} fontFamily={SERIF} fontWeight={400} fontSize={96} color={vcol} shadow={{ x: 0, y: 3, blur: 14, color: "#00000080" }}>{value}</text> : null}
    <text x={72} y={310} width={900} fontFamily={SANS} fontWeight={700} fontSize={22} letterSpacing={2} color="#FFFFFFB3" shadow={{ x: 0, y: 2, blur: 8, color: "#00000066" }}>{sub}</text>
  </frame>
);
export const Elapsed = ({ at = 0, dur, from, to, note = "TIME SLOWED" }) => (
  <frame at={at} duration={dur} width={W} height={H} layout="none" animate={fade(dur, 0, 0.2, 0.15)}>
    <text x={700} y={124} width={308} align="right" fontFamily={SANS} fontWeight={700} fontSize={22} letterSpacing={2} color="#FFFFFFBF">ELAPSED</text>
    <frame x={608} y={150} width={400} height={70} layout="none" motion={{ timeline: { duration: dur, easing: "linear", targets: [{ target: "cnt", counter: { from, to, decimals: 1, suffix: " s" } }] } }}>
      <frame name="cnt" x={0} y={0} width={400} height={70} layout="none">
        <text x={0} y={0} width={400} align="right" fontFamily={SERIF} fontSize={54} color="#FFFFFF" shadow={{ x: 0, y: 2, blur: 10, color: "#00000080" }}>0.0 s</text>
      </frame>
    </frame>
    <text x={608} y={226} width={400} align="right" fontFamily={SANS} fontWeight={700} fontSize={20} letterSpacing={2} color="#FFFFFF99">{note}</text>
  </frame>
);
export const Caption = ({ at, dur, text }) => (
  <frame at={at} duration={dur} width={W} height={H} layout="none" animate={fade(dur, 0, 0.18, 0.15)}>
    <rect x={0} y={1190} width={W} height={300} fill={{ kind: "linear", angle: 180, stops: [{ offset: 0, color: "#000000", opacity: 0 }, { offset: 0.5, color: "#000000", opacity: 0.32 }, { offset: 1, color: "#000000", opacity: 0 }] }} />
    <text x={110} y={1262} width={860} align="center" italic={true} fontFamily={SERIF} fontSize={58} lineHeight={1.18} color="#FFFFFF" shadow={{ x: 0, y: 2, blur: 12, color: "#000000A0" }}>{text}</text>
  </frame>
);
export const Flash = ({ at, dur = 0.5, color = "#FFFFFF" }) => (
  <frame at={at} duration={dur} width={W} height={H} layout="none">
    <rect x={0} y={0} width={W} height={H} fill={color} animate={[{ property: "opacity", keyframes: [{ at: 0, value: 0.85 }, { at: dur, value: 0 }] }]} />
  </frame>
);
