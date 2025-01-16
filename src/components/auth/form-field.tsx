import { HTMLInputTypeAttribute } from "react";

export default function FormField({
  name,
  type,
  placeholder,
  minLength,
  width,
  addedClass,
  value,
  label,
  required = true,
  disabled = false,
  onChange,
}: {
  name?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  minLength?: number;
  width?: number | string;
  addedClass?: string;
  value?: string | number;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div>
      {label && (
        <label className="text-gray-800 block text-sm mb-1" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        className={`border-[#E8E8E8] border-[1px] rounded-md w-60 h-11 px-3 placeholder:text-[#1A4F6E] placeholder:opacity-40 focus:outline-[#E8E8E8] text-[#1A4F6E] font-bold ${addedClass}`}
        style={{ width }}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        minLength={minLength}
        defaultValue={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}
