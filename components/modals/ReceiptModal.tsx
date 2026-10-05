"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { ReceiptItem, ReceiptModalProps, HistoryReceipt } from "@/types";
import { dummyReceiptItems } from "@/data";
import { ReceiptCard } from "@/components/receipt/ReceiptCard";
import FullScreenView from "@/components/ui/FullScreenView";

export type { ReceiptItem, ReceiptModalProps };

export function ReceiptModal({
  open,
  onOpenChange,
  date,
  items,
  orderId = "ORD-89421",
  onScreenshot,
  onKeep,
}: ReceiptModalProps) {
  const router = useRouter();

  // Format current date e.g. "17 MAR" if date not provided
  const displayDate =
    date ||
    new Date()
      .toLocaleDateString("en-US", { day: "2-digit", month: "short" })
      .toUpperCase();

  // Fallback sample items matching the design if none passed
  const displayItems: ReceiptItem[] =
    items && items.length > 0 ? items : dummyReceiptItems;

  const handleKeep = () => {
    onKeep?.();
    onOpenChange(false);
    router.push("/login");
  };

  const handleScreenshot = () => {
    onScreenshot?.();
    if (typeof window !== "undefined" && typeof window.print === "function") {
      window.print();
    }
  };

  const receiptData: HistoryReceipt = {
    id: orderId,
    orderNumber: orderId,
    date: displayDate,
    month: "",
    items: displayItems,
    qrCode: "/images/qr-code.png",
  };

  return (
    <FullScreenView
      open={open}
      onClose={() => onOpenChange(false)}
      title="RECEIPT"
      contentClassName="pt-4 pb-8 flex flex-col items-center justify-center"
    >
      <div className="w-full max-w-[280px] flex flex-col items-center justify-center my-auto">
        {/* Reusable Receipt Card */}
        <ReceiptCard
          receipt={receiptData}
          showDeliveryHeader={false}
          className="w-full max-w-[280px]"
        />

        {/* SCREENSHOT Text */}
        <button
          type="button"
          onClick={handleScreenshot}
          className="text-xs text-[#838EF8] hover:text-[#1317E4] tracking-widest uppercase transition-colors select-none mt-2 cursor-pointer font-mono"
        >
          SCREENSHOT
        </button>

        {/* Keep for next time (Create Account Button) */}
        <button
          type="button"
          onClick={handleKeep}
          className="w-full max-w-[210px] mt-2 py-3 rounded-full bg-[#1317E4] hover:bg-[#0014D4] active:scale-95 text-white text-[12px] font-mono tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(19,23,228,0.35)] cursor-pointer"
        >
          KEEP FOR NEXT TIME
        </button>
      </div>
    </FullScreenView>
  );
}

export default ReceiptModal;
