import { motion } from "framer-motion";
import clsx from "clsx";

export const Highlight = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={clsx(
        "bg-gradient-to-r from-amber-400 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent",
        "font-extrabold tracking-tight text-[clamp(2.25rem,5vw,3rem)] drop-shadow-sm",
        className
      )}
    >
      {children}
    </motion.span>
  );
};
