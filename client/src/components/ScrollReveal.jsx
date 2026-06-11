import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * ScrollReveal — animate children into view on scroll
 * direction: "up" | "down" | "left" | "right" | "scale"
 */
export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className,
  style,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-72px" });

  const hidden = {
    opacity: 0,
    y: direction === "up"    ?  30 : direction === "down"  ? -30 : 0,
    x: direction === "left"  ?  30 : direction === "right" ? -30 : 0,
    scale: direction === "scale" ? 0.93 : 1,
  };
  const visible = { opacity: 1, y: 0, x: 0, scale: 1 };

  return (
    <motion.div
      ref={ref}
      variants={{ hidden, visible }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
