import classNames from "classnames";
import { Children, FC, ReactNode } from "react";

const style = {
  divider: `border border-gray-700 border-b-0`,
  wrapper: `w-screen flex flex-1 items-center justify-center pb-14`,
  content: `bg-gray-800 w-[30rem] rounded-2xl py-4 m-2`,
  titleWrapper: `px-5 flex justify-between text-xl`,
  title: `flex items-center`,
};

export type PageContentProps = {
  children: ReactNode;
};

export type PageTitleProps = {
  children: ReactNode;
  elementRight?: ReactNode;
};

type PageContentComponent = FC<PageContentProps> & {
  Title: FC<PageTitleProps>;
};

export const PageContent: PageContentComponent = ({ children }) => {
  const title = Children.toArray(children)?.find(
    (child: any) => child.type?.id === "PageTitle"
  );
  const customChildren = Children.toArray(children)?.filter(
    (child: any) => child.type?.id !== "PageTitle"
  );
  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        {title}
        <div className={classNames(style.divider, "my-4")} />
        <div className="px-5 pb-2">{customChildren}</div>
      </div>
    </div>
  );
};

const PageTitle: FC<PageTitleProps> & { id: string } = ({
  children,
  elementRight,
}) => {
  return (
    <div className={style.titleWrapper}>
      <h2 className="flex items-center gap-2">{children}</h2>
      {elementRight}
    </div>
  );
};
PageTitle.id = "PageTitle";

PageContent.Title = PageTitle;
