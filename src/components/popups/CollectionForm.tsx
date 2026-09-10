import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Library } from "lucide-react";
import { apiFetch, waitIfRateLimited } from "../../utils/apiFetch";
import { getStoredUser } from "../../utils/session";
import type Collection from "../../interfaces/collection";

interface CollectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (collection: Collection) => void;
  editing?: Collection | null;
}

export default function CollectionForm({
  isOpen,
  onClose,
  onSaved,
  editing = null,
}: CollectionFormProps) {
  const [name, setName] = useState(editing?.name ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setName(editing?.name ?? "");
    setDescription(editing?.description ?? "");
    setError("");
  }, [isOpen, editing]);

  const user = getStoredUser();

  const resetAndClose = () => {
    setName(editing?.name ?? "");
    setDescription(editing?.description ?? "");
    setError("");
    onClose();
  };

  const handleSave = async () => {
    if (saving) return;
    if (!user || !name.trim()) {
      setError("Collection name is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = editing
        ? await apiFetch(`/collections/${editing.id}`, {
            method: "PATCH",
            body: JSON.stringify({
              name: name.trim(),
              description: description.trim(),
              user_id: user.user_id,
            }),
          })
        : await apiFetch("/collections", {
            method: "POST",
            body: JSON.stringify({
              name: name.trim(),
              description: description.trim() || undefined,
              user_id: user.user_id,
            }),
          });
      const data = await res.json();
      onSaved(data.collection);
      window.dispatchEvent(new Event("stashify-collections-changed"));
      setName("");
      setDescription("");
      onClose();
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Could not save collection"
      );
      await waitIfRateLimited(err);
    } finally {
      setSaving(false);
    }
  };

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
            onClick={resetAndClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[min(calc(100vw-1.5rem),440px)] max-h-[min(90dvh,640px)] overflow-y-auto bg-[#121212] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-11 h-11 rounded-xl bg-[#F07020]/10 border border-[#F07020]/20 flex items-center justify-center mb-4">
              <Library size={18} className="text-[#F07020]" />
            </div>

            <h3 className="text-white text-[17px] font-semibold tracking-tight mb-5">
              {editing ? "Edit collection" : "New collection"}
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-white/40 text-[11px] uppercase tracking-widest font-medium">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Auth, Tailwind, hooks"
                  className="w-full bg-[#0d0d0d] border border-white/8 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#F07020]/50 focus:shadow-[0_0_0_3px_rgba(240,112,32,0.08)] transition-all duration-200 placeholder:text-white/20"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-white/40 text-[11px] uppercase tracking-widest font-medium">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Optional"
                  className="w-full bg-[#0d0d0d] border border-white/8 rounded-lg px-3 py-2 text-white/80 text-sm outline-none focus:border-[#F07020]/50 focus:shadow-[0_0_0_3px_rgba(240,112,32,0.08)] transition-all duration-200 resize-none placeholder:text-white/20"
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={resetAndClose}
                className="flex-1 px-4 py-2.5 text-sm text-white/50 hover:text-white/80 border border-white/8 hover:border-white/15 rounded-xl transition-all duration-150 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !name.trim()}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#F07020] hover:bg-[#d96418] rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : editing ? "Save" : "Create"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
