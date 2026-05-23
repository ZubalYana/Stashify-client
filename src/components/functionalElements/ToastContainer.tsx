import Alert from "./Alert";
import type { Toast } from "../hooks/useToast"

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-24 right-5 lg:right-10 z-50 flex flex-col gap-2 w-[320px]">
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