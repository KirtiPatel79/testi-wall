"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, Transition, motion } from "framer-motion";
import { Children, ReactElement, ReactNode, cloneElement, useEffect, useId, useState } from "react";

type ChildProps = {
  "data-id": string;
  className?: string;
  children?: ReactNode;
};

type AnimatedBackgroundProps = {
  children: ReactElement<ChildProps>[] | ReactElement<ChildProps>;
  defaultValue?: string;
  onValueChange?: (newActiveId: string | null) => void;
  className?: string;
  transition?: Transition;
  enableHover?: boolean;
};

export function AnimatedBackground({
  children,
  defaultValue,
  onValueChange,
  className,
  transition,
  enableHover = false,
}: AnimatedBackgroundProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const uniqueId = useId();

  const handleSetActiveId = (id: string | null) => {
    setActiveId(id);
    if (onValueChange) onValueChange(id);
  };

  useEffect(() => {
    if (defaultValue !== undefined) setActiveId(defaultValue);
  }, [defaultValue]);

  return Children.map(children, (child: ReactElement<ChildProps>, index) => {
    const id = child.props["data-id"];

    const interactionProps = enableHover
      ? {
          onMouseEnter: () => handleSetActiveId(id),
          onMouseLeave: () => handleSetActiveId(null),
        }
      : { onClick: () => handleSetActiveId(id) };

    return cloneElement(
      child as ReactElement<Record<string, unknown>>,
      {
        key: index,
        className: cn("relative inline-flex", child.props.className),
        "aria-selected": activeId === id,
        "data-checked": activeId === id ? "true" : "false",
        ...interactionProps,
      },
      <>
        <AnimatePresence initial={false}>
          {activeId === id && (
            <motion.div
              key={`bg-${uniqueId}`}
              layoutId={`bg-${uniqueId}`}
              className={cn("absolute inset-0", className)}
              transition={transition ?? { type: "spring", bounce: 0.2, duration: 0.3 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
        <span className="z-10">{child.props.children}</span>
      </>,
    );
  });
}
