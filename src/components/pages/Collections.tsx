import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Library, Pencil, Trash2, Plus, FileCode } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { apiFetch } from "../../utils/apiFetch";
import { getSession } from "../../utils/session";
import type Collection from "../../interfaces/collection";
import CollectionForm from "../popups/CollectionForm";
import ConfirmDeleting from "../popups/ConfirmDeleting";

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);
  const [deleting, setDeleting] = useState<Collection | null>(null);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const session = getSession();
  if (!session) {
    navigate("/auth");
    return;
  }
  const { user } = session;

  async function fetchCollections() {
    try {
      const res = await apiFetch(`/collections?user_id=${user.user_id}`, {
        method: "GET",
      });
      const data = await res.json();
      setCollections(data.collections ?? []);
    } catch {
      setCollections([]);
    }
  }

  useEffect(() => {
    fetchCollections();
  }, []);

  async function deleteCollection(collection: Collection) {
    try {
      await apiFetch(`/collections/${collection.id}?user_id=${user.user_id}`, {
        method: "DELETE",
      });
      setCollections((prev) => prev.filter((c) => c.id !== collection.id));
      window.dispatchEvent(new Event("stashify-collections-changed"));
    } catch {
      // apiFetch logs
    }
  }

  return (
    <div className="w-full min-w-0 p-4 sm:p-5 lg:p-10 pb-24">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h3 className="text-[22px] sm:text-[24px] lg:text-[20px] font-semibold min-w-0 truncate">Collections</h3>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 px-3 py-2 sm:px-3.5 text-sm font-medium text-white bg-[#F07020] hover:bg-[#d96418] rounded-xl transition-all duration-150 cursor-pointer shrink-0"
        >
          <Plus size={15} strokeWidth={2.5} />
          New collection
        </button>
      </div>

      {collections.length === 0 ? (
        <div className="w-full h-[60vh] flex justify-center items-center">
          <h3 className="opacity-[0.7] text-center text-pretty px-6 max-w-md">
            No collections yet. Group snippets by topic — Auth, Tailwind, hooks.
          </h3>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              onClick={() => navigate(`/collections/${collection.id}`)}
              className="group relative w-full rounded-[16px] overflow-hidden
                         bg-[#1C1C1C] border border-white/[0.06]
                         flex flex-col cursor-pointer p-5"
              whileHover={
                shouldReduceMotion ? {} : { y: -2, borderColor: "rgba(240,112,32,0.18)" }
              }
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#F07020]/10 border border-[#F07020]/20 flex items-center justify-center flex-shrink-0">
                  <Library size={18} className="text-[#F07020]" />
                </div>
                <div
                  className="flex items-center gap-x-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    aria-label="Edit collection"
                    onClick={() => setEditing(collection)}
                    className="p-[6px] rounded-[8px] text-[#B7ADA6]/50 hover:text-white hover:bg-white/[0.06] cursor-pointer"
                  >
                    <Pencil size={14} strokeWidth={1.5} />
                  </button>
                  <button
                    aria-label="Delete collection"
                    onClick={() => setDeleting(collection)}
                    className="p-[6px] rounded-[8px] text-[#B7ADA6]/50 hover:text-red-400 hover:bg-red-400/10 cursor-pointer"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <h3 className="text-[16px] font-semibold text-white leading-snug truncate mb-1">
                {collection.name}
              </h3>
              <p className="text-[12px] text-[#B7ADA6]/70 leading-relaxed line-clamp-2 min-h-[36px]">
                {collection.description || "No description"}
              </p>
              <div className="flex items-center gap-1.5 mt-4 text-[12px] text-white/30">
                <FileCode size={13} strokeWidth={1.5} />
                {collection.snippet_count}{" "}
                {collection.snippet_count === 1 ? "snippet" : "snippets"}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <CollectionForm
        isOpen={creating}
        onClose={() => setCreating(false)}
        onSaved={(collection) => setCollections((prev) => [collection, ...prev])}
      />
      <CollectionForm
        isOpen={editing !== null}
        editing={editing}
        onClose={() => setEditing(null)}
        onSaved={(collection) =>
          setCollections((prev) =>
            prev.map((c) => (c.id === collection.id ? collection : c))
          )
        }
      />
      <ConfirmDeleting
        isOpen={deleting !== null}
        title="Delete collection?"
        message={
          deleting
            ? `"${deleting.name}" will be deleted. Snippets are not deleted — they just leave this collection.`
            : undefined
        }
        onConfirm={() => {
          if (!deleting) return;
          deleteCollection(deleting);
          setDeleting(null);
        }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
