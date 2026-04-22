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
  const PHOTO_ENTER_END = 28;   // photo fully visible
  const COLOR_POP_END   = 55;   // grayscale → color done
  const ZOOM_END        = 105;  // ken-burns zoom-out done
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

  // ── Ken-Burns: zoom out from 1.25 → 1.0 ─────────────────────────────────
  const photoScale = interpolate(frame, [0, ZOOM_END], [1.25, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Subtle floating (simulates life/movement) ────────────────────────────
  const floatY = Math.sin(frame * 0.045) * 7;
  const floatX = Math.sin(frame * 0.028) * 4;

  // ── Greyscale → color reveal (people "coming to life") ──────────────────
  const grayscale = interpolate(frame, [PHOTO_ENTER_END, COLOR_POP_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const brightness = interpolate(frame, [0, 18, PHOTO_ENTER_END], [1.6, 1.2, 1.0], {
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
  const logoScale = interpolate(logoSpring, [0, 1], [0.4, 1]);
  const logoOpacity = interpolate(frame, [LOGO_START, LOGO_START + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Brand name ───────────────────────────────────────────────────────────
  const brandOpacity = interpolate(frame, [BRAND_START, BRAND_START + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineWidth = interpolate(frame, [BRAND_START + 5, BRAND_START + 22], [0, 420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Tagline slide ────────────────────────────────────────────────────────
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
            filter: `grayscale(${grayscale}) brightness(${brightness})`,
          }}
        />
      </AbsoluteFill>

      {/* ── White transition overlay ────────────────────────────────────── */}
      <AbsoluteFill
        style={{ backgroundColor: "#ffffff", opacity: whiteOverlay, pointerEvents: "none" }}
      />

      {/* ── End card ───────────────────────────────────────────────────── */}
      {frame >= LOGO_START && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
          }}
        >
          {/* Logo */}
          <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})` }}>
            <Img
              src={staticFile("logo.jpg")}
              style={{ width: 190, height: 190, objectFit: "contain" }}
            />
          </div>

          {/* GS Global SA */}
          <div style={{ opacity: brandOpacity, textAlign: "center" }}>
            <span
              style={{
                fontSize: 68,
                fontWeight: 900,
                color: "#C5A028",
                fontFamily: "Arial Black, Arial, sans-serif",
                letterSpacing: 7,
                textTransform: "uppercase",
              }}
            >
              GS Global SA
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

          {/* Tagline */}
          <div
            style={{
              opacity: taglineOpacity,
              transform: `translateX(${taglineX}px)`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: 46,
                color: "#3a3a3a",
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontStyle: "italic",
                letterSpacing: 4,
              }}
            >
              À vos côtés
            </span>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
