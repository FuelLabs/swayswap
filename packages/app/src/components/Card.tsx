import cx from "classnames";
import type { FC, ReactNode } from "react";
import { Children } from "react";

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
    <div className={cx(className, "card", { "py-8": !title })}>
      {title}
      {title && <div className={cx("card--divider", "my-3")} />}
      <div className="px-5 pb-2">{customChildren}</div>
    </div>
  );
};

const CardTitle: FC<CardTitleProps> & { id: string } = ({
  children,
  elementRight,
}) => (
  <div className="card--title">
    <h2>{children}</h2>
    {elementRight}
  </div>
);

CardTitle.id = "CardTitle";
Card.Title = CardTitle;
