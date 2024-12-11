export function InputLabelWrapper({
  label,
  hideLabel,
  htmlFor,
  children,
}: {
  label: string;
  hideLabel?: boolean;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className={`block text-sm font-medium text-gray-900 dark:text-white ${
          !hideLabel && "mb-2"
        }`}
      >
        {hideLabel ?? label}
      </label>
      {children}
    </div>
  );
}
