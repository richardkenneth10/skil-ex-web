import useCalculateVoiceVolume from "@/hooks/use-calculate-voice-volume";
import { useEffect, useState } from "react";
import Audio from "./audio";
import AudioContainer from "./audio-container";
import VoiceVisualizer from "./voice-visualizer";

export default function RemoteAudio(
  props: {
    id: string;
  } & React.AudioHTMLAttributes<HTMLAudioElement>
) {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  useCalculateVoiceVolume(mediaStream, props.id);

  useEffect(() => {
    const interval = setInterval(() => {
      //if we know its just one remote video always, we can just receive the ref
      const stream = (
        document.getElementById(props.id) as HTMLAudioElement | null
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
    <AudioContainer>
      <VoiceVisualizer id={props.id} />
      <Audio {...props} />
    </AudioContainer>
  );
}
