import Image from "next/image";

export default function Avatar({
  url,
  size,
  className,
}: {
  url?: string | null;
  size: string | number;
  className?: string;
}) {
  return (
    <Image
      className={`bg-cover rounded-full ${className}`}
      style={{ height: size, width: size }}
      src={url ?? "/icons/profile.svg"}
      alt="profile photo"
      width={100}
      height={100}
    />
  );
}
