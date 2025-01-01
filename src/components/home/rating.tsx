import { FaRegStar, FaStar } from "react-icons/fa";

export default function Rating({ value }: { value: number }) {
  return (
    <div className="flex mx-3">
      {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
        <div key={i}>
          {i <= value ? (
            <FaStar color="#0086CA" />
          ) : (
            <FaRegStar color="#0086CA" />
          )}
        </div>
      ))}
    </div>
  );
}
