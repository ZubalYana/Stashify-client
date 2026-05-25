interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function Input({ label, placeholder, value, onChange, error }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-white/70">{label}</label>
      )}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-[#0d0d0d] text-white text-sm px-4 py-3 rounded-xl border outline-none 
          transition-colors duration-150 placeholder:text-white/20
          focus:border-[#F07020]/60
          ${error ? "border-red-500/50" : "border-white/10 hover:border-white/20"}`}
      />
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}