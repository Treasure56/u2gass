const KNOWN_TITLE_ALIASES: Record<string, string> = {
  "u2 gas cylinder": "U2 Power Cylinder",
  "u2 power hose": "U2 Power Hose",
  "u2 ignition battery": "U2 Ignition Battery",
  "u2 hose clamps": "U2 Hose Clamps",
};

const KNOWN_VARIANT_ALIASES: Record<string, string> = {
  "6kg": "MEDIUM",
  "12.5kg": "BIG",
  "3kg": "SMALL",
};

// Format product title with title-casing and prototype fallback
export function formatItemTitle(name?: string | null): string {
  if (!name) return "U2 Accessory";
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();

  if (KNOWN_TITLE_ALIASES[lower]) {
    return KNOWN_TITLE_ALIASES[lower];
  }

  return trimmed.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
}

// Format variant size label with uppercase and prototype fallback
export function formatItemVariant(desc?: string | null): string {
  if (!desc) return "STANDARD";
  const trimmed = desc.trim();
  const lower = trimmed.toLowerCase();

  if (KNOWN_VARIANT_ALIASES[lower]) {
    return KNOWN_VARIANT_ALIASES[lower];
  }

  return trimmed.toUpperCase();
}
