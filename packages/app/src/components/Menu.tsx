import { useMenu, useMenuItem } from "@react-aria/menu";
import { Item } from "@react-stately/collections";
import type { TreeProps, TreeState } from "@react-stately/tree";
import { useTreeState } from "@react-stately/tree";
import type { ItemProps, Node } from "@react-types/shared";
import type { FC, Key } from "react";
import { useEffect, useRef } from "react";

type ListItemProps = {
  item: Node<any>;
  state: TreeState<any>;
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
    },
    state,
    ref
  );

  return (
    <li
      {...menuItemProps}
      ref={ref}
      className={className}
      data-focused={isFocused}
    >
      {item.rendered}
    </li>
  );
}

export type MenuProps = TreeProps<any> & {
  onAction?: (key: Key) => void;
  className?: string;
  focusOnMount?: boolean;
};

type MenuComponent = FC<MenuProps> & {
  Item: typeof CustomItem;
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
    <ul {...menuProps} ref={ref} className={className}>
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

type CustomItemComponent = FC<ItemProps<any> & { className?: string }>;
const CustomItem = Item as CustomItemComponent;
Menu.Item = CustomItem;
