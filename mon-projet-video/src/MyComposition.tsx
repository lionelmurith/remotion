import { AbsoluteFill } from "remotion";

export const MyComposition = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: 80, fontWeight: "bold" }}>Hello, Remotion!</div>
    </AbsoluteFill>
  );
};
