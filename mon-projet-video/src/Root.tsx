import { Composition } from "remotion";
import { MyComposition } from "./MyComposition";

export const RemotionRoot = () => {
  return (
    <Composition
      id="TeamVideo"
      component={MyComposition}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
