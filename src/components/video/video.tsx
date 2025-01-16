import { forwardRef } from "react";

const Video = forwardRef<
  HTMLVideoElement,
  React.VideoHTMLAttributes<HTMLVideoElement>
>((props, ref) => {
  return <video className="h-full w-full" {...props} ref={ref} />;
});

Video.displayName = "Video";

export default Video;

// export default function Video({ ref }: { ref: RefObject<HTMLVideoElement> }) {
//   return <video className="h-full w-full" ref={ref}></video>;
// }
