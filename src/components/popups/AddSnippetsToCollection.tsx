import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Library } from "lucide-react";
import { apiFetch } from "../../utils/apiFetch";
import type snippet from "../../interfaces/snippet";
import type Collection from "../../interfaces/collection";

interface AddSnippetsToCollectionProps {
  isOpen: boolean;
  collection: Collection;
  onClose: () => void;
  onAdded: (snippet: snippet) => void;
}

export default function AddSnippetsToCollection({
  isOpen,
  collection,
  onClose,
  onAdded,
}: AddSnippetsToCollectionProps) {
  const [snippets, setSnippets] = useState<snippet[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  useEffect(() => {
    if (!isOpen || !user) return;
    setSelected(new Set());
    setLoading(true);

    apiFetch(`/snippets?user_id=${user.user_id}`, { method: "GET" })
      .then((r) => r.json())
      .then((data) => {
        setSnippets(
          (data.snippets ?? []).filter(
            (s: snippet) =>
              !(s.collections ?? []).some(
                (c) => Number(c.id) === Number(collection.id)
              )
          )
        );
      })
      .catch(() => setSnippets([]))
      .finally(() => setLoading(false));
  }, [isOpen, collection.id]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = async () => {
    if (!user || selected.size === 0) return;
    setSaving(true);
    try {
      for (const snippetId of selected) {
        const res = await apiFetch(`/collections/${collection.id}/snippets`, {
          method: "POST",
          body: JSON.stringify({
            snippet_id: snippetId,
            user_id: user.user_id,
          }),
        });
        const data = await res.json();
        onAdded(data.snippet);
      }
      onClose();
    } catch {
      // apiFetch logs
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
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[min(calc(100vw-1.5rem),480px)] max-h-[min(90dvh,720px)] overflow-y-auto bg-[#121212] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-11 h-11 rounded-xl bg-[#F07020]/10 border border-[#F07020]/20 flex items-center justify-center mb-4">
              <Library size={18} className="text-[#F07020]" />
            </div>

            <h3 className="text-white text-[17px] font-semibold tracking-tight mb-1">
              Add snippets
            </h3>
            <p className="text-white/40 text-sm mb-4">
              Add to {collection.name}. This does not move them out of a project
              or other collections.
            </p>

            <div className="max-h-[40vh] overflow-y-auto flex flex-col gap-1.5">
              {loading ? (
                <p className="text-white/30 text-sm py-6 text-center">Loading...</p>
              ) : snippets.length === 0 ? (
                <p className="text-white/30 text-sm py-6 text-center">
                  Every snippet is already in this collection.
                </p>
              ) : (
                snippets.map((s) => (
                  <label
                    key={s.id}
                    className="flex items-center gap-3 bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3 cursor-pointer hover:border-white/10 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(String(s.id))}
                      onChange={() => toggle(String(s.id))}
                      className="accent-[#F07020]"
                    />
                    <span className="flex-1 min-w-0">
                      <span className="block text-white text-sm truncate">{s.title}</span>
                      <span className="block text-white/30 text-[11px] truncate">
                        {(s.collections ?? []).map((c) => c.name).join(", ") ||
                          "Not in a collection"}
                      </span>
                    </span>
                  </label>
                ))
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm text-white/50 hover:text-white/80 border border-white/8 hover:border-white/15 rounded-xl transition-all duration-150 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={saving || selected.size === 0}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#F07020] hover:bg-[#d96418] rounded-xl transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? "Adding..." : "Add"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
