"use client";

import { useState } from "react";
import ReceiptCard from "@/components/receipt/ReceiptCard";
import type { HistoryReceipt } from "@/types";
import { dummyHistoryReceipts, HISTORY_MONTHS } from "@/data";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";
import FullScreenView from "@/components/ui/FullScreenView";

type FilterTab = "TODAY" | "MONTH" | string;

export interface CashierHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipts?: HistoryReceipt[];
  cashierName?: string;
}

export default function CashierHistoryModal({
  open,
  onOpenChange,
  receipts = dummyHistoryReceipts,
  cashierName,
}: CashierHistoryModalProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("TODAY");
  const user = useAuthStore((state) => state.user);

  const displayName = cashierName || user?.lastName || "CASHIER";

  const tabs: FilterTab[] = ["TODAY", "MONTH", ...HISTORY_MONTHS];

  // Filter logic
  const filteredReceipts = (() => {
    if (activeTab === "TODAY") {
      return receipts.filter((r) => {
        const d = (r.date || "").toLowerCase();
        return (
          d.includes("today") ||
          d.includes("oct 5") ||
          d.includes("10/5") ||
          d.includes("2026")
        );
      });
    }
    if (activeTab === "MONTH") {
      const currentMonth = "OCT";
      return receipts.filter(
        (r) => r.month.toUpperCase() === currentMonth.toUpperCase(),
      );
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
      {/* ── Custom Cashier Header ── */}
      <div className="w-full flex flex-col gap-1 mb-4 px-1 text-left">
        <h2 className="text-[40px] text-brand-primary tracking-wider uppercase font-bold leading-none">
          {displayName}&apos;S
        </h2>
        <p className="text-base text-[#1317E4] tracking-[0.16em] uppercase leading-none font-semibold">
          CASHIER &mdash; HISTORY
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

      {/* ── Horizontal Receipts Slider ── */}
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
              NO CASHIER TRANSACTIONS
            </p>
            <span className="text-[13px] text-neutral-400 font-mono uppercase">
              Completed walk-in and verified orders will appear here
            </span>
          </div>
        )}
      </div>
    </FullScreenView>
  );
}
