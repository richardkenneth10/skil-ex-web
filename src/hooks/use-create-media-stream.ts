import { RefObject, useEffect, useState } from "react";

export default function useCreateMediaStream({
  localVideoRef,
}: {
  localVideoRef: RefObject<HTMLVideoElement | null>;
}) {
  const [userMediaStream, setUserMediaStream] = useState<MediaStream | null>(
    null
  );

  useEffect(() => {
    const createMediaStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { min: 640, ideal: 1920 },
          height: { min: 400, ideal: 1080 },
          aspectRatio: { ideal: 1.7777777778 },
        },
        audio: true,
      });

      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      setUserMediaStream(stream);
      console.log(localVideoRef.current?.srcObject);
    };

    createMediaStream();
  }, [localVideoRef]);

  return userMediaStream;
}
