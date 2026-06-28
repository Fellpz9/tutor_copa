export default function ProgressBar({ progress, isComplete, className = "" }) {
  const bgColor = isComplete ? "bg-success" : "bg-info";

  return (
    <div className={`w-full bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full ${bgColor} transition-all duration-300`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
