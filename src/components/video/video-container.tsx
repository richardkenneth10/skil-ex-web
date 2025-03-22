import React from "react";

export default function VideoContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-[#3a3a3e] relative w-full h-full">{children}</div>;
}
