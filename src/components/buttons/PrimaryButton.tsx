import type { LucideIcon } from "lucide-react";

interface PrimaryButtonProps {
  Icon?: LucideIcon;
  text: string;
  onClick: () => void;
  size?: "md" | "sm";
  fullWidth?: boolean;
}

const sizes = {
  md: { button: "px-6 py-3 rounded-[16px] gap-x-2", text: "text-[16px]", icon: 20 },
  sm: { button: "px-4 py-2.5 rounded-[12px] gap-x-1.5", text: "text-[14px]", icon: 15 },
}

export default function PrimaryButton({ Icon, text, onClick, size = "md", fullWidth = false }: PrimaryButtonProps) {
  const s = sizes[size]
  return (
    <button
      onClick={onClick}
      className={`
        group ${s.button}
        ${fullWidth ? "w-full justify-center" : ""}
        bg-[#F07020] flex items-center cursor-pointer
        hover:bg-[#FF8533]
        hover:shadow-[0_0_0_6px_rgba(240,112,32,0.15)]
        active:scale-95
        transition-all duration-200 ease-out
      `}
    >
      {Icon && <Icon size={s.icon} className="transition-transform duration-200 group-hover:scale-110" strokeWidth={2.5} />}
      <span className={`font-bold ${s.text} uppercase transition-transform duration-200 group-hover:translate-x-0.5`}>
        {text}
      </span>
    </button>
  )
}