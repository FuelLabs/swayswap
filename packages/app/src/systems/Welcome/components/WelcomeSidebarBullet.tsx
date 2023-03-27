import { useSelector } from "@xstate/react";
import { motion } from "framer-motion";

import { useWelcomeSteps, stepsSelectors } from "../hooks";

export function WelcomeSidebarBullet() {
  const { service } = useWelcomeSteps();
  const current = useSelector(service, stepsSelectors.current);

  function getVariant() {
    if (current.id === 0) return "first";
    if (current.id === 1) return "second";
    if (current.id === 2) return "third";
    if (current.id === 3) return "fourth";
    return "fifth";
  }

  return (
    <motion.span
      className="welcomeSidebar--bullet"
      initial={getVariant()}
      animate={getVariant()}
      variants={{
        first: {
          y: -130,
          x: 6,
        },
        second: {
          y: -65,
          x: 6,
        },
        third: {
          y: 0,
          x: 6,
        },
        fourth: {
          y: 65,
          x: 6,
        },
        fifth: {
          y: 130,
          x: 6,
        },
      }}
      transition={{
        ease: "easeOut",
        duration: 1.2,
      }}
    />
  );
}
