import { IMiniUser } from "@/app/interfaces/user/user";
import { useEffect, useRef, useState } from "react";
import User from "./user";

export default function DraggableUser({
  children,
  user,
}: {
  children?: React.ReactNode;
  user: IMiniUser;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    };

    const handleMouseUp = () => setDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    setDragging(true);
  };

  return (
    <div>
      {children}
      <User
        user={user}
        onMouseDown={handleMouseDown}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        className={`rounded-3xl z-10 ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        size="15vw"
        ref={ref}
      />
    </div>

    // <div
    //   className={`absolute bg-[#3a3a3e] flex items-center justify-center z-10 rounded-3xl  ${`${
    //     dragging ? "cursor-grabbing" : "cursor-grab"
    //   }`}`}
    //   ref={ref}
    //   onMouseDown={handleMouseDown}
    //   style={{
    //     left: `${position.x}px`,
    //     top: `${position.y}px`,
    //   }}
    // >
    //   <div className="rounded-full h-[60%] aspect-square overflow-hidden bg-pink-700 flex justify-center items-center">
    //     {avatarUrl ? (
    //       <Image
    //         src={avatarUrl}
    //         alt="profile photo"
    //         height={100}
    //         width={100}
    //         className="object-cover h-full w-full"
    //         onDragStart={(e) => e.preventDefault()}
    //         objectFit="cover"
    //       />
    //     ) : (
    //       <p className="m-auto text-white font-bold font-mono text-6xl">
    //         {name.charAt(0)}
    //       </p>
    //     )}
    //   </div>
    //   <div className="absolute bottom-[calc(((100%-60%)/2)-1.5rem)] left-0 w-full">
    //     <p className="text-white capitalize font-semibold text-ellipsis text-center whitespace-nowrap overflow-hidden px-4">
    //       {name}
    //     </p>
    //   </div>
    // </div>
  );
}
