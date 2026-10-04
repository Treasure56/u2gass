"use client";

import React, { useState } from "react";
import type { HistoryModalProps } from "@/types";
import { dummyHistoryReceipts, HISTORY_MONTHS } from "@/data";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { BottomSheetModal } from "@/components/ui/BottomSheetModal";
import { ReceiptCard } from "@/components/receipt/ReceiptCard";

export function HistoryModal({
  open,
  onOpenChange,
  receipts = dummyHistoryReceipts,
}: HistoryModalProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("MARCH");

  // Filter receipts by selected month
  const filteredReceipts = receipts.filter(
    (r) => r.month.toUpperCase() === selectedMonth.toUpperCase(),
  );

  const logout = useAuthStore((state) => state.logout);
  const handleLogout = () => {
    logout();
    onOpenChange(false);
  };

  return (
    <BottomSheetModal
      open={open}
      onOpenChange={onOpenChange}
      title="HISTORY"
      headerAction={
        <button
          type="button"
          onClick={handleLogout}
          className="text-[10px] text-[#838EF8] hover:text-[#1317E4] uppercase tracking-wider px-2 py-1 rounded-md hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          LOG OUT
        </button>
      }
      scrollable={false}
      className="w-full max-w-[420px] h-[90vh] max-h-[850px] px-6 pb-8"
    >
      {/* Month Filter Tabs (Flexbox) */}
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1 mb-3 shrink-0">
        {HISTORY_MONTHS.map((month) => {
          const isActive = month === selectedMonth;
          const hasReceipts = receipts.some(
            (r) => r.month.toUpperCase() === month.toUpperCase(),
          );

          return (
            <button
              key={month}
              type="button"
              onClick={() => setSelectedMonth(month)}
              className={cn(
                "text-[11px] tracking-wider select-none shrink-0 transition-all cursor-pointer uppercase",
                isActive
                  ? "bg-[#1317E4] text-white px-3.5 py-1 rounded-[8px] shadow-xs"
                  : hasReceipts
                    ? "text-[#1317E4] hover:opacity-80 px-1 py-1"
                    : "text-[#A2A9EE] px-1 py-1",
              )}
            >
              {month}
            </button>
          );
        })}
      </div>

      {/* Horizontal Receipts Slider (Flexbox) */}
      <div className="w-full flex-1 overflow-x-auto overflow-y-hidden no-scrollbar py-1 flex items-start">
        {filteredReceipts.length > 0 ? (
          <div className="flex gap-5 items-start snap-x snap-mandatory px-1 pt-1 pb-4">
            {filteredReceipts.map((receipt) => (
              <ReceiptCard
                key={receipt.id}
                receipt={receipt}
                showDeliveryHeader={false}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full py-16 flex flex-col items-center justify-center text-center">
            <p className="text-[14px] text-[#1317E4] tracking-wider uppercase mb-1">
              NO RECEIPTS IN {selectedMonth}
            </p>
            <span className="text-[11px] text-[#838EF8] uppercase">
              Refill orders will show here
            </span>
          </div>
        )}
      </div>
    </BottomSheetModal>
  );
}

export default HistoryModal;
