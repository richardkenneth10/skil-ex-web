import Button from "../auth/button";

export default function VideoControls({
  isScreenShared,
  onToggleScreenShare,
  isFullScreen,
  onToggleFullScreen,
}: {
  isScreenShared: boolean;
  onToggleScreenShare: () => void;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
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
      </div>
    </div>
  );
}
