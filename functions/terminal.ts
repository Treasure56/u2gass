import type { GasStock, Notification, GasOrderDraft } from "@/types";

export function getEffectiveRates(
  stock?: GasStock,
  ratePerKg: number = 1400
) {
  const effectiveRateNaira =
    stock && stock.rate_kobo_per_kg
      ? Math.round(stock.rate_kobo_per_kg / 100)
      : ratePerKg;

  const effectiveRateKobo =
    stock && stock.rate_kobo_per_kg
      ? stock.rate_kobo_per_kg
      : effectiveRateNaira * 100;

  return { effectiveRateNaira, effectiveRateKobo };
}

export function getUnreadNotificationCount(
  notifications?: Notification[],
  fallbackCount: number = 3
): number {
  if (notifications !== undefined) {
    return notifications.filter((n) => !n.read_at).length;
  }
  return fallbackCount;
}

export function calculateGasOrder(
  displayValue: string,
  rateNaira: number,
  rateKobo: number
): GasOrderDraft {
  const currentDigits = displayValue.replace(/[^0-9]/g, "");
  const kg = parseInt(currentDigits, 10) || 0;

  return {
    gas_amount_kg: kg,
    gas_subtotal_kobo: kg * rateKobo,
    rate_at_purchase: rateKobo,
    total_naira: kg * rateNaira,
    display_value: displayValue,
  };
}

export function deleteKeypadDigit(currentValue: string): string {
  const currentDigits = currentValue.replace(/[^0-9]/g, "");
  if (currentDigits.length <= 1) {
    return "0KG";
  }
  return `${currentDigits.slice(0, -1)}KG`;
}

export function appendKeypadDigit(
  currentValue: string,
  digit: string,
  isFirstTyping: boolean = false
): string {
  if (!/^[0-9]$/.test(digit)) return currentValue;

  const currentDigits = currentValue.replace(/[^0-9]/g, "");

  if (isFirstTyping || currentDigits === "0") {
    return `${digit}KG`;
  }

  if (currentDigits.length >= 4) {
    return currentValue;
  }

  return `${currentDigits}${digit}KG`;
}

