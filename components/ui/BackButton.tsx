"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export default function BackButton({
  onClick,
  label = "BACK",
  className = "",
}: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "bg-[#1317E8] hover:bg-[#1014cc] text-white text-[12px] font-mono font-bold px-3 py-1.5 rounded-[6px] flex items-center gap-1 uppercase tracking-wider active:scale-95 transition-all shadow-xs cursor-pointer select-none",
        className,
      )}
    >
      <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
      <span>{label}</span>
    </button>
  );
}
