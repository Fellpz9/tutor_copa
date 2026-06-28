export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}