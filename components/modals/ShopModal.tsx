"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import MarqueeSlider from "@abundiko/react-marquee";
import type { Product } from "@/types";
import { products } from "@/data";
import { useCartStore, type CartItem } from "@/stores/cartStore";
import { cn } from "@/lib/utils";
import TerminalScreenBox from "@/components/terminal-screen-box";
import BottomSheetModal from "@/components/ui/BottomSheetModal";

export type ShopModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProduct?: Product | null;
  /** Backwards compatibility alias for initialProduct */
  initialItem?: Product | null;
  onCheckout?: (cart: CartItem[]) => void;
};

type ViewMode = "grid" | "detail" | "basket";

export function ShopModal({
  open,
  onOpenChange,
  initialProduct,
  initialItem,
  onCheckout,
}: ShopModalProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState<"delivery" | "walk-in">(
    "delivery",
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success"
  >("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  // Zustand Cart Store
  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const totalCartCount = getTotalItems();

  const activeInitial = initialProduct ?? initialItem;

  // Sync initial item/product
  useEffect(() => {
    if (open) {
      if (activeInitial) {
        const found =
          products.find(
            (p) =>
              p.product_id === activeInitial.product_id ||
              p.image === activeInitial.image ||
              (p.name || "").toLowerCase() ===
                (activeInitial.name || "").toLowerCase(),
          ) || activeInitial;
        setSelectedProduct(found);
        setViewMode("detail");
      }
    } else {
      setIsSearchOpen(false);
      setSearchQuery("");
      setShowPayment(false);
      setIsProcessing(false);
      setPaymentStatus("idle");
    }
  }, [open, activeInitial]);

  // Payment processing effect (2.4s)
  useEffect(() => {
    if (isProcessing) {
      const timer = setTimeout(() => {
        setIsProcessing(false);
        setPaymentStatus("success");
      }, 2400);

      return () => clearTimeout(timer);
    }
  }, [isProcessing]);

  const filteredProducts = products.filter((item) =>
    (item.name || "").toLowerCase().includes(searchQuery.toLowerCase().trim()),
  );

  const otherProducts = products
    .filter(
      (item) =>
        item.product_id !== selectedProduct?.product_id &&
        item.image !== selectedProduct?.image,
    )
    .slice(0, 4);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsSearchOpen(false);
    setSearchQuery("");
    setViewMode("grid");
    setShowPayment(false);
    setIsProcessing(false);
    setPaymentStatus("idle");
    onOpenChange(false);
  };

  // Add current selected product to cart via Zustand and switch to basket view
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct);
    setViewMode("basket");
  };

  const handleSelectPayment = (method: string) => {
    setSelectedPaymentMethod(method);
    setIsProcessing(true);
    setPaymentStatus("processing");
  };

  const handleDismissSuccess = () => {
    clearCart();
    setPaymentStatus("idle");
    setShowPayment(false);
    setSelectedPaymentMethod(null);
    handleCloseModal();
    router.push("/");
  };

  // Basket item positioning coordinates inside the basket image
  const getBasketItemStyle = (index: number, total: number) => {
    if (total === 1) {
      return {
        top: "34%",
        left: "50%",
        transform: "translate(-50%, -50%) rotate(0deg)",
      };
    }
    if (total === 2) {
      return index === 0
        ? { top: "24%", left: "28%", transform: "rotate(-6deg)" }
        : { bottom: "24%", right: "26%", transform: "rotate(4deg)" };
    }
    if (total === 3) {
      if (index === 0)
        return { top: "18%", left: "27%", transform: "rotate(-6deg)" };
      if (index === 1)
        return { top: "20%", right: "22%", transform: "rotate(4deg)" };
      return { bottom: "22%", left: "34%", transform: "rotate(-2deg)" };
    }
    // 4 or more
    switch (index % 4) {
      case 0:
        return { top: "18%", left: "27%", transform: "rotate(-6deg)" };
      case 1:
        return { top: "18%", right: "22%", transform: "rotate(4deg)" };
      case 2:
        return { bottom: "22%", left: "24%", transform: "rotate(-3deg)" };
      case 3:
      default:
        return { bottom: "20%", right: "22%", transform: "rotate(2deg)" };
    }
  };

  return (
    <BottomSheetModal
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          handleCloseModal();
        }
      }}
      customHeader={
        <div className="flex items-start justify-between mb-4 shrink-0 relative z-20">
          <button
            type="button"
            onClick={() => {
              if (viewMode === "basket") {
                setViewMode("detail");
              } else if (viewMode === "detail") {
                handleCloseModal();
              }
              setIsSearchOpen(false);
            }}
            className="text-left group cursor-pointer"
          >
            <h2 className="text-[17px] leading-[1.15] text-[#838EF8] tracking-[0.08em] uppercase group-hover:text-[#6a76ee] transition-colors whitespace-pre-line">
              {viewMode === "basket"
                ? "SHOPPING\nBASKET"
                : "SHOP FOR\nACCESSORIES"}
            </h2>
            {viewMode !== "grid" && (
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider flex items-center gap-1 mt-1 group-hover:text-[#838EF8]">
                ←{" "}
                {viewMode === "basket"
                  ? "CONTINUE SHOPPING"
                  : "ALL ACCESSORIES"}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            {/* Mini LED Rate Ticker — only on main shop page view */}
            {viewMode === "grid" && (
              <div className="w-20 h-8 bg-[#1A1A1A] rounded-[6px] border border-neutral-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] flex items-center justify-center overflow-hidden shrink-0">
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
            )}
          </div>
        </div>
      }
      scrollable={false}
      className="w-full max-w-[420px] h-[90vh] max-h-[850px] pt-3 pb-8 px-6"
    >
      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar w-full relative">
        <AnimatePresence mode="wait">
          {/* ──────────────── 1. BASKET VIEW ──────────────── */}
          {viewMode === "basket" ? (
            <motion.div
              key="basket-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center w-full min-h-0 relative pb-8"
            >
              {/* Wire Basket Container */}
              <div className="relative w-[280px] h-[370px] sm:w-[300px] sm:h-[390px] mx-auto select-none my-1 flex items-center justify-center">
                {/* Basket PNG (wire frame) */}
                <Image
                  src="/images/basket.png"
                  alt="Shopping Basket"
                  fill
                  priority
                  className="object-contain pointer-events-none z-10"
                />

                {/* Items placed inside basket */}
                <div className="absolute inset-4 z-20 pointer-events-auto">
                  {cartItems.map((item, index) => {
                    const pos = getBasketItemStyle(index, cartItems.length);
                    return (
                      <motion.div
                        key={`basket-item-${item.id}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          type: "spring",
                          damping: 18,
                          stiffness: 260,
                          delay: index * 0.05,
                        }}
                        style={pos as React.CSSProperties}
                        className="absolute w-20 h-22 sm:w-22 sm:h-24 flex items-center justify-center group"
                      >
                        <div className="relative w-full h-full flex items-center justify-center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="88px"
                            className="object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.22)]"
                          />

                          {/* Unavailable stamp if item is out of stock */}
                          {item.unavailable && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-white/95 border border-[#FF2222] px-1.5 py-0.5 rounded-[2px] shadow-xs rotate-[-8deg] z-20 pointer-events-none">
                              <span className="text-[7.5px] text-[#FF2222] font-bold tracking-wider uppercase">
                                ITEM UNAVAILABLE
                              </span>
                            </div>
                          )}

                          {/* Cancel "×" button to remove item from basket */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(item.id);
                            }}
                            aria-label={`Remove ${item.name} from basket`}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white border border-neutral-300 shadow-xs flex items-center justify-center text-[11px] text-neutral-600 hover:bg-red-50 hover:text-red-500 hover:border-red-300 transition-colors cursor-pointer z-30 active:scale-90"
                          >
                            ×
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Empty Basket: Red Stamp "GO FOR A LIL' MORE SHOPPING" */}
                  {cartItems.length === 0 && (
                    <motion.button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-6 z-30 pointer-events-auto cursor-pointer group"
                    >
                      <div className="border-[2px] border-[#FF2222] bg-white/95 px-3 py-1.5 rounded-[3px] shadow-[0_2px_10px_rgba(255,34,34,0.15)] flex items-center justify-center">
                        <span className="text-[12px] sm:text-[13px] font-bold text-[#FF2222] tracking-wider uppercase whitespace-nowrap drop-shadow-[0_0_2px_rgba(255,34,34,0.3)]">
                          GO FOR A LIL&apos; MORE SHOPPING
                        </span>
                      </div>
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Checkout Button (solid blue if items exist, disabled lavender purple if empty) */}
              <button
                type="button"
                disabled={cartItems.length === 0}
                onClick={() => {
                  if (cartItems.length > 0) {
                    setShowPayment(true);
                    onCheckout?.(cartItems);
                  }
                }}
                className={cn(
                  "relative z-10 text-[15px] tracking-wider uppercase px-16 py-4.5 rounded-full transition-all mt-4 mb-6",
                  cartItems.length === 0
                    ? "bg-[#8E95EA] text-white/90 cursor-not-allowed shadow-[0_4px_16px_rgba(142,149,234,0.25)]"
                    : "bg-[#001AFE] hover:bg-[#0014D4] active:scale-95 text-white shadow-[0_6px_24px_rgba(0,26,254,0.35)] cursor-pointer",
                )}
              >
                Checkout
              </button>

              {/* Cart Items List with matching dashed border card & buttons */}
              <div className="flex flex-col gap-3.5 w-full max-w-[340px] mx-auto relative z-10">
                {cartItems.map((item) => (
                  <div
                    key={`list-${item.id}`}
                    className="w-full rounded-[30px] border border-dashed border-[#B8B8B8] bg-white px-5 py-3.5 flex items-center justify-between gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative z-10"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col text-left min-w-0 pr-1">
                      <span className="text-[#3B4BEA] text-[13px] uppercase tracking-wider font-bold leading-tight truncate mb-1">
                        {item.name}
                      </span>
                      <span className="text-[#6366F1] text-[11px] uppercase tracking-wider opacity-90 truncate">
                        {item.description}
                      </span>
                    </div>

                    {/* Minus & Plus quantity buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Minus Button */}
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        aria-label="Decrease quantity"
                        className="w-8 h-8 rounded-full bg-[#E5E7EB] hover:bg-[#D8DBDF] text-[#4B5563] flex items-center justify-center cursor-pointer transition-colors active:scale-95"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        >
                          <line x1="6" y1="12" x2="18" y2="12" />
                        </svg>
                      </button>

                      {/* Plus Button */}
                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        aria-label="Increase quantity"
                        className="w-8 h-8 rounded-full bg-[#5252E8] hover:bg-[#4338CA] text-white flex items-center justify-center cursor-pointer transition-colors active:scale-95 shadow-xs"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        >
                          <line x1="12" y1="6" x2="12" y2="18" />
                          <line x1="6" y1="12" x2="18" y2="12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : selectedProduct && viewMode === "detail" ? (
            /* ──────────────── 2. PRODUCT DETAIL VIEW ──────────────── */
            <motion.div
              key={`detail-${selectedProduct.product_id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center w-full min-h-0"
            >
              {/* Hero 3-Item View (Center Main + Left Clear Variant + Right Clear Variant) */}
              <div className="w-full relative flex items-center justify-center py-6 my-2 overflow-hidden">
                {/* Left: SAME product clear variant peeking from the left edge */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -left-12 sm:-left-8 top-1/2 -translate-y-1/2 w-28 h-28 shrink-0 pointer-events-none select-none z-0"
                >
                  <Image
                    src={selectedProduct.image}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
                  />
                </motion.div>

                {/* Center: Main Product (large, sharp, drop shadow) */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 20, stiffness: 260 }}
                  className="relative w-44 h-44 shrink-0 z-10"
                >
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name || ""}
                    fill
                    sizes="176px"
                    priority
                    className="object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.22)]"
                  />
                </motion.div>

                {/* Right: SAME product clear variant peeking from the right edge */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -right-12 sm:-right-8 top-1/2 -translate-y-1/2 w-28 h-28 shrink-0 pointer-events-none select-none z-0"
                >
                  <Image
                    src={selectedProduct.image}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
                  />
                </motion.div>
              </div>

              {/* Product Name & Description */}
              <div className="flex flex-col items-center gap-1.5 mb-6 text-center">
                <h3 className="text-[#838EF8] text-sm tracking-[0.1em] uppercase">
                  {selectedProduct.name}
                </h3>
                <p className="text-black text-2xl tracking-wider uppercase">
                  {selectedProduct.subtitle || selectedProduct.description || ""}
                </p>
              </div>

              {/* ADD to Cart Button -> takes product into the wire basket via Zustand */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="bg-brand-primary text-white text-sm tracking-wider uppercase px-16 py-4.5 rounded-full shadow-[0_6px_24px_rgba(19,23,228,0.35)] hover:shadow-[0_8px_32px_rgba(19,23,228,0.5)] hover:scale-[1.03] active:scale-95 transition-all cursor-pointer mb-10"
              >
                ADD to Cart
              </button>

              {/* SHOP FOR OTHER ACCESSORIES */}
              <div className="w-full flex flex-col items-center mt-auto pb-4">
                <p className="text-[#838EF8] text-[11px] tracking-[0.12em] uppercase mb-4 text-center">
                  SHOP FOR OTHER
                  <br />
                  ACCESSORIES
                </p>
                <div className="flex items-center justify-center gap-5 w-full">
                  {otherProducts.map((item) => (
                    <button
                      key={item.product_id}
                      type="button"
                      onClick={() => setSelectedProduct(item)}
                      title={item.name}
                      className="relative w-14 h-14 shrink-0 flex items-center justify-center hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                    >
                      <Image
                        src={item.image}
                        alt={item.name || ""}
                        fill
                        sizes="56px"
                        className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.14)]"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* ──────────────── 3. PRODUCT GRID VIEW ──────────────── */
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center w-full min-h-0"
            >
              {/* Products Grid — heavily blurred when search is open */}
              <div
                style={{
                  filter: isSearchOpen ? "blur(10px)" : "none",
                  opacity: isSearchOpen ? 0.35 : 1,
                  transition: "filter 0.3s ease, opacity 0.3s ease",
                }}
                className={`w-full grid grid-cols-2 gap-x-6 gap-y-8 px-1 mb-8 ${
                  isSearchOpen ? "pointer-events-none scale-[0.98]" : ""
                }`}
              >
                {filteredProducts.map((item, index) => (
                  <motion.div
                    key={`${item.product_id}-${index}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    onClick={() => {
                      setSelectedProduct(item);
                      setViewMode("detail");
                    }}
                    className="aspect-square w-full relative flex items-center justify-center group cursor-pointer hover:scale-[1.04] active:scale-95 transition-transform"
                  >
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.name || ""}
                        fill
                        sizes="112px"
                        className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.16)] transition-all duration-300 group-hover:drop-shadow-[0_14px_28px_rgba(0,0,0,0.22)]"
                      />
                    </div>
                  </motion.div>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="col-span-2 py-12 text-center text-sm text-neutral-400">
                    NO ACCESSORIES FOUND
                  </div>
                )}
              </div>

              {/* Search Button under the products (hidden when search is open) */}
              {!isSearchOpen && (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="w-full max-w-[260px] rounded-full border border-dashed border-[#B0B0B0] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-5 py-3 flex items-center justify-center cursor-pointer hover:border-[#838EF8] hover:shadow-[0_4px_16px_rgba(131,142,248,0.12)] transition-all active:scale-[0.98] mb-4"
                >
                  <span className="text-[13px] tracking-wider text-[#838EF8]/80 uppercase">
                    SEARCH ANYTHING
                  </span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Overlay inside the modal */}
      <AnimatePresence>
        {isSearchOpen && viewMode === "grid" && (
          <>
            <motion.div
              key="search-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseSearch}
              className="absolute inset-0 z-30"
            />
            <motion.div
              key="search-floating-bar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              className="absolute top-24 left-4 right-4 z-40 flex justify-center"
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
      {/* ──────────────── FLOATING PAYMENT CARD (Matches media_1790985732678.png) ──────────────── */}
      <AnimatePresence>
        {showPayment && paymentStatus !== "success" && (
          <>
            {/* Subtle backdrop over the basket screen */}
            <motion.div
              key="checkout-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isProcessing) {
                  setShowPayment(false);
                }
              }}
              className="absolute inset-0 z-30 bg-black/25 backdrop-blur-[2px] cursor-pointer"
            />

            {/* Floating Payment Card */}
            <motion.div
              key="checkout-card"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-[92%] max-w-[340px] bg-white rounded-[36px] px-5 pt-3 pb-6 flex flex-col items-center gap-3.5 shadow-[0_16px_50px_rgba(0,0,0,0.22)] border border-neutral-100"
            >
              {/* Drag Handle / Pill */}
              <button
                type="button"
                onClick={() => setShowPayment(false)}
                aria-label="Close"
                className="w-12 h-1 bg-[#8E8E93] rounded-full hover:bg-neutral-600 transition-colors cursor-pointer"
              />

              <AnimatePresence mode="wait">
                {isProcessing ? (
                  /* Processing State */
                  <motion.div
                    key="checkout-processing"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="w-full flex flex-col items-center gap-6 pt-2 pb-2"
                  >
                    <div className="w-full flex items-center justify-between px-3">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-[34px] font-normal leading-none text-black">
                          {getTotalItems()}{" "}
                          {getTotalItems() === 1 ? "item" : "items"}
                        </span>
                        <span className="bg-brand-primary text-white text-[11px] px-3 py-0.5 rounded-full inline-flex items-center justify-center">
                          ₦{getTotalPrice().toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] text-neutral-400 mb-1 text-center">
                          via:
                        </span>
                        <div className="w-18 h-16 rounded-[18px] border border-dashed border-[#D1D5DB] bg-white flex items-center justify-center font-medium text-[13px] text-black text-center whitespace-pre-line shadow-xs rotate-[8deg]">
                          {selectedPaymentMethod || "OPAY"}
                        </div>
                      </div>
                    </div>

                    <div className="w-full max-w-[210px] py-3 rounded-full bg-[#7582EB] text-white text-[13px] tracking-wider flex items-center justify-center gap-0.5 shadow-xs cursor-default select-none">
                      <span>processing</span>
                      <span className="inline-flex">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: i * 0.25,
                            }}
                          >
                            .
                          </motion.span>
                        ))}
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  /* Options State (Matches media_1790985732678.png) */
                  <motion.div
                    key="checkout-options"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full flex flex-col items-center gap-3.5"
                  >
                    {/* Walk-in vs Delivery Toggle */}
                    <div className="flex border border-brand-primary rounded-[10px] p-0.5 bg-white">
                      <button
                        type="button"
                        onClick={() => setCheckoutMode("walk-in")}
                        className={cn(
                          "px-4 py-1 rounded-[8px] text-[11px] tracking-wider transition-all cursor-pointer",
                          checkoutMode === "walk-in"
                            ? "bg-brand-primary text-white"
                            : "text-brand-primary bg-transparent hover:bg-brand-primary/5",
                        )}
                      >
                        WALK-IN
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckoutMode("delivery")}
                        className={cn(
                          "px-4 py-1 rounded-[8px] text-[11px] tracking-wider transition-all cursor-pointer",
                          checkoutMode === "delivery"
                            ? "bg-brand-primary text-white"
                            : "text-brand-primary bg-transparent hover:bg-brand-primary/5",
                        )}
                      >
                        DELIVERY
                      </button>
                    </div>

                    {/* Map Preview for Delivery Mode */}
                    {checkoutMode === "delivery" && (
                      <div className="w-full h-28 rounded-2xl overflow-hidden relative flex items-center justify-center shadow-xs">
                        <Image
                          src="/images/map.jpg"
                          alt="Delivery map"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          className="relative z-10 bg-brand-primary text-white text-[11px] px-5 py-2.5 rounded-[10px] cursor-pointer shadow-md hover:bg-blue-700 transition-colors"
                        >
                          CONFIRM DELIVERY ADDRESS
                        </button>
                      </div>
                    )}

                    {/* Payment Options Label */}
                    <p className="text-[#B5B5B5] text-[11px] tracking-[0.14em] uppercase">
                      PAYMENT OPTIONS
                    </p>

                    {/* Payment Buttons */}
                    {checkoutMode === "delivery" ? (
                      <div className="flex justify-center items-start gap-4 w-full pt-2 pb-4">
                        <button
                          type="button"
                          onClick={() => handleSelectPayment("BANK\nTRANS")}
                          className="w-18 h-16 rounded-[18px] border border-dashed border-[#D1D5DB] bg-white flex items-center justify-center font-medium text-[13px] leading-tight text-black text-center whitespace-pre-line shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:border-brand-primary hover:text-brand-primary transition-all active:scale-95 cursor-pointer -rotate-[13deg]"
                        >
                          {"BANK\nTRANS"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectPayment("CARD")}
                          className="w-18 h-16 rounded-[18px] border border-dashed border-[#D1D5DB] bg-white flex items-center justify-center font-medium text-[13px] leading-tight text-black text-center whitespace-pre-line shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:border-brand-primary hover:text-brand-primary transition-all active:scale-95 cursor-pointer rotate-[13deg] translate-y-7"
                        >
                          CARD
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectPayment("OPAY")}
                          className="w-18 h-16 rounded-[18px] border border-dashed border-[#D1D5DB] bg-white flex items-center justify-center font-medium text-[13px] leading-tight text-black text-center whitespace-pre-line shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:border-brand-primary hover:text-brand-primary transition-all active:scale-95 cursor-pointer rotate-[8deg]"
                        >
                          OPAY
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-5 justify-center items-center">
                          <button
                            type="button"
                            onClick={() => handleSelectPayment("BANK\nTRANS")}
                            className="w-18 h-16 rounded-[18px] border border-dashed border-[#D1D5DB] bg-white flex items-center justify-center font-medium text-[13px] leading-tight text-black text-center whitespace-pre-line shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:border-brand-primary hover:text-brand-primary transition-all active:scale-95 cursor-pointer -rotate-6"
                          >
                            {"BANK\nTRANS"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSelectPayment("OPAY")}
                            className="w-18 h-16 rounded-[18px] border border-dashed border-[#D1D5DB] bg-white flex items-center justify-center font-medium text-[13px] leading-tight text-black text-center whitespace-pre-line shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:border-brand-primary hover:text-brand-primary transition-all active:scale-95 cursor-pointer rotate-6"
                          >
                            OPAY
                          </button>
                        </div>
                        <p className="text-[#B5B5B5] text-xs">OR</p>
                        <button
                          type="button"
                          onClick={() => handleSelectPayment("DEPOT")}
                          className="border border-dashed border-[#B0B0B0] bg-white rounded-full px-8 py-3 text-xs tracking-wider text-black shadow-[0_4px_14px_rgba(0,0,0,0.04)] hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
                        >
                          PAY IN THE DEPOT
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ──────────────── SUCCESS SCREEN OVERLAY ──────────────── */}
      <AnimatePresence>
        {paymentStatus === "success" && (
          <motion.div
            key="checkout-success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleDismissSuccess}
            className="absolute inset-0 z-50 bg-black/40 backdrop-blur-[3px] flex flex-col items-center justify-center select-none cursor-pointer overflow-hidden p-4"
          >
            <div className="flex flex-col items-center justify-center">
              {/* Hand with Zoom-in Animation and 266/354 aspect ratio */}
              <motion.div
                initial={{ scale: 0.15, opacity: 0.3 }}
                animate={{ scale: 2, opacity: 1 }}
                transition={{
                  type: "tween",
                  duration: 0.9,
                }}
                className="relative w-66.5 h-88.5 max-w-full aspect-266/354 flex items-center justify-center -mb-6"
              >
                <img
                  src="/images/success.png"
                  alt="Success"
                  className="object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.45)] pointer-events-none"
                />
              </motion.div>

              {/* Glowing Green TerminalScreenBox directly under the hand */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 20,
                  delay: 0.1,
                }}
                className="relative z-40"
              >
                <TerminalScreenBox
                  value="SUCCESS!!"
                  variant="green"
                  speed={8}
                  className="shadow-[0_4px_24px_rgba(3,255,49,0.5)]"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </BottomSheetModal>
  );
}

export default ShopModal;
