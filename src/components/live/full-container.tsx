import React from "react";

export default function FullContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="absolute top-0 left-0 h-full w-full">{children}</div>;
}
