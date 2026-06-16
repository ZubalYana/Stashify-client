import { useState, useEffect } from "react";
import { useToast } from "../hooks/useToast";
import SnippetCard from "../functionalElements/SnippetCard";
import NewSnippet from "../buttons/NewSnippet";
import SnippetCreation from "../popups/SnippetCreation";
import SnippetsSearchbar from "../functionalElements/SnippetsSearchbar";
import SnippetFullView from "../popups/SnippetFullView";
import type snippet from "../../interfaces/snippet";
import { AnimatePresence, motion } from "framer-motion";
import ConfirmDeleting from "../popups/ConfirmDeleting";
import ToastContainer from "../functionalElements/ToastContainer";
import { CheckCircle, CircleCheck, CircleX } from "lucide-react";
import SnippetEditing from "../popups/SnippetEditing";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/apiFetch";

export default function AllSnippets() {
  const [creationMode, setCreationMode] = useState<boolean>(false);
  const [deletingSnippet, setDeletingSnippet] = useState<snippet | null>(null);
  const [editingSnippet, setEditingSnippet] = useState<snippet | null>(null);
  const [snippets, setSnippets] = useState<Array<snippet>>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<snippet | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const { toasts, addToast, removeToast } = useToast();
  const navigate = useNavigate();

  const searchForSnippet = () => {
    console.log("Actively searching for your code snippet...");
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/auth");
  }

  async function fetchSnippets() {
    const res = await apiFetch(`/snippets?user_id=${user.user_id}`, {
      method: "GET",
    });
    const data = await res.json();
    setSnippets(data.snippets);
  }

  useEffect(() => {
    fetchSnippets();
  }, []);

  async function deleteSnippet(snippetId) {
    try {
      await apiFetch(`/snippets/${snippetId}`, { method: "DELETE" });
      setSnippets((prev) => prev.filter((s) => s.id !== snippetId));
      addToast({
        type: "success",
        Icon: CheckCircle,
        text: "Snippet deleted successfully.",
      });
    } catch (error) {
      addToast({
        type: "error",
        Icon: CircleX,
        text: "Failed to delete snippet.",
      });
    }
  }

  return (
    <div className="w-full lg:flex-1 lg:w-auto p-[20px] lg:p-[40px]">
      {snippets.length === 0 ? (
        <div className="w-full h-full flex justify-center items-center">
          <h3 className="opacity-[0.7]">
            No snippets here yet. Ready to create one?
          </h3>
        </div>
      ) : (
        <div>
          <h3 className="text-[24px] lg:text-[20px] font-semibold">
            All snippets
          </h3>
          <SnippetsSearchbar
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={() => searchForSnippet()}
          />

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {snippets.map((snippet) => (
              <SnippetCard
                key={snippet.id}
                title={snippet.title}
                description={snippet.description}
                language={snippet.language}
                code={snippet.code}
                tags={snippet.tags}
                onEdit={() => setEditingSnippet(snippet)}
                onDelete={() => setDeletingSnippet(snippet)}
                onCardClick={() => setSelectedSnippet(snippet)}
              />
            ))}
          </div>
        </div>
      )}

      <NewSnippet onAddNewSnippet={() => setCreationMode(true)} />

      {creationMode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setCreationMode(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <SnippetCreation
              onClose={() => setCreationMode(false)}
              onCreate={(snippet) => {
                addToast({
                  type: "success",
                  text: "Snippet created successfully!",
                  Icon: CheckCircle,
                });
                setSnippets((prev) => [...prev, snippet]);
                setCreationMode(false);
              }}
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedSnippet && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedSnippet(null)}
          >
            <SnippetFullView
              snippet={selectedSnippet}
              onClose={() => setSelectedSnippet(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <ConfirmDeleting
        isOpen={deletingSnippet !== null}
        onConfirm={() => {
          if (!deletingSnippet) return;
          deleteSnippet(deletingSnippet.id);
          setDeletingSnippet(null);
        }}
        onCancel={() => setDeletingSnippet(null)}
        snippetTitle={deletingSnippet?.title}
      />

      <AnimatePresence>
        {editingSnippet && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedSnippet(null)}
          >
            <SnippetEditing
              editingSnippet={editingSnippet}
              onClose={() => setEditingSnippet(null)}
              onEdited={(newSnippet) => {
                setSnippets((prev) =>
                  prev.map((s) => (s.id === newSnippet.id ? newSnippet : s))
                );
                addToast({
                  type: "success",
                  text: "Snippet edited successfully!",
                  Icon: CircleCheck,
                });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
