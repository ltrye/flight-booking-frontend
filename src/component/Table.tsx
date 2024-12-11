export function SimpleTable({ children }: { children: React.ReactNode }) {
  return <div className="border-t border-gray-200">{children}</div>;
}

export function TableRow({
  keyValue: key,
  value,
  children,
}: {
  keyValue: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{key}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {value}
        {children}
      </dd>
    </div>
  );
}
