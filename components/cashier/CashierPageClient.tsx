"use client";

import Navbar from "@/components/layout/Navbar";
import CashierScanner from "@/components/cashier/CashierScanner";
import CashierHistoryModal from "@/components/cashier/CashierHistoryModal";
import ProfileModal from "@/components/modals/ProfileModal";
import { useState } from "react";

export default function CashierPageClient() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <main className="w-full min-h-screen bg-white flex flex-col items-center justify-between overflow-x-hidden relative select-none pb-6">
      <div className="w-full max-w-105 flex flex-col items-center px-3">
        {/* Cashier Navbar with Profile Avatar & Notification Bell */}
        <Navbar
          showProfile={true}
          notificationCount={2}
          className="px-3 pt-3 pb-1"
          onProfileClick={() => setProfileOpen(true)}
          onNotificationClick={() => setHistoryOpen(true)}
        />

        {/* Central Scanner Flow */}
        <div className="w-full flex flex-col items-center mt-3 sm:mt-5">
          <CashierScanner />
        </div>
      </div>

      {/* Cashier History Modal */}
      <CashierHistoryModal
        open={historyOpen}
        onOpenChange={setHistoryOpen}
      />

      {/* Profile Modal */}
      <ProfileModal
        open={profileOpen}
        onOpenChange={setProfileOpen}
      />
    </main>
  );
}
