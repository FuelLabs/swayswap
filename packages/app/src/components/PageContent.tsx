import cx from "classnames";
import type { FC, ReactNode } from "react";
import { Children } from "react";

const style = {
  divider: `border border-gray-700 border-b-0`,
  wrapper: `w-screen flex flex-1 items-center justify-center pb-14`,
  content: `bg-gray-800 min-w-[400px] rounded-2xl py-3 m-2`,
  titleWrapper: `px-5 flex justify-between text-xl`,
  title: `flex items-center`,
};

export type PageContentProps = {
  children: ReactNode;
  className?: string;
};

export type PageTitleProps = {
  children: ReactNode;
  elementRight?: ReactNode;
};

type PageContentComponent = FC<PageContentProps> & {
  Title: FC<PageTitleProps>;
};

export const PageContent: PageContentComponent = ({ className, children }) => {
  const title = Children.toArray(children)?.find(
    (child: any) => child.type?.id === "PageTitle"
  );
  const customChildren = Children.toArray(children)?.filter(
    (child: any) => child.type?.id !== "PageTitle"
  );
  return (
    <div className={style.wrapper}>
      <div className={cx(className, style.content)}>
        {title}
        <div className={cx(style.divider, "my-3")} />
        <div className="px-5 pb-2">{customChildren}</div>
      </div>
    </div>
  );
};

const PageTitle: FC<PageTitleProps> & { id: string } = ({
  children,
  elementRight,
}) => (
  <div className={style.titleWrapper}>
    <h2 className="flex items-center gap-2">{children}</h2>
    {elementRight}
  </div>
);
PageTitle.id = "PageTitle";

PageContent.Title = PageTitle;
