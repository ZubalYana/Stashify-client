import { Search } from "lucide-react"
import { useState } from "react"

interface SnippetsSearchbarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

export default function SnippetsSearchbar({ value, onChange, onSearch }: SnippetsSearchbarProps) {
  const [focused, setFocused] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch()
  }

  return (
    <div className={`
      flex items-center gap-x-2 mt-4
      w-full max-w-[480px]
      bg-[#0d0d0d] rounded-xl border px-4 py-2.5
      transition-all duration-300
      ${focused
        ? "border-[#F07020]/60 shadow-[0_0_0_4px_rgba(240,112,32,0.08)]"
        : "border-white/10 hover:border-white/20"
      }
    `}>
      <Search
        size={16}
        className={`shrink-0 transition-colors duration-300 ${focused ? "text-[#F07020]/70" : "text-white/20"}`}
      />
      <input
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder="Search snippets..."
        className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/25"
      />
      {value.length > 0 && (
        <button
          onClick={onSearch}
          className="
            shrink-0 text-[11px] font-semibold uppercase tracking-wider
            text-[#F07020]/60 hover:text-[#F07020]
            transition-colors duration-150
          "
        >
          Search
        </button>
      )}
    </div>
  )
}