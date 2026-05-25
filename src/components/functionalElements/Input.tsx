import { useState } from "react"

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function Input({ label, type = "text", value, onChange, error }: InputProps) {
  const [focused, setFocused] = useState(false)
  const floating = focused || value.length > 0

  return (
    <div className="relative w-full">
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`
          peer w-full bg-[#0d0d0d] text-white text-sm px-4 pt-5 pb-2
          rounded-xl border outline-none transition-all duration-200
          placeholder:text-transparent
          ${error
            ? "border-red-500/50"
            : focused
              ? "border-[#F07020]/60"
              : "border-white/10 hover:border-white/20"
          }
        `}
      />
      <label className={`
        absolute left-4 transition-all duration-200 pointer-events-none select-none
        ${floating
          ? "top-1.5 text-[10px] text-[#F07020]/70"
          : "top-3.5 text-sm text-white/30"
        }
      `}>
        {label}
      </label>
      {error && <p className="text-xs text-red-400 mt-1.5 ml-1">{error}</p>}
    </div>
  )
}