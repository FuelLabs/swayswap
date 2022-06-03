import { useSelector } from "@xstate/react";
import cx from "classnames";
import { motion } from "framer-motion";

import { useWelcomeSteps, stepsSelectors } from "../hooks";

type SidebarItemProps = {
  id: number;
  label: string;
};

export function WelcomeNavItem({ id, label }: SidebarItemProps) {
  const { service } = useWelcomeSteps();
  const current = useSelector(service, stepsSelectors.current);
  const isActive = id === current?.id;
  const isDone = id < current?.id;
  const isDisabled = id > current?.id;

  return (
    <div
      aria-label={label}
      aria-disabled={isDisabled}
      className={cx("welcomeNavItem", {
        done: isDone,
        active: isActive,
        disabled: isDisabled,
      })}
    >
      <span className="circle" />
      <span className="label">{label}</span>
      <motion.span
        className="done-line"
        initial={isDone ? "done" : "active"}
        animate={isDone ? "done" : "active"}
        variants={{
          active: {
            height: 0,
          },
          done: {
            height: 55,
          },
        }}
        transition={{
          ease: "easeOut",
          duration: 1.5,
        }}
      />
    </div>
  );
}
