export default function Button({
  text,
  className,
  width,
  color,
  textColor,
  onClick,
}: {
  text: string;
  className?: string;
  width?: string | number;
  color?: string;
  textColor?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="submit"
      className={`font-bold py-2 rounded-md ${className}`}
      style={{
        width: width ?? "15rem",
        backgroundColor: color ?? "#0086CA",
        color: textColor ?? "white",
      }}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
