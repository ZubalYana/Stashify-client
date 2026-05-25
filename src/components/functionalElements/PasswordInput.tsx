import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function PasswordInput({ label, placeholder, value, onChange, error }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-white/70">{label}</label>
      )}
      <div className={`flex items-center w-full bg-[#0d0d0d] rounded-xl border 
        transition-colors duration-150
        focus-within:border-[#F07020]/60
        ${error ? "border-red-500/50" : "border-white/10 hover:border-white/20"}`}
      >
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white text-sm px-4 py-3 outline-none placeholder:text-white/20"
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
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}