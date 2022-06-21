import cx from "classnames";
import type { ReactNode } from "react";

type TableItemProps = {
  title: ReactNode;
  value: ReactNode;
  className?: string;
};

export const PreviewItem = ({ title, value, className }: TableItemProps) => (
  <div className={cx("flex", className)}>
    <div>{title}</div>
    <div className="flex-auto text-right">{value}</div>
  </div>
);

type PreviewTableProps = {
  title?: ReactNode;
  className?: string;
  children: ReactNode;
};

export const PreviewTable = ({
  title,
  children,
  className,
  ...props
}: PreviewTableProps) => (
  <div className={cx(className)} {...props}>
    {title && <div className="px-2 text-sm text-gray-50 mb-2">{title}</div>}
    <div className="flex flex-col gap-2 px-3 py-3 text-xs sm:text-sm text-gray-100 bg-gray-700 rounded-lg">
      {children}
    </div>
  </div>
);
