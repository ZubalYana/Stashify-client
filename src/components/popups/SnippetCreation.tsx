import { useState } from "react"
import { X, Braces } from "lucide-react"
import PrimaryButton from "../buttons/PrimaryButton"

interface SnippetCreationProps {
  onClose: () => void;
}

export default function SnippetCreation({ onClose }: SnippetCreationProps) {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)

  function handleGenerate() {
    if (!code.trim()) return
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setIsGenerated(true)
    }, 3000)
  }

  return (
    <div className="w-[90vw] max-w-[760px] bg-[#121212] rounded-2xl p-[20px] lg:p-[25px] lg:p-8 border border-white/10">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-[24px] font-medium">Create a new snippet</h2>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white/80 transition-colors duration-150 cursor-pointer"
        >
          <X size={22} />
        </button>
      </div>

      <div className="relative w-full min-h-[200px] bg-[#0d0d0d] rounded-xl overflow-hidden border border-white/5">
        {!code && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
            <Braces size={48} className="text-white/10" />
            <span className="text-white/20 text-sm">Paste your code here</span>
          </div>
        )}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full min-h-[200px] bg-transparent text-white/80 font-mono text-sm p-4 resize-none outline-none z-10 relative"
          spellCheck={false}
        />

        {isLoading && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F07020] to-transparent animate-scan" />
            <div className="absolute left-0 right-0 h-20 bg-gradient-to-b from-[#F07020]/10 to-transparent animate-scan" />
          </div>
        )}
      </div>

      <p className={`text-xs mt-3 h-4 transition-all duration-300 ${
        isLoading ? "text-white/40" : isGenerated ? "text-green-400/80" : "opacity-0"
      }`}>
        {isLoading ? "Analyzing your code..." : isGenerated ? "Summary ready ✓" : ""}
      </p>

      <div className="flex justify-center mt-2">
        <PrimaryButton
          Icon={Braces}
          text={isGenerated ? "Save Snippet" : "Generate Summary"}
          onClick={isGenerated ? onClose : handleGenerate}
        />
      </div>
    </div>
  )
}