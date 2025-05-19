import { ButtonHTMLAttributes, Ref } from "react";
import { IconType } from "react-icons";

export default function ControlButton({
  type,
  selected,
  icon: Icon,
  mobileIcon: MobileIcon,
  ref,
  onClick,
  className,
}: {
  type: "device" | "other" | "exit";
  selected: boolean;
  icon: IconType;
  mobileIcon?: IconType;
  ref?: Ref<HTMLButtonElement>;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "className">) {
  return (
    <button
      onClick={onClick}
      ref={ref}
      className={`rounded-full w-[10.8vw] md:w-[5.4vw] aspect-square ${
        !selected
          ? type === "exit"
            ? "bg-red-700 hover:bg-red-600"
            : "bg-gray-500 hover:bg-gray-400"
          : `${
              type === "device"
                ? "bg-red-700 hover:bg-red-600"
                : type === "exit"
                ? "bg-gray-300"
                : "bg-blue-400 hover:bg-blue-300"
            }`
      } ${className}`}
    >
      <div>
        <Icon
          className={`h-full w-full p-2 md:p-3 rounded-full ${
            MobileIcon ? "hidden md:block" : ""
          }`}
          color="white"
        />
        {MobileIcon && (
          <MobileIcon
            className={`h-full w-full p-2 md:p-3 rounded-full md:hidden`}
            color="white"
          />
        )}
      </div>
    </button>
  );
}
