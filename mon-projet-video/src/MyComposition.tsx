import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";

const BRAND_GOLD   = "#F1BE0F"; // sampled from logo
const BRAND_VIOLET = "#6A1B9A";

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Timings (240f @ 30fps = 8s) ──────────────────────────────────────────
  const FADE_IN_END     = 18;   // photo fully visible
  const COLOR_POP_END   = 55;   // grayscale → color done
  const PAN_END         = 168;  // pan sweep ends (~5.6s — slow sweep)
  const ZOOMOUT_START   = 155;  // crossfade to zoom-out starts
  const ZOOMOUT_END     = 180;  // zoom-out fully visible
  const FADE_OUT_START  = 183;
  const FADE_OUT_END    = 200;
  const LOGO_START      = 195;
  const BRAND_START     = 207;
  const TAGLINE_START   = 218;

  // ── Grayscale → color ────────────────────────────────────────────────────
  const grayscale = interpolate(frame, [0, FADE_IN_END, COLOR_POP_END], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brightness = interpolate(frame, [0, 10, FADE_IN_END], [1.6, 1.2, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const imageFilter = `grayscale(${grayscale}) brightness(${brightness})`;

  // ── Layer 1 — Pan sweep: objectFit cover, sweeps left → right ────────────
  const panOpacity = interpolate(
    frame,
    [0, FADE_IN_END, ZOOMOUT_START, ZOOMOUT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Sweep from left (0%) to right (100%)
  const panPercent = interpolate(frame, [FADE_IN_END, PAN_END], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Subtle vertical float during pan
  const floatY = Math.sin(frame * 0.045) * 6;

  // ── Layer 2 — Zoom-out: objectFit contain, full team visible ─────────────
  const zoomOutOpacity = interpolate(
    frame,
    [ZOOMOUT_START, ZOOMOUT_END, FADE_OUT_START, FADE_OUT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Slight scale-in as it reveals
  const zoomRevealScale = interpolate(frame, [ZOOMOUT_START, ZOOMOUT_END], [1.04, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── White flash transition ───────────────────────────────────────────────
  const whiteOverlay = interpolate(frame, [FADE_OUT_START, FADE_OUT_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Logo spring pop ──────────────────────────────────────────────────────
  const logoSpring = spring({
    fps,
    frame: Math.max(0, frame - LOGO_START),
    config: { damping: 16, stiffness: 130, mass: 0.7 },
  });
  const logoScale   = interpolate(logoSpring, [0, 1], [0.4, 1]);
  const logoOpacity = interpolate(frame, [LOGO_START, LOGO_START + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Brand name ───────────────────────────────────────────────────────────
  const brandOpacity = interpolate(frame, [BRAND_START, BRAND_START + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineWidth = interpolate(frame, [BRAND_START + 5, BRAND_START + 22], [0, 340], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Tagline slide-in ─────────────────────────────────────────────────────
  const taglineOpacity = interpolate(frame, [TAGLINE_START, TAGLINE_START + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineX = interpolate(frame, [TAGLINE_START, TAGLINE_START + 18], [-50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff", overflow: "hidden" }}>

      {/* ── Layer 1: Pan sweep — portrait-cropped, sweeps left → right ──── */}
      <AbsoluteFill
        style={{ opacity: panOpacity, transform: `translateY(${floatY}px)` }}
      >
        <Img
          src={staticFile("team.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${panPercent}% 30%`,
            filter: imageFilter,
          }}
        />
      </AbsoluteFill>

      {/* ── Layer 2: Zoom-out — full team visible (contain) ─────────────── */}
      <AbsoluteFill
        style={{
          opacity: zoomOutOpacity,
          transform: `scale(${zoomRevealScale})`,
        }}
      >
        <Img
          src={staticFile("team.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center center",
          }}
        />
      </AbsoluteFill>

      {/* ── White transition overlay ─────────────────────────────────────── */}
      <AbsoluteFill
        style={{ backgroundColor: "#ffffff", opacity: whiteOverlay, pointerEvents: "none" }}
      />

      {/* ── End card ─────────────────────────────────────────────────────── */}
      {frame >= LOGO_START && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 36,
            paddingLeft: 60,
            paddingRight: 60,
          }}
        >
          {/* Logo — bigger */}
          <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})` }}>
            <Img
              src={staticFile("logo.jpg")}
              style={{ width: 230, height: 230, objectFit: "contain" }}
            />
          </div>

          {/* GS Global — exact logo gold */}
          <div style={{ opacity: brandOpacity, textAlign: "center" }}>
            <span
              style={{
                fontSize: 68,
                fontWeight: 900,
                color: BRAND_GOLD,
                fontFamily: "Arial Black, Arial, sans-serif",
                letterSpacing: 6,
                textTransform: "uppercase",
              }}
            >
              GS Global
            </span>
          </div>

          {/* Gold separator */}
          <div
            style={{
              width: lineWidth,
              height: 3,
              backgroundColor: BRAND_GOLD,
              opacity: brandOpacity,
              borderRadius: 2,
            }}
          />

          {/* Tagline violet */}
          <div
            style={{
              opacity: taglineOpacity,
              transform: `translateX(${taglineX}px)`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: 38,
                color: BRAND_VIOLET,
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontStyle: "italic",
                letterSpacing: 1,
                lineHeight: 1.4,
              }}
            >
              l'assurance en toute simplicité
            </span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
