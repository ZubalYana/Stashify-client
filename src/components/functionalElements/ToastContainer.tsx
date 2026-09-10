import Alert from "./Alert";
import type { Toast } from "../hooks/useToast"

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-[calc(4.5rem+env(safe-area-inset-top))] lg:top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[min(92vw,480px)] items-center">
      {toasts.map(toast => (
        <Alert
          key={toast.id}
          Icon={toast.Icon}
          type={toast.type}
          text={toast.text}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </div>
  )
}