import type { LucideIcon } from "lucide-react"
import { X } from "lucide-react"

interface AlertProps {
  Icon: LucideIcon;
  type: "success" | "info" | "error";
  text: string;
  onDismiss?: () => void;
}

const styles = {
  success: "border-green-500/30 bg-green-500/10 text-green-400",
  info:    "border-blue-500/30  bg-blue-500/10  text-blue-400",
  error:   "border-red-500/30   bg-red-500/10   text-red-400",
}

export default function Alert({ Icon, type, text, onDismiss }: AlertProps) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm ${styles[type]}`}>
      <Icon size={18} className="shrink-0" />
      <p className="text-sm font-medium flex-1">{text}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="opacity-50 hover:opacity-100 transition-opacity">
          <X size={16} />
        </button>
      )}
    </div>
  )
}