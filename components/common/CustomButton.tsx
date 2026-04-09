"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type Props = HTMLMotionProps<"button">;

const CustomButton = forwardRef<HTMLButtonElement, Props>(
    ({ children, className, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileTap={!props.disabled ? { scale: 0.94, y: 1 } : undefined}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className={className}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);

CustomButton.displayName = "CustomButton";
export default CustomButton;