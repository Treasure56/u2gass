"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import type { Product } from "@/types";
import { products } from "@/data";
import { useCartStore, type CartItem } from "@/stores/cartStore";
import BottomSheetModal from "@/components/ui/BottomSheetModal";
import {
  ShopHeader,
  ShopBasketView,
  ShopProductDetail,
  ShopGridView,
  ShopPaymentOverlay,
} from "./shop";

export type ShopModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProduct?: Product | null;
  /** Backwards compatibility alias for initialProduct */
  initialItem?: Product | null;
  onCheckout?: (cart: CartItem[]) => void;
};

export type ViewMode = "grid" | "detail" | "basket";

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

  // Cart Store
  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addToCart);
  const clearCart = useCartStore((state) => state.clearCart);

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

  // Payment processing timer (2.4s)
  useEffect(() => {
    if (isProcessing) {
      const timer = setTimeout(() => {
        setIsProcessing(false);
        setPaymentStatus("success");
      }, 2400);

      return () => clearTimeout(timer);
    }
  }, [isProcessing]);

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

  const handleBackHeader = () => {
    if (viewMode === "basket") {
      setViewMode(selectedProduct ? "detail" : "grid");
    } else if (viewMode === "detail") {
      handleCloseModal();
    }
    setIsSearchOpen(false);
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
        <ShopHeader viewMode={viewMode} onBack={handleBackHeader} />
      }
      scrollable={false}
      className="w-full max-w-[420px] h-[90vh] max-h-[850px] pt-3 pb-8 px-6"
    >
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar w-full relative">
        <AnimatePresence mode="wait">
          {viewMode === "basket" ? (
            <ShopBasketView
              onGoShopping={() => setViewMode("grid")}
              onCheckout={() => {
                setShowPayment(true);
                onCheckout?.(cartItems);
              }}
            />
          ) : selectedProduct && viewMode === "detail" ? (
            <ShopProductDetail
              selectedProduct={selectedProduct}
              onSelectProduct={setSelectedProduct}
              onAddToCart={handleAddToCart}
            />
          ) : (
            <ShopGridView
              products={products}
              onSelectProduct={(item) => {
                setSelectedProduct(item);
                setViewMode("detail");
              }}
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onCloseSearch={handleCloseSearch}
              inputRef={inputRef}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Floating Checkout & Payment Options Overlay */}
      <ShopPaymentOverlay
        showPayment={showPayment}
        onClosePayment={() => setShowPayment(false)}
        checkoutMode={checkoutMode}
        setCheckoutMode={setCheckoutMode}
        selectedPaymentMethod={selectedPaymentMethod}
        onSelectPayment={handleSelectPayment}
        isProcessing={isProcessing}
        paymentStatus={paymentStatus}
        onDismissSuccess={handleDismissSuccess}
      />
    </BottomSheetModal>
  );
}

export default ShopModal;
