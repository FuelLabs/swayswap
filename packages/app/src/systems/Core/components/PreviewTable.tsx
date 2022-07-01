import cx from "classnames";
import type { ReactNode } from "react";
import ContentLoader from "react-content-loader";

type TableItemProps = {
  title: ReactNode;
  value: ReactNode;
  className?: string;
  loading?: boolean;
};

const PreviewValueLoading = () => (
  <ContentLoader
    speed={2}
    width={90}
    height={20}
    backgroundColor="#2c3036"
    foregroundColor="#515661"
    className={cx("opacity-40")}
    aria-label="Preview Value Loading"
  >
    <rect y="0" width="90" height="20" rx="3" />
  </ContentLoader>
);

export const PreviewItem = ({
  title,
  value,
  className,
  loading,
}: TableItemProps) => (
  <div className={cx("flex justify-between", className)}>
    <div>{title}</div>
    {loading ? <PreviewValueLoading /> : <div>{value}</div>}
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
    <div className="flex flex-col gap-2 px-3 py-3 text-xs sm:text-sm text-gray-100 bg-gray-700 rounded-xl">
      {children}
    </div>
  </div>
);
