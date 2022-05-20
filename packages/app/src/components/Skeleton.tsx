import type { IContentLoaderProps } from "react-content-loader";
import ContentLoader from "react-content-loader";

const Skeleton = (props: IContentLoaderProps) => (
  <ContentLoader
    speed={2}
    width={410}
    height={300}
    viewBox="0 0 410 300"
    backgroundColor="#17191C"
    foregroundColor="#2D3138"
    className="opacity-30"
    {...props}
  >
    <rect width="82" height="37" rx="10" />
    <rect y="51" width="410" height="85" rx="10" />
    <rect y="150" width="410" height="85" rx="10" />
    <rect y="249" width="410" height="51" rx="10" />
  </ContentLoader>
);

export default Skeleton;
