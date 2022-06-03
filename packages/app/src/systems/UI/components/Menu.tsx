import { useMenu, useMenuItem } from "@react-aria/menu";
import { mergeProps } from "@react-aria/utils";
import { Item as RootItem } from "@react-stately/collections";
import type { TreeProps, TreeState } from "@react-stately/tree";
import { useTreeState } from "@react-stately/tree";
import type { ItemProps, Node } from "@react-types/shared";
import cx from "classnames";
import type { FC, Key, KeyboardEvent, ReactNode } from "react";
import { useEffect, useRef } from "react";

const style = {
  menu: `rounded-md shadow-sm min-w-[120px] text-gray-300`,
  menuItem: `flex items-center gap-2 px-4 py-2 focus-ring cursor-pointer text-sm first:rounded-tl-md first:rounded-tr-md
  last:rounded-bl-md last:rounded-br-md`,
};

type ListItemProps = {
  item: Node<ReactNode>;
  state: TreeState<ReactNode>;
  onAction?: (key: Key) => void;
  className?: string;
};

function ListItem({ item, state, onAction, className }: ListItemProps) {
  // Get props for the menu item element
  const ref = useRef<HTMLLIElement | null>(null);
  const isDisabled = state.disabledKeys.has(item.key);
  const isFocused = state.selectionManager.focusedKey === item.key;

  const { menuItemProps } = useMenuItem(
    {
      key: item.key,
      isDisabled,
      onAction,
      closeOnSelect: true,
    },
    state,
    ref
  );

  const customProps = {
    onClick: item.props.onPress,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.keyCode === 32 || e.key === "Enter") {
        item.props.onPress?.();
      }
    },
  };

  return (
    <li
      {...mergeProps(customProps, menuItemProps)}
      ref={ref}
      className={cx(style.menuItem, className)}
      data-focused={isFocused}
    >
      {item.rendered}
    </li>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MenuProps = TreeProps<any> & {
  onAction?: (key: Key) => void;
  className?: string;
  focusOnMount?: boolean;
};

type MenuComponent = FC<MenuProps> & {
  Item: typeof Item;
};

export const Menu: MenuComponent = ({
  className,
  onAction,
  focusOnMount,
  ...props
}) => {
  // Create state based on the incoming props
  const state = useTreeState({ ...props, selectionMode: "none" });

  // Get props for the menu element
  const ref = useRef<HTMLUListElement | null>(null);
  const { menuProps } = useMenu(props, state, ref);

  useEffect(() => {
    if (focusOnMount) {
      ref.current?.focus();
    }
  }, []);

  return (
    <ul {...menuProps} ref={ref} className={cx(style.menu, className)}>
      {[...state.collection].map((item) => (
        <ListItem
          className={item.props.className}
          key={item.key}
          item={item}
          state={state}
          onAction={onAction}
        />
      ))}
    </ul>
  );
};

type ItemComponent = FC<
  ItemProps<any> & { className?: string; onPress?: () => void } // eslint-disable-line @typescript-eslint/no-explicit-any
>;
const Item: ItemComponent = RootItem;
Menu.Item = Item;
