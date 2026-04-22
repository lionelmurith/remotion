import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Timings (frames, 30fps, 5s = 150f) ──────────────────────────────────
  const PHOTO_ENTER_END = 28;
  const COLOR_POP_END   = 55;
  const ZOOM_END        = 105;
  const FADE_OUT_START  = 95;
  const FADE_OUT_END    = 118;
  const LOGO_START      = 112;
  const BRAND_START     = 122;
  const TAGLINE_START   = 132;

  // ── Photo: fade-in + slide up ────────────────────────────────────────────
  const photoOpacity = interpolate(
    frame,
    [0, PHOTO_ENTER_END, FADE_OUT_START, FADE_OUT_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const slideY = interpolate(frame, [0, PHOTO_ENTER_END], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Ken-Burns: zoom out 1.25 → 1.0 ──────────────────────────────────────
  const photoScale = interpolate(frame, [0, ZOOM_END], [1.25, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Subtle floating ──────────────────────────────────────────────────────
  const floatY = Math.sin(frame * 0.045) * 7;
  const floatX = Math.sin(frame * 0.028) * 4;

  // ── Grayscale → color reveal ─────────────────────────────────────────────
  const grayscale = interpolate(frame, [PHOTO_ENTER_END, COLOR_POP_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brightness = interpolate(frame, [0, 18, PHOTO_ENTER_END], [1.6, 1.2, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── White flash transition ────────────────────────────────────────────────
  const whiteOverlay = interpolate(frame, [FADE_OUT_START, FADE_OUT_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Logo spring pop ───────────────────────────────────────────────────────
  const logoSpring = spring({
    fps,
    frame: Math.max(0, frame - LOGO_START),
    config: { damping: 16, stiffness: 130, mass: 0.7 },
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.4, 1]);
  const logoOpacity = interpolate(frame, [LOGO_START, LOGO_START + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Brand name ────────────────────────────────────────────────────────────
  const brandOpacity = interpolate(frame, [BRAND_START, BRAND_START + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineWidth = interpolate(frame, [BRAND_START + 5, BRAND_START + 22], [0, 340], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Tagline slide ─────────────────────────────────────────────────────────
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

      {/* ── Team photo ─────────────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          opacity: photoOpacity,
          transform: `translateY(${slideY + floatY}px) translateX(${floatX}px) scale(${photoScale})`,
        }}
      >
        <Img
          src={staticFile("team.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            filter: `grayscale(${grayscale}) brightness(${brightness})`,
          }}
        />
      </AbsoluteFill>

      {/* ── White transition overlay ──────────────────────────────────── */}
      <AbsoluteFill
        style={{ backgroundColor: "#ffffff", opacity: whiteOverlay, pointerEvents: "none" }}
      />

      {/* ── End card ─────────────────────────────────────────────────── */}
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
          {/* Logo */}
          <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})` }}>
            <Img
              src={staticFile("logo.jpg")}
              style={{ width: 160, height: 160, objectFit: "contain" }}
            />
          </div>

          {/* GS Global */}
          <div style={{ opacity: brandOpacity, textAlign: "center" }}>
            <span
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: "#C5A028",
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
              backgroundColor: "#C5A028",
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
                color: "#6A1B9A",
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
