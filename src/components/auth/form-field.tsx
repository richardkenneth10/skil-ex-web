import { HTMLInputTypeAttribute } from "react";

export default function FormField({
  name,
  type,
  placeholder,
  minLength,
  width,
  addedClass,
}: {
  name: string;
  type?: HTMLInputTypeAttribute;
  placeholder: string;
  minLength?: number;
  width?: number | string;
  addedClass?: string;
}) {
  return (
    <input
      className={`border-[#E8E8E8] border-[1px] rounded-md w-60 h-11 px-3 placeholder:text-[#1A4F6E] placeholder:opacity-40 focus:outline-[#E8E8E8] text-[#1A4F6E] font-bold ${addedClass}`}
      style={{ width }}
      name={name}
      type={type}
      placeholder={placeholder}
      minLength={minLength}
      required
    />
  );
}
