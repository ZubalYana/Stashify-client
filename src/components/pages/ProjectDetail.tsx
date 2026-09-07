import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, FolderInput, CheckCircle, CircleCheck, CircleX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { apiFetch } from "../../utils/apiFetch";
import type Project from "../../interfaces/project";
import type snippet from "../../interfaces/snippet";
import SnippetCard from "../functionalElements/SnippetCard";
import NewSnippet from "../buttons/NewSnippet";
import SnippetCreation from "../popups/SnippetCreation";
import SnippetsSearchbar from "../functionalElements/SnippetsSearchbar";
import SnippetFullView from "../popups/SnippetFullView";
import ConfirmDeleting from "../popups/ConfirmDeleting";
import SnippetEditing from "../popups/SnippetEditing";
import ToastContainer from "../functionalElements/ToastContainer";
import { useToast } from "../hooks/useToast";
import ProjectForm from "../popups/ProjectForm";
import AddSnippetsToProject from "../popups/AddSnippetsToProject";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [snippets, setSnippets] = useState<snippet[]>([]);
  const [searchText, setSearchText] = useState("");
  const [creationMode, setCreationMode] = useState(false);
  const [addingExisting, setAddingExisting] = useState(false);
  const [editingProject, setEditingProject] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);
  const [deletingSnippet, setDeletingSnippet] = useState<snippet | null>(null);
  const [editingSnippet, setEditingSnippet] = useState<snippet | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState<snippet | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const userRaw = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!token || !userRaw) {
    navigate("/auth");
    return;
  }

  const user = JSON.parse(userRaw);

  async function fetchProject() {
    try {
      const res = await apiFetch(`/projects/${id}?user_id=${user.user_id}`, {
        method: "GET",
      });
      const data = await res.json();
      setProject(data.project);
    } catch {
      navigate("/projects");
    }
  }

  async function fetchSnippets() {
    if (!id) return;
    try {
      const q = searchText.trim();
      const url = q
        ? `/snippets?user_id=${user.user_id}&project_id=${id}&q=${encodeURIComponent(q)}`
        : `/snippets?user_id=${user.user_id}&project_id=${id}`;
      const res = await apiFetch(url, { method: "GET" });
      const data = await res.json();
      setSnippets(data.snippets ?? []);
    } catch {
      addToast({
        type: "error",
        Icon: CircleX,
        text: "Failed to load snippets.",
      });
    }
  }

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchSnippets();
    }, searchText.trim() ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [searchText, id]);

  async function deleteSnippet(snippetId: string) {
    try {
      await apiFetch(`/snippets/${snippetId}`, { method: "DELETE" });
      setSnippets((prev) => prev.filter((s) => s.id !== snippetId));
      setProject((prev) =>
        prev ? { ...prev, snippet_count: Math.max(0, prev.snippet_count - 1) } : prev
      );
      addToast({
        type: "success",
        Icon: CheckCircle,
        text: "Snippet deleted successfully.",
      });
    } catch {
      addToast({
        type: "error",
        Icon: CircleX,
        text: "Failed to delete snippet.",
      });
    }
  }

  async function unfileSnippet(snippet: snippet) {
    try {
      await apiFetch(
        `/projects/${id}/snippets/${snippet.id}?user_id=${user.user_id}`,
        { method: "DELETE" }
      );
      setSnippets((prev) => prev.filter((s) => s.id !== snippet.id));
      setProject((prev) =>
        prev ? { ...prev, snippet_count: Math.max(0, prev.snippet_count - 1) } : prev
      );
      addToast({
        type: "success",
        Icon: CheckCircle,
        text: "Snippet unfiled.",
      });
    } catch {
      addToast({
        type: "error",
        Icon: CircleX,
        text: "Failed to unfile snippet.",
      });
    }
  }

  async function handleDeleteProject() {
    try {
      await apiFetch(`/projects/${id}?user_id=${user.user_id}`, {
        method: "DELETE",
      });
      window.dispatchEvent(new Event("stashify-projects-changed"));
      navigate("/projects");
    } catch {
      addToast({
        type: "error",
        Icon: CircleX,
        text: "Failed to delete project.",
      });
    }
  }

  const hasQuery = searchText.trim().length > 0;

  if (!project) {
    return (
      <div className="w-full lg:flex-1 p-[20px] lg:p-[40px]">
        <p className="text-white/40 text-sm">Loading project...</p>
      </div>
    );
  }

  return (
    <div className="w-full lg:flex-1 lg:w-auto p-[20px] lg:p-[40px]">
      <button
        onClick={() => navigate("/projects")}
        className="flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-5 cursor-pointer transition-colors"
      >
        <ArrowLeft size={15} />
        Projects
      </button>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h3 className="text-[24px] lg:text-[20px] font-semibold truncate">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-white/40 text-sm mt-1">{project.description}</p>
          )}
          <p className="text-white/25 text-xs mt-2">
            {project.snippet_count}{" "}
            {project.snippet_count === 1 ? "snippet" : "snippets"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setAddingExisting(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-white/60 hover:text-white border border-white/8 hover:border-white/15 rounded-xl transition-all duration-150 cursor-pointer"
          >
            <FolderInput size={14} />
            Add snippets
          </button>
          <button
            onClick={() => setEditingProject(true)}
            className="p-2 text-white/40 hover:text-white border border-white/8 hover:border-white/15 rounded-xl cursor-pointer"
            aria-label="Edit project"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setDeletingProject(true)}
            className="p-2 text-white/40 hover:text-red-400 border border-white/8 hover:border-red-400/20 rounded-xl cursor-pointer"
            aria-label="Delete project"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <SnippetsSearchbar
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onSearch={() => fetchSnippets()}
      />

      {snippets.length === 0 ? (
        <div className="w-full flex justify-center items-center mt-16">
          <h3 className="opacity-[0.7]">
            {hasQuery
              ? "No snippets match your search."
              : "No snippets in this project yet."}
          </h3>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {snippets.map((s) => (
            <SnippetCard
              key={s.id}
              title={s.title}
              description={s.description}
              language={s.language}
              code={s.code}
              tags={s.tags}
              collectionNames={(s.collections ?? []).map((c) => c.name)}
              onEdit={() => setEditingSnippet(s)}
              onDelete={() => setDeletingSnippet(s)}
              onUnfile={() => unfileSnippet(s)}
              onCardClick={() => setSelectedSnippet(s)}
            />
          ))}
        </div>
      )}

      <NewSnippet onAddNewSnippet={() => setCreationMode(true)} />

      {creationMode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setCreationMode(false);
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <SnippetCreation
              defaultProjectId={Number(id)}
              onClose={() => setCreationMode(false)}
              onCreate={(created) => {
                addToast({
                  type: "success",
                  text: "Snippet created successfully!",
                  Icon: CheckCircle,
                });
                setSnippets((prev) => [...prev, created]);
                setProject((prev) =>
                  prev ? { ...prev, snippet_count: prev.snippet_count + 1 } : prev
                );
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

      <ConfirmDeleting
        isOpen={deletingProject}
        title="Delete project?"
        message={`"${project.name}" will be deleted. Snippets in it will be unfiled, not deleted.`}
        onConfirm={() => {
          setDeletingProject(false);
          handleDeleteProject();
        }}
        onCancel={() => setDeletingProject(false)}
      />

      <ProjectForm
        isOpen={editingProject}
        editing={project}
        onClose={() => setEditingProject(false)}
        onSaved={(updated) => setProject(updated)}
      />

      <AddSnippetsToProject
        isOpen={addingExisting}
        project={project}
        onClose={() => setAddingExisting(false)}
        onAdded={(added) => {
          setSnippets((prev) =>
            prev.some((s) => s.id === added.id) ? prev : [...prev, added]
          );
          setProject((prev) =>
            prev ? { ...prev, snippet_count: prev.snippet_count + 1 } : prev
          );
        }}
      />

      <AnimatePresence>
        {editingSnippet && (
          <motion.div
            key="edit-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setEditingSnippet(null);
            }}
          >
            <SnippetEditing
              editingSnippet={editingSnippet}
              onClose={() => setEditingSnippet(null)}
              onEdited={(newSnippet) => {
                if (Number(newSnippet.project_id) !== Number(id)) {
                  setSnippets((prev) => prev.filter((s) => s.id !== newSnippet.id));
                  setProject((prev) =>
                    prev
                      ? { ...prev, snippet_count: Math.max(0, prev.snippet_count - 1) }
                      : prev
                  );
                } else {
                  setSnippets((prev) =>
                    prev.map((s) => (s.id === newSnippet.id ? newSnippet : s))
                  );
                }
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
