import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function PasswordInput({ label, value, onChange, error }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  const [focused, setFocused] = useState(false)
  const floating = focused || value.length > 0

  return (
    <div className="relative w-full">
      <div className={`
        flex items-center w-full bg-[#0d0d0d] rounded-xl border
        transition-all duration-200
        ${error
          ? "border-red-500/50"
          : focused
            ? "border-[#F07020]/60"
            : "border-white/10 hover:border-white/20"
        }
      `}>
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-white text-sm px-4 pt-5 pb-2 outline-none placeholder:text-transparent"
        />
        <button
          type="button"
          onClick={() => setVisible(prev => !prev)}
          className="pr-4 text-white/30 hover:text-white/70 transition-colors duration-150"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
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