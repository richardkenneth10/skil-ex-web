import { ForwardedRef, forwardRef } from "react";
import Video from "./video";
import VideoContainer from "./video-container";
import VoiceVisualizer from "./voice-visualizer";

const LocalVideo = forwardRef<
  HTMLVideoElement,
  React.VideoHTMLAttributes<HTMLVideoElement>
>((props, ref: ForwardedRef<HTMLVideoElement>) => {
  return (
    <VideoContainer>
      <VoiceVisualizer id="local" />
      <Video {...props} ref={ref} />
    </VideoContainer>
  );
});
LocalVideo.displayName = "LocalVideo";

export default LocalVideo;
