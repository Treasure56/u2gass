import ShopCard from "@/components/home/ShopCard";
import type { Product } from "@/types";
import { products } from "@/data";

type AccessoriesSectionProps = {
  items?: Product[];
  onSelectAccessory?: (item: Product) => void;
  className?: string;
};

export default function ShopSection({
  items = products,
  onSelectAccessory,
  className = "",
}: AccessoriesSectionProps) {
  return (
    <section className={`w-full flex flex-col items-center ${className}`}>
      <h2 className="text-2xl text-[#838EF8] tracking-[0.14em] uppercase mb-3 text-center">
        SHOP FOR ACCESSORIES
      </h2>

      <div className="w-full relative rounded-[64px] p-8">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          fill="none"
        >
          <rect
            x="0.5"
            y="0.5"
            width="99.7%"
            height="99.7%"
            rx="64"
            stroke="#1E1E1E"
            strokeWidth="1"
            strokeDasharray="10 16"
          />
        </svg>
        <div className="grid grid-cols-2 gap-4">
          {items.map((item, i) => (
            <ShopCard
              key={i}
              item={item}
              onSelect={onSelectAccessory}
              bgColor={item.bgColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
