import React from "react";
import Link from "next/link";

export function Button({
  children,
  className = "",
  type = "button",
  variant = "primary", // primary, secondary, outline, ghost, danger, flat
  size = "md", // sm, md, lg
  isLoading = false,
  isDisabled = false,
  startContent,
  endContent,
  as, // strip HeroUI 'as' prop so it doesn't leak into Next.js Link
  href,
  onClick,
  onPress,
  ...props
}) {
  const handleClick = (e) => {
    if (isDisabled || isLoading) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
    if (onPress) onPress(e);
  };

  const baseStyles =
    "inline-flex items-center justify-center font-bold rounded-2xl cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:opacity-95 focus:ring-violet-500",
    secondary:
      "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 focus:ring-slate-400",
    outline:
      "border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-violet-500",
    ghost:
      "bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-400",
    danger:
      "bg-red-500 text-white shadow-md shadow-red-500/20 hover:bg-red-600 focus:ring-red-500",
    flat:
      "bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/50 focus:ring-violet-500",
  };

  const sizeStyles = {
    sm: "px-3.5 py-2 text-xs gap-1.5",
    md: "px-5 py-3 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5",
  };

  const combinedClasses = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`;

  const content = (
    <>
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        startContent
      )}
      <span>{children}</span>
      {!isLoading && endContent}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses} onClick={handleClick} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={isDisabled || isLoading}
      onClick={handleClick}
      className={combinedClasses}
      {...props}
    >
      {content}
    </button>
  );
}
