import { motion, type MotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface FadeProps extends Omit<MotionProps, "initial" | "animate" | "exit"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

/**
 * Fade Component: A lightweight, reusable animation wrapper for smooth fade-in/fade-out effects.
 * Uses only opacity changes (no y-axis translation) for a subtle, professional appearance.
 * Perfect for page sections, entry animations, and component reveals.
 *
 * @example
 * <Fade>
 *   <div>This content fades in smoothly</div>
 * </Fade>
 *
 * @example
 * <Fade delay={0.2} duration={0.5}>
 *   <h1>Staggered entry</h1>
 * </Fade>
 */
export function Fade({
  children,
  delay = 0,
  duration = 0.6,
  transition,
  ...props
}: FadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration,
        delay,
        ...(transition ?? {}),
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * FadeInUp Component: Fade in with slight upward movement (y: 8px).
 * Use this for subtle motion without the jarring "slide-up-from-below" effect.
 * Combines opacity fade with minimal vertical translation for elegance.
 */
export function FadeInUp({
  children,
  delay = 0,
  duration = 0.6,
  y = 8,
  transition,
  ...props
}: FadeProps & { y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -y }}
      transition={{
        duration,
        delay,
        ...(transition ?? {}),
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer: Wrapper for staggering child animations.
 * Use with Fade/FadeInUp components for coordinated entry sequences.
 *
 * @example
 * <StaggerContainer>
 *   <Fade delay={0}>Item 1</Fade>
 *   <Fade delay={0.1}>Item 2</Fade>
 *   <Fade delay={0.2}>Item 3</Fade>
 * </StaggerContainer>
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  ...props
}: {
  children: ReactNode;
  staggerDelay?: number;
} & Omit<MotionProps, "children">) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
