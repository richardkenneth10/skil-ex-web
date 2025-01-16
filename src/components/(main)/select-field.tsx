interface SelectProps {
  name: string;
  options: { value: string; label: string; disabled?: boolean }[]; // Array of options
  onChange: (value: string) => void; // Callback when value changes
  value: string; // Controlled value
  placeholder?: string; // Optional placeholder
}

export default function SelectField({
  name,
  value,
  options,
  onChange,
  placeholder,
}: SelectProps) {
  return (
    <select
      className="border-[#E8E8E8] border-[1px] rounded-md w-60 h-11 px-3 focus:outline-[#E8E8E8] text-[#1A4F6E] font-bold"
      name={name}
      id="skills"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {placeholder && (
        <option className="" disabled value="">
          {placeholder}
        </option>
      )}
      {options.map(({ value, label, disabled }) => (
        <option key={value} value={value} disabled={disabled}>
          {label}
        </option>
      ))}
    </select>
  );
}
