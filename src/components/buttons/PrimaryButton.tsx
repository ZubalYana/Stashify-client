import type { LucideIcon } from "lucide-react"

interface PrimaryButtonProps {
  Icon: LucideIcon;
  text: string;
  onClick: () => void;
}

export default function PrimaryButton({ Icon, text, onClick }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        group
        px-6 py-3 rounded-[16px] bg-[#F07020]
        flex items-center gap-x-2 cursor-pointer
        hover:bg-[#FF8533]
        hover:shadow-[0_0_0_6px_rgba(240,112,32,0.15)]
        active:scale-95
        transition-all duration-200 ease-out
      "
    >
      <Icon
        className="transition-transform duration-200 scale-80 group-hover:scale-90"
        strokeWidth={2.5}
      />
      <span className="font-bold text-[16px] uppercase transition-transform duration-200 group-hover:translate-x-0.5">
        {text}
      </span>
    </button>
  )
}