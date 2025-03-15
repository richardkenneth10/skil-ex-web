import { forwardRef } from "react";

const Audio = forwardRef<
  HTMLAudioElement,
  React.AudioHTMLAttributes<HTMLAudioElement>
>((props, ref) => {
  return <audio className="h-full w-full" {...props} ref={ref} />;
});

Audio.displayName = "Audio";

export default Audio;
