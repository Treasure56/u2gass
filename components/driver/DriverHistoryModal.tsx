"use client";

import React, { useState } from "react";
import type { HistoryReceipt } from "@/types";
import { dummyHistoryReceipts, HISTORY_MONTHS } from "@/data";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { ReceiptCard } from "@/components/receipt/ReceiptCard";
import BottomSheetModal from "../ui/BottomSheetModal";

type FilterTab = "TODAY" | "MONTH" | string;

export interface DriverHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipts?: HistoryReceipt[];
  driverName?: string;
}

export function DriverHistoryModal({
  open,
  onOpenChange,
  receipts = dummyHistoryReceipts,
  driverName,
}: DriverHistoryModalProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("TODAY");

  const user = useAuthStore((state) => state.user);
  const displayName = driverName || user?.lastName || "SMITH";

  // Filter tabs: TODAY, MONTH, then individual months
  const tabs: FilterTab[] = ["TODAY", "MONTH", ...HISTORY_MONTHS];

  // Filter receipts based on active tab
  const filteredReceipts = (() => {
    if (activeTab === "TODAY") {
      // Show all active/in-progress deliveries for today
      return receipts.filter(
        (r) =>
          r.deliveryStatus?.toUpperCase().includes("PROGRESS") ||
          !r.deliveryStatus,
      );
    }
    if (activeTab === "MONTH") {
      // Show current month receipts
      const currentMonth = new Date()
        .toLocaleDateString("en-US", { month: "long" })
        .toUpperCase();
      return receipts.filter((r) => r.month.toUpperCase() === currentMonth);
    }
    // Filter by specific month
    return receipts.filter(
      (r) => r.month.toUpperCase() === activeTab.toUpperCase(),
    );
  })();

  return (
    <BottomSheetModal
      open={open}
      onOpenChange={onOpenChange}
      customHeader={
        <div className="flex flex-col gap-1 mb-2 px-1">
          <h2 className="text-[30px] sm:text-[34px] text-[#1317E4] tracking-wider uppercase font-bold leading-none">
            {displayName}&apos;S
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#1317E4] tracking-[0.16em] uppercase leading-none font-semibold">
            DRIVER &mdash; HISTORY
          </p>
        </div>
      }
      scrollable={false}
      className="w-full max-w-[420px] h-[90vh] max-h-[850px] px-5 sm:px-6 pb-8"
    >
      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 mb-3 shrink-0 px-1">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          const hasReceipts = receipts.some(
            (r) => r.month.toUpperCase() === tab.toUpperCase(),
          );

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "text-[10px] sm:text-[10.5px] tracking-wider select-none shrink-0 transition-all cursor-pointer uppercase px-3 py-1.5 rounded-[6px] font-medium",
                isActive
                  ? "bg-[#1317E4] text-white shadow-xs"
                  : hasReceipts || tab === "TODAY" || tab === "MONTH"
                    ? "text-[#1317E4] hover:bg-[#1317E4]/5"
                    : "text-[#1317E4]/35 hover:text-[#1317E4]/60",
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── Receipts Horizontal Slider ── */}
      <div className="w-full flex-1 overflow-x-auto overflow-y-hidden no-scrollbar py-1 flex items-start">
        {filteredReceipts.length > 0 ? (
          <div className="flex gap-4 sm:gap-5 items-start snap-x snap-mandatory px-1 pt-1 pb-4">
            {filteredReceipts.map((receipt) => (
              <ReceiptCard
                key={receipt.id}
                receipt={receipt}
                showDeliveryHeader={true}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full py-16 flex flex-col items-center justify-center text-center">
            <p className="text-[14px] text-[#1317E4] tracking-wider uppercase mb-1">
              NO DELIVERIES
            </p>
            <span className="text-[11px] text-[#1317E4]/50 uppercase">
              {activeTab === "TODAY"
                ? "No active deliveries today"
                : `No deliveries in ${activeTab}`}
            </span>
          </div>
        )}
      </div>
    </BottomSheetModal>
  );
}

export default DriverHistoryModal;
