"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { ReceiptItem, ReceiptModalProps, HistoryReceipt } from "@/types";
import { dummyReceiptItems } from "@/data";
import { ReceiptCard } from "@/components/receipt/ReceiptCard";

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
    // Native print / share or alert if in browser
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
    <AnimatePresence>
      {open && (
        <motion.div
          key="receipt-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => onOpenChange(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-4 overflow-y-auto select-none"
        >
          <motion.div
            key="receipt-card-wrapper"
            initial={{ scale: 0.82, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[280px] flex flex-col items-center my-auto"
          >
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
              className="text-[12px] tracking-[0.22em] uppercase text-white mt-5 hover:text-white/80 transition-colors cursor-pointer"
            >
              SCREENSHOT
            </button>

            {/* OR Subtext */}
            <span className="text-[10px] text-white/60 uppercase my-1.5">
              OR
            </span>

            {/* KEEP Button */}
            <button
              type="button"
              onClick={handleKeep}
              className="bg-[#1317E4] hover:bg-blue-700 text-white text-[13px] tracking-widest px-8 py-2.5 rounded-full shadow-[0_4px_16px_rgba(19,23,228,0.55)] active:scale-95 transition-all cursor-pointer"
            >
              KEEP
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ReceiptModal;
