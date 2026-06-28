const buttonVariants = {
  primary: "px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white",
  secondary: "px-3 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white",
  ghost: "text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const baseStyles = "rounded-lg transition-colors font-medium";
  const variantStyles = buttonVariants[variant] || buttonVariants.primary;

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
