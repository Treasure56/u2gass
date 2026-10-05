"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type PaymentMethod = "CASH" | "POS" | "BANK TRANS";

interface PaymentMethodBadgeProps {
  method: PaymentMethod;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function PaymentMethodBadge({
  method,
  selected = false,
  onClick,
  className = "",
  size = "md",
}: PaymentMethodBadgeProps) {
  // Mockup tilts: CASH tilts left (-6deg), POS is straight (0deg), BANK TRANS tilts right (+6deg)
  const defaultRotation =
    method === "CASH"
      ? "-rotate-6"
      : method === "POS"
        ? "rotate-0"
        : "rotate-6";

  const sizeClasses =
    size === "sm"
      ? "w-14 h-12 text-[10px] p-1"
      : size === "lg"
        ? "w-20 h-16 text-sm p-2"
        : "w-16 h-14 text-xs p-1.5";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative rounded-[18px] bg-white border border-dashed flex flex-col items-center justify-center font-mono font-black text-black select-none cursor-pointer transition-all duration-200",
        defaultRotation,
        sizeClasses,
        selected
          ? "border-black shadow-[0_6px_16px_rgba(0,0,0,0.18)] scale-105 ring-2 ring-[#1317E8]/20"
          : "border-[#D1D5DB] shadow-[0_4px_10px_rgba(0,0,0,0.08)] hover:shadow-md hover:scale-105 active:scale-95",
        className,
      )}
    >
      {/* Subtle paper / stamp corner detail */}
      <div className="absolute inset-0 rounded-[18px] bg-gradient-to-b from-white to-[#F5F5F7] pointer-events-none -z-10" />

      {method === "BANK TRANS" ? (
        <div className="flex flex-col items-center leading-none text-center">
          <span className="tracking-wider text-[11px] leading-tight">BANK</span>
          <span className="tracking-wider text-[10px] leading-tight">TRANS</span>
        </div>
      ) : (
        <span className="tracking-wider text-[12px]">{method}</span>
      )}
    </button>
  );
}
