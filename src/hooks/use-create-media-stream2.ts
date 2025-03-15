import { RefObject, useEffect, useState } from "react";

export default function useCreateMediaStream2({
  useCamera = false,
  microphoneId,
  cameraId,
}: {
  useCamera?: boolean;
  localVideoRef: RefObject<HTMLVideoElement | null>;
  microphoneId: string | null;
  cameraId: string | null;
}) {
  const [userMediaStream, setUserMediaStream] = useState<MediaStream | null>(
    null
  );
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  const toggleAudioMute = () => {
    setIsAudioMuted((v) => {
      userMediaStream?.getAudioTracks().forEach((t) => (t.enabled = v));
      return !v;
    });
  };
  const toggleVideoMute = () => {
    setIsVideoMuted((v) => {
      userMediaStream?.getVideoTracks().forEach((t) => (t.enabled = v));
      return !v;
    });
  };

  useEffect(() => {
    // const localVideo = localVideoRef.current;

    let isMounted = true; // Prevents setting state if component unmounts early eg. on double render of effect in dev

    const createMediaStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: useCamera && {
          ...(cameraId && { deviceId: { exact: cameraId } }),
          width: { min: 640, ideal: 1920 },
          height: { min: 400, ideal: 1080 },
          aspectRatio: { ideal: 1.7777777778 },
        },
        audio: {
          ...(microphoneId && {
            deviceId: { exact: microphoneId },
          }),
        },
      });

      if (isAudioMuted)
        stream.getAudioTracks().forEach((t) => (t.enabled = false));
      if (isVideoMuted)
        stream.getVideoTracks().forEach((t) => (t.enabled = false));

      return stream;
    };

    let stream: MediaStream | undefined;

    const stopStream = () =>
      stream?.getTracks().forEach((track) => track.stop());

    const init = async () => {
      stream = await createMediaStream();

      if (!isMounted) {
        stopStream();
        return;
      }
      // if (localVideo) localVideo.srcObject = stream;
      setUserMediaStream(stream);
    };

    init();

    return () => {
      isMounted = false;
      if (stream) {
        //alow the other stream to be set and probably other dependent effects to run
        setTimeout(() => {
          stopStream();
        }, 1);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useCamera, microphoneId, cameraId]);

  return {
    userMediaStream,
    isAudioMuted,
    isVideoMuted,
    toggleAudioMute,
    toggleVideoMute,
  };
}
