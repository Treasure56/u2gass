"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BottomSheetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;

  /**
   * Title displayed in the standard header on the left.
   * Can be a string or custom ReactNode (e.g. multi-line title).
   */
  title?: React.ReactNode;

  /**
   * Optional action button or element placed on the right of the header (e.g. LOG OUT).
   */
  headerAction?: React.ReactNode;

  /**
   * Completely override the header row with custom JSX.
   * If provided, `title` and `headerAction` are ignored.
   */
  customHeader?: React.ReactNode;

  /**
   * Completely hide the header section.
   */
  hideHeader?: boolean;

  /**
   * Hide the top drag handle pill. Default: false.
   */
  hideHandle?: boolean;

  /**
   * Whether to wrap children in a standard flex-1 scrollable container (`overflow-y-auto no-scrollbar`).
   * Default: true. Set to false if custom scrolling or non-scroll layout is desired.
   */
  scrollable?: boolean;

  /**
   * Additional classes for the sliding sheet container.
   * Default includes: `w-full max-w-[430px] sm:max-w-[450px] h-[92vh] max-h-[880px] bg-white rounded-t-[36px] pt-3 pb-6 px-4 sm:px-6 shadow-2xl flex flex-col relative overflow-hidden`
   */
  className?: string;

  /**
   * Additional classes for the inner scrollable container (when `scrollable` is true).
   */
  contentClassName?: string;

  /**
   * Additional classes for the backdrop wrapper.
   */
  backdropClassName?: string;
}

export function BottomSheetModal({
  open,
  onOpenChange,
  children,
  title,
  headerAction,
  customHeader,
  hideHeader = false,
  hideHandle = false,
  scrollable = true,
  className,
  contentClassName,
  backdropClassName,
}: BottomSheetModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="bottom-sheet-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => onOpenChange(false)}
          className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 select-none",
            backdropClassName,
          )}
        >
          {/* Main Sliding Sheet */}
          <motion.div
            key="bottom-sheet-panel"
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "w-full max-w-[430px] sm:max-w-[450px] h-[92vh] max-h-[880px] bg-white rounded-t-[36px] pt-3 pb-6 px-4 sm:px-6 shadow-2xl flex flex-col relative overflow-hidden",
              className,
            )}
          >
            {/* Top Pull Handle */}
            {!hideHandle && (
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Close"
                className="w-12 h-1 bg-[#D1D5DB] rounded-full mx-auto mb-3 shrink-0 hover:bg-neutral-400 transition-colors cursor-pointer"
              />
            )}

            {/* Header Area */}
            {!hideHeader && (
              <div className="shrink-0 mb-3">
                {customHeader ? (
                  customHeader
                ) : (
                  <div className="flex items-start justify-between">
                    {title && (
                      <h2 className="text-[28px] sm:text-[32px] text-[#1317E4] tracking-wider uppercase font-bold text-left leading-[1.05]">
                        {title}
                      </h2>
                    )}
                    {headerAction && (
                      <div className="shrink-0 mt-1">{headerAction}</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Content Area */}
            {scrollable ? (
              <div
                className={cn(
                  "flex-1 overflow-y-auto no-scrollbar flex flex-col items-center w-full pt-1 pb-6",
                  contentClassName,
                )}
              >
                {children}
              </div>
            ) : (
              children
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BottomSheetModal;
