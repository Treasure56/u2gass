"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import FullScreenView from "@/components/ui/FullScreenView";
import { useAuthStore, defaultUserProfile } from "@/stores/authStore";

type ProfileModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEditMode?: boolean;
};

export default function ProfileModal({
  open,
  onOpenChange,
  initialEditMode = false,
}: ProfileModalProps) {
  const user = useAuthStore((state) => state.user) || defaultUserProfile;
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [firstName, setFirstName] = useState(user.firstName || "JOHN");
  const [lastName, setLastName] = useState(user.lastName || "doe");
  const [email, setEmail] = useState(user.email || "EXAMPLE@GMAIL.COM");
  const [address, setAddress] = useState(
    user.address || "4, Anthony Villa, Um...",
  );

  useEffect(() => {
    if (open) {
      setFirstName(user.firstName || "JOHN");
      setLastName(user.lastName || "doe");
      setEmail(user.email || "EXAMPLE@GMAIL.COM");
      setAddress(user.address || "4, Anthony Villa, Um...");
      setIsEditing(initialEditMode);
    }
  }, [open, user, initialEditMode]);

  const handleLogout = () => {
    logout();
    onOpenChange(false);
  };

  const handleSave = () => {
    updateUser({
      firstName,
      lastName,
      email,
      address,
    });
    setIsEditing(false);
  };

  const handleAddAddress = () => {
    const input = document.getElementById("profile-address-input");
    if (input) {
      input.focus();
    }
  };

  return (
    <FullScreenView
      open={open}
      onClose={() => onOpenChange(false)}
      title="PERSONAL DETAILS"
      headerRight={
        <button
          type="button"
          onClick={handleLogout}
          className="text-[11px] text-[#838EF8] hover:text-[#1317E4] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-md hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          LOG OUT
        </button>
      }
      contentClassName="pt-2 pb-8"
    >
      {/* Polaroid-Style Photo */}
      <div className="flex flex-col items-center mb-4 shrink-0">
        <div className="bg-white p-2 pb-3 rounded-[4px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-neutral-100 flex flex-col items-center">
          <div className="relative w-26 h-28 sm:w-28 sm:h-32 overflow-hidden rounded-[2px] bg-neutral-100">
            <Image
              src={user.avatar || "/images/profile-avatar.png"}
              alt={`${user.firstName || "User"} avatar`}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Manage / DONE Pill Button */}
        {isEditing ? (
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#1317E4] hover:bg-[#0F12BE] active:scale-95 text-white text-[11px] font-bold px-5 py-0.5 rounded-full transition-all mt-2 shadow-xs cursor-pointer uppercase tracking-wider"
          >
            DONE
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-[#B9BFF8] hover:bg-[#A8AFF6] active:scale-95 text-[#1317E4] text-[11px] font-bold px-4 py-0.5 rounded-full transition-all mt-2 shadow-xs cursor-pointer lowercase"
          >
            manage
          </button>
        )}
      </div>

      {/* Detail Pill Cards & Map Section (396px wide) */}
      <div className="w-full flex flex-col gap-2.5 sm:gap-3 max-w-[396px] items-center">
        {/* FIRST NAME */}
        <div
          className={`w-full rounded-full bg-white py-3 px-6 flex flex-col items-center justify-center text-center transition-all ${
            isEditing
              ? "border border-dashed border-[#A5B4FC]/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
              : "border border-neutral-100/90 shadow-[0_6px_24px_rgba(0,0,0,0.04)]"
          }`}
        >
          <span className="text-[10px] text-[#1317E4] tracking-[0.14em] uppercase mb-0.5">
            FIRST NAME
          </span>
          {isEditing ? (
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full text-center bg-transparent border-none outline-none text-[20px] sm:text-[22px] font-bold text-[#838EF8] focus:text-[#1317E4] tracking-wider uppercase leading-tight"
            />
          ) : (
            <span className="text-[20px] sm:text-[22px] font-bold text-[#1317E4] tracking-wider uppercase leading-tight">
              {user.firstName || "JOHN"}
            </span>
          )}
        </div>

        {/* LAST NAME */}
        <div
          className={`w-full rounded-full bg-white py-3 px-6 flex flex-col items-center justify-center text-center transition-all ${
            isEditing
              ? "border border-dashed border-[#A5B4FC]/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
              : "border border-neutral-100/90 shadow-[0_6px_24px_rgba(0,0,0,0.04)]"
          }`}
        >
          <span className="text-[10px] text-[#1317E4] tracking-[0.14em] uppercase mb-0.5">
            LAST NAME
          </span>
          {isEditing ? (
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full text-center bg-transparent border-none outline-none text-[20px] sm:text-[22px] font-bold text-[#838EF8] focus:text-[#1317E4] tracking-wider leading-tight"
            />
          ) : (
            <span className="text-[20px] sm:text-[22px] font-bold text-[#1317E4] tracking-wider leading-tight">
              {user.lastName || "doe"}
            </span>
          )}
        </div>

        {/* EMAIL */}
        <div
          className={`w-full rounded-full bg-white py-3 px-6 flex flex-col items-center justify-center text-center transition-all ${
            isEditing
              ? "border border-dashed border-[#A5B4FC]/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
              : "border border-neutral-100/90 shadow-[0_6px_24px_rgba(0,0,0,0.04)]"
          }`}
        >
          <span className="text-[10px] text-[#1317E4] tracking-[0.14em] uppercase mb-0.5">
            EMAIL
          </span>
          {isEditing ? (
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-center bg-transparent border-none outline-none text-[17px] sm:text-[19px] font-bold text-[#838EF8] focus:text-[#1317E4] tracking-wider uppercase leading-tight"
            />
          ) : (
            <span className="text-[17px] sm:text-[19px] font-bold text-[#1317E4] tracking-wider uppercase leading-tight truncate max-w-full">
              {user.email || "EXAMPLE@GMAIL.COM"}
            </span>
          )}
        </div>

        {/* HOME - ADDRESS */}
        <div
          className={`w-full rounded-full bg-white py-3 px-6 flex flex-col items-center justify-center text-center transition-all mt-1.5 ${
            isEditing
              ? "border border-dashed border-[#A5B4FC]/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
              : "border border-neutral-100/90 shadow-[0_6px_24px_rgba(0,0,0,0.04)]"
          }`}
        >
          <span className="text-[10px] text-[#1317E4] tracking-[0.14em] uppercase mb-0.5">
            HOME - ADDRESS
          </span>
          {isEditing ? (
            <input
              id="profile-address-input"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-center bg-transparent border-none outline-none text-[15px] sm:text-[16px] font-bold text-[#838EF8] focus:text-[#1317E4] tracking-wider leading-tight"
            />
          ) : (
            <span className="text-[15px] sm:text-[16px] font-bold text-[#1317E4] tracking-wider leading-tight truncate max-w-full">
              {user.address || "4, Anthony Villa, Um..."}
            </span>
          )}
        </div>

        {/* Map Card in Edit Mode: 396x200 */}
        {isEditing && (
          <div className="w-full max-w-[396px] mt-2 relative rounded-[24px] overflow-hidden aspect-[396/200] flex items-center justify-center shrink-0 shadow-sm border border-neutral-200/50">
            <Image
              src="/images/map.png"
              alt="Address Map"
              width={396}
              height={200}
              className="w-full h-full object-cover select-none"
              priority
            />
            <button
              type="button"
              onClick={handleAddAddress}
              aria-label="Add Address"
              className="absolute inset-x-[18%] top-[34%] bottom-[34%] rounded-full cursor-pointer hover:bg-white/10 active:scale-95 transition-all"
            />
          </div>
        )}
      </div>
    </FullScreenView>
  );
}

export { ProfileModal };
