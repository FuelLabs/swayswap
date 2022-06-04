import * as AC from "@radix-ui/react-accordion";
import cx from "classnames";
import type { FC } from "react";
import { forwardRef } from "react";
import { BiChevronDown } from "react-icons/bi";

type BaseAccordionProps =
  | (AC.AccordionSingleProps & React.RefAttributes<HTMLDivElement>)
  | (AC.AccordionMultipleProps & React.RefAttributes<HTMLDivElement>);

export type AccordionProps = BaseAccordionProps & {
  className?: string;
};

type AccordionComponent = FC<AccordionProps> & {
  Item: typeof AccordionItem;
  Trigger: typeof AccordionTrigger;
  Content: typeof AccordionContent;
};

/**
 * Component implemented based on from Radix's Accordion component.
 * You can check about props on their website.
 * @see https://www.radix-ui.com/docs/primitives/components/accordion
 * @example
 * ```jsx
 * <Accordion type="single" defaultValue="item-1" collapsible>
 *   <Accordion.Item value="item-1">
 *     <Accordion.Trigger>Hello world</Accordion.Trigger>
 *     <Accordion.Content>
 *       Yes. It&apos;s unstyled by default, giving you
 *       <br /> freedom over the look and feel.
 *     </Accordion.Content>
 *   </Accordion.Item>
 *   <Accordion.Item value="item-2">
 *     <Accordion.Trigger>Is it unstyled?</Accordion.Trigger>
 *     <Accordion.Content>
 *       Yes. It&apos;s unstyled by default, giving you
 *       <br /> freedom over the look and feel.
 *     </Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 * ```jsx
 */
export const Accordion: AccordionComponent = ({ className, ...props }) => (
  <AC.Root {...props} className={cx("accordion--root", className)} />
);

export type AccordionItemProps = AC.AccordionItemProps & {
  className?: string;
};

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, ...props }, ref) => (
    <AC.AccordionItem
      {...props}
      ref={ref}
      className={cx("accordion--item", className)}
    />
  )
);

export type AccordionTriggerProps = AC.AccordionTriggerProps & {
  className?: string;
};

export const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ children, className, ...props }, ref) => (
  <AC.AccordionHeader className="accordion--header">
    <AC.AccordionTrigger
      {...props}
      ref={ref}
      className={cx("accordion--trigger", className)}
    >
      {children}
      <BiChevronDown aria-hidden className="accordion--icon" />
    </AC.AccordionTrigger>
  </AC.AccordionHeader>
));

export type AccordionContentProps = AC.AccordionContentProps & {
  className?: string;
};

export const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ children, className, ...props }, ref) => (
  <AC.AccordionContent
    {...props}
    ref={ref}
    className={cx("accordion--content", className)}
  >
    <div>{children}</div>
  </AC.AccordionContent>
));

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;
