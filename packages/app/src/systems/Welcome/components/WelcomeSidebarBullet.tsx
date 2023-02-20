import { useSelector } from "@xstate/react";
import { motion } from "framer-motion";

import { useWelcomeSteps, stepsSelectors } from "../hooks";

export function WelcomeSidebarBullet() {
  const { service } = useWelcomeSteps();
  const current = useSelector(service, stepsSelectors.current);

  function getVariant() {
    if (current.id === 0) return "first";
    return "second";
  }

  return (
    <motion.span
      className="welcomeSidebar--bullet"
      initial={getVariant()}
      animate={getVariant()}
      variants={{
        first: {
          y: -32.5,
          x: 6,
        },
        second: {
          y: 32.5,
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
