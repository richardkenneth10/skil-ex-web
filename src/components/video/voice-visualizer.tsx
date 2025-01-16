import React from "react";

const VoiceVisualizerContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="absolute w-full flex justify-center">{children}</div>;

export default function VoiceVisualizer({ id }: { id: string }) {
  return (
    <VoiceVisualizerContainer>
      <canvas id={`canvas-${id}`} width={100} height={50} />
    </VoiceVisualizerContainer>
  );
}
