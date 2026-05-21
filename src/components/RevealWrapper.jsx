// components/Reveal.jsx
import { motion } from "motion/react";

const Reveal = ({ children, y = 40, duration = 0.8, delay = 0, classname }) => {
  return (
    <motion.div
      className={classname}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
