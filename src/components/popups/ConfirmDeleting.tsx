import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";

interface ConfirmDeletingProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  snippetTitle?: string;
}

export default function ConfirmDeleting({
  isOpen,
  onConfirm,
  onCancel,
  snippetTitle,
}: ConfirmDeletingProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onCancel}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[min(90vw,420px)] bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <Trash2 size={18} className="text-red-400" />
            </div>

            <h3 className="text-white text-[17px] font-semibold tracking-tight mb-1">
              Delete snippet?
            </h3>
            <p className="text-white/40 text-sm leading-relaxed">
              {snippetTitle ? (
                <>
                  <span className="text-white/60">"{snippetTitle}"</span> will
                  be permanently deleted. This can't be undone.
                </>
              ) : (
                "This snippet will be permanently deleted. This can't be undone."
              )}
            </p>

            <div className="flex gap-2 mt-6">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 text-sm text-white/50 hover:text-white/80 border border-white/8 hover:border-white/15 rounded-xl transition-all duration-150 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500/80 hover:bg-red-500 rounded-xl transition-all duration-150 cursor-pointer shadow-[0_0_16px_rgba(239,68,68,0.2)] hover:shadow-[0_0_22px_rgba(239,68,68,0.35)]"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}