import cx from "classnames";
import type { FC, ReactNode } from "react";
import { Children } from "react";

const style = {
  divider: `border border-gray-700 border-b-0`,
  content: `bg-gray-800 min-w-[400px] rounded-xl py-3`,
  titleWrapper: `px-5 flex justify-between text-xl`,
  title: `flex items-center`,
};

export type CardProps = {
  children: ReactNode;
  className?: string;
  withWrapper?: boolean;
};

export type CardTitleProps = {
  children: ReactNode;
  elementRight?: ReactNode;
};

type CardComponent = FC<CardProps> & {
  Title: FC<CardTitleProps>;
};

export const Card: CardComponent = ({ className, children }) => {
  const title = Children.toArray(children)?.find(
    (child: any) => child.type?.id === "CardTitle" // eslint-disable-line @typescript-eslint/no-explicit-any
  );
  const customChildren = Children.toArray(children)?.filter(
    (child: any) => child.type?.id !== "CardTitle" // eslint-disable-line @typescript-eslint/no-explicit-any
  );

  return (
    <div className={cx(className, style.content, { "py-8": !title })}>
      {title}
      {title && <div className={cx(style.divider, "my-3")} />}
      <div className="px-5 pb-2">{customChildren}</div>
    </div>
  );
};

const CardTitle: FC<CardTitleProps> & { id: string } = ({
  children,
  elementRight,
}) => (
  <div className={style.titleWrapper}>
    <h2 className="flex items-center gap-2">{children}</h2>
    {elementRight}
  </div>
);

CardTitle.id = "CardTitle";
Card.Title = CardTitle;
