import useCalculateVoiceVolume from "@/hooks/use-calculate-voice-volume";
import { useEffect, useState } from "react";
import Video from "./video";
import VideoContainer from "./video-container";
import VoiceVisualizer from "./voice-visualizer";

export default function RemoteVideo(props: {
  id: string;
  //other video props
  [x: string]: unknown;
}) {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  useCalculateVoiceVolume(mediaStream, props.id);

  useEffect(() => {
    const interval = setInterval(() => {
      //if we know its just one remote video always, we can just receive the ref
      const stream = (
        document.getElementById(props.id) as HTMLVideoElement | null
      )?.srcObject;

      if (stream) {
        setMediaStream(stream as MediaStream);
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [props.id]);

  return (
    <VideoContainer>
      <VoiceVisualizer id={props.id} />
      <Video {...props} />
    </VideoContainer>
  );
}
