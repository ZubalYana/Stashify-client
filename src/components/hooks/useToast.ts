import { useState, useCallback } from "react"
import type { LucideIcon } from "lucide-react"

export interface Toast {
  id: number;
  Icon: LucideIcon;
  type: "success" | "info" | "error";
  text: string;
}

export function useToast(duration = 3000) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now()
    setToasts(prev => [...prev, { ...toast, id }])
    setTimeout(() => removeToast(id), duration)
  }, [duration])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}