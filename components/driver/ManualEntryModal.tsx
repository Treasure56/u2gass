"use client";

import { useState } from "react";
import BottomSheetModal from "@/components/ui/BottomSheetModal";

export interface ManualEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (orderId: string) => void;
}

export default function ManualEntryModal({
  open,
  onOpenChange,
  onConfirm,
}: ManualEntryModalProps) {
  const [orderCode, setOrderCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const clean = orderCode.trim().toUpperCase();
    if (!clean) {
      setError("PLEASE ENTER ORDER NUMBER");
      return;
    }
    setError("");
    onConfirm(clean);
    onOpenChange(false);
  };

  return (
    <BottomSheetModal
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) setError("");
        onOpenChange(newOpen);
      }}
      title="MANUAL CONFIRMATION"
      className="w-full max-w-[380px] p-6"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center gap-4 py-2"
      >

        <p className="text-[11px] text-neutral-500 uppercase tracking-wider text-center">
          Enter order or receipt code to confirm gas delivery
        </p>

        <div className="w-full max-w-[280px] h-[52px] rounded-full bg-white border border-dashed border-[#CCD0DC] flex items-center justify-center px-6 shadow-xs focus-within:border-[#1317E4] transition-colors mt-2">
          <input
            type="text"
            value={orderCode}
            onChange={(e) => {
              setOrderCode(e.target.value.toUpperCase());
              if (error) setError("");
            }}
            placeholder="E.G. ORD-89421"
            className="w-full bg-transparent text-[15px] tracking-wider text-center text-[#1317E4] placeholder:text-neutral-400 focus:outline-hidden uppercase"
            autoFocus
          />
        </div>

        {error && (
          <span className="text-[10px] text-red-500 tracking-wider">
            {error}
          </span>
        )}



        <button
          type="button"
          onClick={() => handleSubmit()}
          className="w-full max-w-[210px] mt-4 py-3.5 rounded-full bg-[#1317E4] hover:bg-[#0014D4] active:scale-95 text-white text-[14px] tracking-wider uppercase transition-all shadow-[0_6px_20px_rgba(19,23,228,0.35)] cursor-pointer"
        >
          CONFIRM ORDER
        </button>
      </form>
    </BottomSheetModal>
  );
}
