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
import { getSession } from "../../utils/session";
import type Project from "../../interfaces/project";

export default function AllSnippets() {
  const [creationMode, setCreationMode] = useState<boolean>(false);
  const [deletingSnippet, setDeletingSnippet] = useState<snippet | null>(null);
  const [editingSnippet, setEditingSnippet] = useState<snippet | null>(null);
  const [snippets, setSnippets] = useState<Array<snippet>>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<snippet | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const { toasts, addToast, removeToast } = useToast();
  const navigate = useNavigate();

  const session = getSession();
  if (!session) {
    navigate("/auth");
    return;
  }
  const { user } = session;

  async function fetchSnippets() {
    try {
      const q = searchText.trim();
      const url = q
        ? `/snippets?user_id=${user.user_id}&q=${encodeURIComponent(q)}`
        : `/snippets?user_id=${user.user_id}`;
      const res = await apiFetch(url, {
        method: "GET",
      });
      const data = await res.json();
      setSnippets(data.snippets);
    } catch {
      addToast({
        type: "error",
        Icon: CircleX,
        text: "Failed to load snippets.",
      });
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchSnippets();
    }, searchText.trim() ? 300 : 0);

    return () => clearTimeout(timeout);
  }, [searchText]);

  useEffect(() => {
    apiFetch(`/projects?user_id=${user.user_id}`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => setProjects(data.projects ?? []))
      .catch(() => {});
  }, []);

  async function deleteSnippet(snippetId: string) {
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

  const hasQuery = searchText.trim().length > 0;

  return (
    <div className="w-full min-w-0 p-4 sm:p-5 lg:p-10 pb-24">
      {snippets.length === 0 && !hasQuery ? (
        <div className="w-full min-h-[60vh] flex justify-center items-center">
          <h3 className="opacity-[0.7] text-center text-pretty px-6 max-w-md">
            No snippets here yet. Ready to create one?
          </h3>
        </div>
      ) : (
        <div>
          <h3 className="text-[22px] sm:text-[24px] lg:text-[20px] font-semibold pr-2">
            All snippets
          </h3>
          <SnippetsSearchbar
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={() => fetchSnippets()}
          />

          {snippets.length === 0 ? (
            <div className="w-full flex justify-center items-center mt-16">
              <h3 className="opacity-[0.7] text-center text-pretty px-6">No snippets match your search.</h3>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 mt-4">
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
                  projectName={
                    snippet.project_id != null
                      ? projects.find((p) => Number(p.id) === Number(snippet.project_id))?.name
                      : undefined
                  }
                  collectionNames={(snippet.collections ?? []).map((c) => c.name)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <NewSnippet onAddNewSnippet={() => setCreationMode(true)} />

      {creationMode && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setCreationMode(false);
          }}
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
            className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm"
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
            className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setEditingSnippet(null);
            }}
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
