import cx from "classnames";
import type { IContentLoaderProps } from "react-content-loader";
import ContentLoader from "react-content-loader";

export const SkeletonLoader: React.FC<IContentLoaderProps> = ({
  children,
  ...props
}) => (
  <ContentLoader
    speed={2}
    backgroundColor="#2c3036"
    foregroundColor="#515661"
    className={cx("opacity-40")}
    {...props}
  >
    {children}
  </ContentLoader>
);
