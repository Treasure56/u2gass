"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/authStore";
import { LoginKeypad } from "./LoginKeypad";
import { SocialAuth } from "./SocialAuth";
import { EmailLoginForm } from "./EmailLoginForm";

export default function LoginForm() {
  const router = useRouter();
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleTerminalKeyPress = (key: string) => {
    // If on email login, numeric or backspace can work
    if (showEmailLogin) {
      if (key === "x" || key === "X") {
        setEmail((prev) => prev.slice(0, -1));
      } else if (key === "PAY") {
        handleEmailSubmit();
      } else if (/^[0-9]$/.test(key)) {
        setEmail((prev) => prev + key);
      }
    }
  };

  const handleEmailSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const finalEmail = email.trim() || "example@gmail.com";
    setIsSubmitting(true);
    login({ email: finalEmail });
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/?logged_in=true");
    }, 300);
  };

  const handleQuickAuth = () => {
    login({ email: "user@u2gas.com" });
    router.push("/?logged_in=true");
  };

  return (
    <>
      {/* Top Hanging POS Terminal Device Keypad */}
      <LoginKeypad onKeyPress={handleTerminalKeyPress} />

      {/* Main Content Area */}
      <div className="w-full max-w-[340px] flex flex-col items-center mt-9 px-4">
        {/* Pixel Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-[32px] sm:text-[36px] leading-[1.08] text-[#1317E4] tracking-wide uppercase text-center select-none"
        >
          MAKE GAS
          <br />
          CONVINIENT
        </motion.h1>

        {/* Dynamic Transition Area based on login state */}
        <AnimatePresence mode="wait">
          {!showEmailLogin ? (
            <SocialAuth
              onOpenEmailLogin={() => setShowEmailLogin(true)}
              onQuickAuth={handleQuickAuth}
            />
          ) : (
            <EmailLoginForm
              email={email}
              setEmail={setEmail}
              onSubmit={handleEmailSubmit}
              onBack={() => setShowEmailLogin(false)}
              isSubmitting={isSubmitting}
            />
          )}
        </AnimatePresence>

        {/* Return to Terminal link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-[11px] tracking-wider text-[#838EF8] uppercase hover:text-[#1317E4] transition-colors"
          >
            ← BACK TO TERMINAL
          </Link>
        </div>
      </div>
    </>
  );
}
