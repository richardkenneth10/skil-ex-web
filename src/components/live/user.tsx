import { SignalingUser } from "@/app/interfaces/user/user";
import Image from "next/image";
import React, { HTMLAttributes, Ref } from "react";

export default function User({
  user: {
    user: { name, avatarUrl },
  },
  className,
  onMouseDown,
  style,
  size,
  ref,
  children,
}: {
  user: SignalingUser;
  size?: number | string;
  ref?: Ref<HTMLDivElement>;
  children?: React.ReactNode;
} & Pick<
  HTMLAttributes<HTMLDivElement>,
  "className" | "onMouseDown" | "style"
>) {
  return (
    <div
      className={`absolute bg-[#3a3a3e] flex items-center justify-center ${className}`}
      style={{ ...style, height: size ?? "100%", width: size ?? "100%" }}
      onMouseDown={onMouseDown}
      ref={ref}
    >
      {children}
      <div className="rounded-full h-[60%] aspect-square overflow-hidden bg-pink-700 flex justify-center items-center">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="profile photo"
            height={100}
            width={100}
            className="object-cover h-full w-full"
            onDragStart={(e) => e.preventDefault()}
            objectFit="cover"
          />
        ) : (
          <p className="m-auto text-white font-bold font-mono text-6xl">
            {name.charAt(0)}
          </p>
        )}
      </div>
      <div className="absolute bottom-[calc(((100%-60%)/2)-1.5rem)] left-0 w-full">
        <p className="text-white capitalize font-semibold text-ellipsis text-center whitespace-nowrap overflow-hidden px-4">
          {name}
        </p>
      </div>
    </div>
  );
}
