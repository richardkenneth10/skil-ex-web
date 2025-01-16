export default function Spinner({ className }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
