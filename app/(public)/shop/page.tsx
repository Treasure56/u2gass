"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import MarqueeSlider from "@abundiko/react-marquee";
import { ShopModal } from "@/components/modals/ShopModal";
import { products } from "@/data";
import type { Product } from "@/types";
import { ArrowLeftIcon } from "lucide-react";

export default function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = products.filter((item) =>
    (item.name || "").toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );

  const handleSelectProduct = (item: Product) => {
    setSelectedProduct(item);
    setIsModalOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <main className="w-full min-h-screen bg-white flex flex-col items-center select-none pb-12 relative overflow-x-hidden">
      {/* Top Header - Truly Fixed at top so it never scrolls */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-105 z-30 bg-white/95 backdrop-blur-md px-5 pt-6 pb-3 flex items-start justify-between">
        <Link href="/" className="text-left group cursor-pointer">
          <h1 className="text-[30px] leading-[1.15] text-[#838EF8] tracking-[0.08em] uppercase group-hover:text-[#6a76ee] transition-colors whitespace-pre-line">
            {"SHOP FOR\nACCESSORIES"}
          </h1>
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1 mt-1 group-hover:text-[#838EF8]">
            <ArrowLeftIcon className="w-2 h-2" />
            HOME
          </span>
        </Link>

        {/* Mini LED Rate Ticker */}
        <div className="w-20 h-8 bg-[#1A1A1A] rounded-[6px] border border-neutral-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden shrink-0 mt-0.5">
          <div className="w-full h-full flex items-center overflow-hidden [&_.marquee-anim]:h-full [&_.marquee-anim]:flex [&_.marquee-anim]:items-center">
            <MarqueeSlider
              speed={6}
              axis="-x"
              className="h-full flex items-center"
            >
              <span className="inline-flex items-center text-[10px] leading-none font-bold tracking-wider px-1 select-none text-[#FF2222] whitespace-nowrap drop-shadow-[0_0_4px_rgba(255,30,30,0.9)]">
                Today&apos;s Rate: 1kg : ₦1,400 •&nbsp;
              </span>
              <span className="inline-flex items-center text-[10px] leading-none font-bold tracking-wider px-1 select-none text-[#FF2222] whitespace-nowrap drop-shadow-[0_0_4px_rgba(255,30,30,0.9)]">
                Today&apos;s Rate: 1kg : ₦1,400 •&nbsp;
              </span>
            </MarqueeSlider>
          </div>
        </div>
      </header>

      <div className="w-full max-w-105 flex flex-col pt-36 pb-8 px-5 relative min-h-screen">
        {/* Products Grid — 2 columns matching user design aspect ratio 406:482 */}
        <div
          style={{
            filter: isSearchOpen ? "blur(10px)" : "none",
            opacity: isSearchOpen ? 0.35 : 1,
            transition: "filter 0.3s ease, opacity 0.3s ease",
          }}
          className={`w-full grid grid-cols-2 gap-x-5 gap-y-7 px-1 mb-8 ${
            isSearchOpen ? "pointer-events-none scale-[0.98]" : ""
          }`}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={`${item.product_id}-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              onClick={() => handleSelectProduct(item)}
              className="w-full relative flex items-center justify-center group cursor-pointer hover:scale-[1.04] active:scale-95 transition-transform"
            >
              <div className="relative w-full aspect-[406/482] flex items-center justify-center p-2">
                <Image
                  src={item.image}
                  alt={item.name || ""}
                  fill
                  sizes="(max-width: 480px) 50vw, 200px"
                  className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.16)] transition-all duration-300 group-hover:drop-shadow-[0_14px_28px_rgba(0,0,0,0.22)]"
                />
              </div>
            </motion.div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-2 py-12 text-center text-sm text-neutral-400">
              NO ACCESSORIES FOUND
            </div>
          )}
        </div>

        {/* Search Button under products */}
        {!isSearchOpen && (
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-full max-w-[260px] mx-auto rounded-full border border-dashed border-[#B0B0B0] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-5 py-3 flex items-center justify-center cursor-pointer hover:border-[#838EF8] hover:shadow-[0_4px_16px_rgba(131,142,248,0.12)] transition-all active:scale-[0.98] mb-4"
          >
            <span className="text-[13px] tracking-wider text-[#838EF8]/80 uppercase">
              SEARCH ANYTHING
            </span>
          </button>
        )}

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <>
              <motion.div
                key="search-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseSearch}
                className="fixed inset-0 z-30 bg-black/10 backdrop-blur-[2px]"
              />
              <motion.div
                key="search-floating-bar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 24, stiffness: 300 }}
                className="fixed top-36 left-4 right-4 z-40 flex justify-center"
              >
                <div className="w-full max-w-[320px] relative rounded-full border border-dashed border-[#838EF8] bg-white shadow-[0_8px_32px_rgba(131,142,248,0.2)] px-5 py-3 flex items-center transition-all">
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") handleCloseSearch();
                    }}
                    placeholder="SEARCH ANYTHING"
                    className="w-full bg-transparent text-center text-[13px] tracking-wider text-[#838EF8] placeholder:text-[#838EF8]/70 outline-none uppercase"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 text-[#838EF8] text-base hover:opacity-70 cursor-pointer"
                    >
                      ×
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCloseSearch}
                      className="absolute right-4 text-neutral-400 text-sm hover:text-neutral-600 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Product Detail Modal (Opens when an accessory is clicked) */}
        <ShopModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          initialProduct={selectedProduct}
        />
      </div>
    </main>
  );
}
