import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Folder, Pencil, Trash2, Plus, FileCode } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { apiFetch } from "../../utils/apiFetch";
import type Project from "../../interfaces/project";
import ProjectForm from "../popups/ProjectForm";
import ConfirmDeleting from "../popups/ConfirmDeleting";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const userRaw = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!token || !userRaw) {
    navigate("/auth");
    return;
  }

  const user = JSON.parse(userRaw);

  async function fetchProjects() {
    try {
      const res = await apiFetch(`/projects?user_id=${user.user_id}`, {
        method: "GET",
      });
      const data = await res.json();
      setProjects(data.projects ?? []);
    } catch {
      setProjects([]);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function deleteProject(project: Project) {
    try {
      await apiFetch(`/projects/${project.id}?user_id=${user.user_id}`, {
        method: "DELETE",
      });
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      window.dispatchEvent(new Event("stashify-projects-changed"));
    } catch {
      // apiFetch logs
    }
  }

  return (
    <div className="w-full lg:flex-1 lg:w-auto p-[20px] lg:p-[40px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[24px] lg:text-[20px] font-semibold">Projects</h3>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-[#F07020] hover:bg-[#d96418] rounded-xl transition-all duration-150 cursor-pointer"
        >
          <Plus size={15} strokeWidth={2.5} />
          New project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="w-full h-[60vh] flex justify-center items-center">
          <h3 className="opacity-[0.7]">No projects yet. Create one to group snippets.</h3>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
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
                  <Folder size={18} className="text-[#F07020]" />
                </div>
                <div
                  className="flex items-center gap-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    aria-label="Edit project"
                    onClick={() => setEditing(project)}
                    className="p-[6px] rounded-[8px] text-[#B7ADA6]/50 hover:text-white hover:bg-white/[0.06] cursor-pointer"
                  >
                    <Pencil size={14} strokeWidth={1.5} />
                  </button>
                  <button
                    aria-label="Delete project"
                    onClick={() => setDeleting(project)}
                    className="p-[6px] rounded-[8px] text-[#B7ADA6]/50 hover:text-red-400 hover:bg-red-400/10 cursor-pointer"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <h3 className="text-[16px] font-semibold text-white leading-snug truncate mb-1">
                {project.name}
              </h3>
              <p className="text-[12px] text-[#B7ADA6]/70 leading-relaxed line-clamp-2 min-h-[36px]">
                {project.description || "No description"}
              </p>
              <div className="flex items-center gap-1.5 mt-4 text-[12px] text-white/30">
                <FileCode size={13} strokeWidth={1.5} />
                {project.snippet_count}{" "}
                {project.snippet_count === 1 ? "snippet" : "snippets"}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ProjectForm
        isOpen={creating}
        onClose={() => setCreating(false)}
        onSaved={(project) => setProjects((prev) => [project, ...prev])}
      />
      <ProjectForm
        isOpen={editing !== null}
        editing={editing}
        onClose={() => setEditing(null)}
        onSaved={(project) =>
          setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)))
        }
      />
      <ConfirmDeleting
        isOpen={deleting !== null}
        title="Delete project?"
        message={
          deleting
            ? `"${deleting.name}" will be deleted. Snippets in it will be unfiled, not deleted.`
            : undefined
        }
        onConfirm={() => {
          if (!deleting) return;
          deleteProject(deleting);
          setDeleting(null);
        }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
