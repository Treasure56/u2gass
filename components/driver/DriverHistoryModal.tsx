"use client";

import React, { useState } from "react";
import type { HistoryReceipt } from "@/types";
import { dummyHistoryReceipts, HISTORY_MONTHS } from "@/data";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { ReceiptCard } from "@/components/receipt/ReceiptCard";
import FullScreenView from "@/components/ui/FullScreenView";

type FilterTab = "TODAY" | "MONTH" | string;

export interface DriverHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipts?: HistoryReceipt[];
  driverName?: string;
}

export default function DriverHistoryModal({
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
    <FullScreenView
      open={open}
      onClose={() => onOpenChange(false)}
      contentClassName="pt-2 pb-6"
    >
      {/* ── Custom Driver Header ── */}
      <div className="w-full flex flex-col gap-1 mb-4 px-1 text-left">
        <h2 className="text-[40px] text-brand-primary tracking-wider uppercase font-bold leading-none">
          {displayName}&apos;S
        </h2>
        <p className="text-base text-[#1317E4] tracking-[0.16em] uppercase leading-none font-semibold">
          DRIVER &mdash; HISTORY
        </p>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="w-full flex items-center gap-4 overflow-x-auto no-scrollbar py-1.5 mb-4 shrink-0 px-1 touch-pan-x">
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
                "text-[20px] font-mono tracking-wider select-none shrink-0 transition-all cursor-pointer uppercase px-3.5 py-1 rounded-[8px] font-medium leading-none",
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

      {/* ── Horizontal Cards Slider ── */}
      <div className="w-full flex-1 overflow-x-auto overflow-y-hidden no-scrollbar py-1 flex items-start justify-center touch-pan-x">
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
          <div className="w-full py-20 flex flex-col items-center justify-center text-center">
            <p className="text-[18px] text-[#1317E4] font-mono font-bold tracking-wider uppercase mb-1">
              NO DELIVERIES FOUND
            </p>
            <span className="text-[13px] text-neutral-400 font-mono uppercase">
              Assigned orders for {activeTab} will appear here
            </span>
          </div>
        )}
      </div>
    </FullScreenView>
  );
}
