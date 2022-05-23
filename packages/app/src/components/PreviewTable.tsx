import type { ReactNode } from "react";

type TableItemProps = {
  title: ReactNode;
  value: ReactNode;
};

export const PreviewItem = ({ title, value }: TableItemProps) => (
  <div className="flex">
    <div>{title}</div>
    <div className="flex-auto text-right">{value}</div>
  </div>
);

type PreviewTableProps = {
  title: ReactNode;
  children: ReactNode;
  className?: string;
};

export const PreviewTable = ({
  title,
  children,
  className,
}: PreviewTableProps) => (
  <div className={className}>
    <div className="px-2 text-sm text-gray-50 mb-2">{title}</div>
    <div className="flex flex-col gap-3 p-4 text-sm text-gray-100 bg-gray-700 rounded-xl">
      {children}
    </div>
  </div>
);
