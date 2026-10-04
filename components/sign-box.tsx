export default function LedSign({
  children,
  hideBlueBand = false,
}: {
  children?: React.ReactNode;
  hideBlueBand?: boolean;
}) {
  return (
    <div className="relative w-214.25 h-60">

      {/* MOUNTING BRACKET ARMS */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        viewBox="0 0 857 240"
        fill="none"
      >
        {/* Left bracket */}
        <path
          d="M 126 240 L 126 137 A 20 20 0 0 1 146 117 L 195 117"
          stroke="#181818"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Right bracket */}
        <path
          d="M 731 240 L 731 137 A 20 20 0 0 0 711 117 L 662 117"
          stroke="#181818"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* BOX (bezel) */}
      <div className="absolute left-[170px] top-[34px] w-[517px] h-[166px] z-10 rounded-[12px] bg-[#222] border-[1.5px] border-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_3px_6px_rgba(0,0,0,0.5)]">
        {/* SCREEN */}
        <div className="absolute left-[18.5px] top-[18.5px] w-[477px] h-[126px] rounded-[18px] bg-[#080202] border border-[#000000] shadow-[inset_0_2px_8px_rgba(0,0,0,0.98)] overflow-hidden flex items-center">
          {children}
        </div>
      </div>

      {/* BLUE BAND */}
      {!hideBlueBand && (
        <div className="absolute bottom-0 left-0 w-full h-[10px] z-20 bg-[#3040d0]" />
      )}
    </div>
  );
}
