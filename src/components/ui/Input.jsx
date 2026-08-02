import React from "react";

export function Input({
  label,
  startContent,
  endContent,
  classNames = {},
  className = "",
  onValueChange,
  onChange,
  onKeyDown,
  variant,
  radius,
  ...props
}) {
  const handleChange = (e) => {
    if (onChange) onChange(e);
    if (onValueChange) onValueChange(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (onKeyDown) onKeyDown(e);

    // If Enter key is pressed inside an input field, trigger parent form submission
    if (e.key === "Enter" && !e.defaultPrevented) {
      const form = e.target.form;
      if (form) {
        if (typeof form.requestSubmit === "function") {
          form.requestSubmit();
        } else {
          form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className={`text-xs font-semibold text-slate-700 dark:text-slate-300 ${classNames.label || ""}`}>
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {startContent && (
          <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none text-slate-400">
            {startContent}
          </div>
        )}
        <input
          {...props}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={`w-full text-sm py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all ${
            startContent ? "pl-10" : "px-3.5"
          } ${endContent ? "pr-10" : "pr-3.5"} ${classNames.input || ""} ${className}`}
        />
        {endContent && (
          <div className="absolute right-3.5 inset-y-0 flex items-center text-slate-400">
            {endContent}
          </div>
        )}
      </div>
    </div>
  );
}

export function TextArea({
  label,
  startContent,
  endContent,
  classNames = {},
  className = "",
  onValueChange,
  onChange,
  minRows,
  variant,
  radius,
  ...props
}) {
  const handleChange = (e) => {
    if (onChange) onChange(e);
    if (onValueChange) onValueChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className={`text-xs font-semibold text-slate-700 dark:text-slate-300 ${classNames.label || ""}`}>
          {label}
        </label>
      )}
      <div className="relative flex w-full">
        {startContent && (
          <div className="absolute left-3.5 top-3.5 flex items-start pointer-events-none text-slate-400">
            {startContent}
          </div>
        )}
        <textarea
          {...props}
          rows={minRows || 3}
          onChange={handleChange}
          className={`w-full text-sm py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all ${
            startContent ? "pl-10 pr-3.5" : "px-3.5"
          } ${classNames.input || ""} ${className}`}
        />
      </div>
    </div>
  );
}
