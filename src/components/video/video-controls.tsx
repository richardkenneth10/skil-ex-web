import Button from "../auth/button";

export default function VideoControls({
  isScreenShared,
  onToggleScreenShare,
  isFullScreen,
  onToggleFullScreen,
  isVideoMuted,
  onToggleMuteVideo,
  isAudioMuted,
  onToggleMuteAudio,
}: {
  isScreenShared: boolean;
  onToggleScreenShare: () => void;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
  isVideoMuted: boolean;
  onToggleMuteVideo: () => void;
  isAudioMuted: boolean;
  onToggleMuteAudio: () => void;
}) {
  return (
    <div className="absolute flex justify-center w-full">
      <div>
        <Button
          onClick={onToggleScreenShare}
          text={isScreenShared ? "Cancel Sharing" : "Share screen"}
        />
        <Button
          onClick={onToggleFullScreen}
          text={isFullScreen ? "Exit Full Screen" : "Full Screen"}
        />
        <Button
          onClick={onToggleMuteAudio}
          text={isAudioMuted ? "Unmute Audio" : "Mute Audio"}
        />
        <Button
          onClick={onToggleMuteVideo}
          text={isVideoMuted ? "Unmute Video" : "Mute Video"}
        />
      </div>
    </div>
  );
}
