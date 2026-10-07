"use client";

import { cn } from "@/lib/utils";

export const KEYPAD_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["x", "0", "PAY"],
] as const;

export type KeypadKey = (typeof KEYPAD_ROWS)[number][number];

export interface TerminalKeyProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Individual tactile terminal key button
 */
export default function TerminalKey({
  label,
  onClick,
  disabled = false,
  className = "",
}: TerminalKeyProps) {
  const isPay = label === "PAY";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "bg-[#222222] text-[#e3e3e3] border border-[#141414] border-t-[#606060]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_3px_6px_rgba(0,0,0,0.65)] flex items-center justify-center relative active:translate-y-0.5 transition-transform text-[32px] leading-none",
        isPay
          ? "rounded-lg py-[2.5px] px-2 w-max justify-self-end whitespace-nowrap"
          : "w-12.25 h-9.75 rounded-lg",
        className,
      )}
    >
      <div className="absolute inset-0 opacity-25 pointer-events-none" />
      <span className="-translate-y-px relative z-10">{label}</span>
    </button>
  );
}

export interface TerminalKeyboardProps {
  onKeyPress: (key: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Complete terminal keyboard grid that maps all keys
 */
export function TerminalKeyboard({
  onKeyPress,
  disabled = false,
  className = "",
}: TerminalKeyboardProps) {
  return (
    <div
      className={`grid grid-cols-3 gap-x-8 gap-y-3.75 w-52.75 mb-8 z-10 ${className}`}
    >
      {KEYPAD_ROWS.flat().map((key) => (
        <TerminalKey
          key={key}
          label={key}
          disabled={disabled}
          onClick={() => onKeyPress(key)}
        />
      ))}
    </div>
  );
}
