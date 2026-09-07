import WordMarkLogo from "../WordmarkLogo";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Menu,
  Boxes,
  BrainCircuit,
  Library,
  ChevronRight,
  Folder,
  Plus,
  User,
  Settings,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import MobileNav from "../popups/MobileNav";
import { apiFetch } from "../../utils/apiFetch";
import type Project from "../../interfaces/project";
import type Collection from "../../interfaces/collection";
import ProjectForm from "../popups/ProjectForm";
import CollectionForm from "../popups/CollectionForm";

interface NavItem {
  title: string;
  to?: string;
  icon: React.ReactNode;
}

const chevronVariants = {
  closed: { rotate: 0 },
  open: { rotate: 90 },
};

interface CollapsibleSectionProps {
  label: string;
  labelTo?: string;
  icon: React.ReactNode;
  items: NavItem[];
  addLabel: string;
  onAdd?: () => void;
  shouldReduceMotion: boolean | null;
  disabled?: boolean;
}

function CollapsibleSection({
  label,
  labelTo,
  icon,
  items,
  addLabel,
  onAdd,
  shouldReduceMotion,
  disabled,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        className={`w-full flex items-center justify-between text-[14px] font-normal
                   text-[#B7ADA6] hover:text-white rounded-[12px] px-3 py-2
                   hover:bg-white/[0.04]
                   transition-colors duration-150
                   ${
                     disabled
                       ? "opacity-40 cursor-not-allowed pointer-events-none"
                       : ""
                   }`}
      >
        {labelTo ? (
          <NavLink
            to={labelTo}
            end
            className={({ isActive }) =>
              `flex items-center gap-x-2 flex-1 min-w-0 ${isActive ? "text-white" : ""}`
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-x-2 flex-1 min-w-0 cursor-pointer text-left"
          >
            {icon}
            <span>{label}</span>
          </button>
        )}
        {disabled ? (
          <span className="text-[10px] font-medium text-[#F07020] bg-[#F07020]/10 border border-[#F07020]/20 rounded-md px-1.5 py-0.5">
            Soon
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-0.5 cursor-pointer"
          >
            <motion.span
              variants={chevronVariants}
              animate={isOpen ? "open" : "closed"}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="text-[#B7ADA6] block"
            >
              <ChevronRight strokeWidth={1} size={16} />
            </motion.span>
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden"
          >
            <div className="flex pl-[14px] pt-2 pb-1 gap-x-3">
              <motion.div className="w-[1.5px] rounded-full bg-[#F07020] self-stretch flex-shrink-0" />

              <div className="flex flex-col gap-y-[2px] flex-1 min-w-0">
                {items.map((item, index) =>
                  item.to ? (
                    <NavLink key={item.to} to={item.to}>
                      {({ isActive }) => (
                        <motion.div
                          className={`w-full flex items-center gap-x-2 text-[13px] font-normal
                                     rounded-[10px] px-2 py-[7px]
                                     transition-colors duration-150 cursor-pointer text-left
                                     ${
                                       isActive
                                         ? "text-white bg-white/[0.06]"
                                         : "text-[#B7ADA6] hover:text-white hover:bg-white/[0.04]"
                                     }`}
                          whileHover={shouldReduceMotion ? {} : { x: 2 }}
                          transition={{ duration: 0.15 }}
                        >
                          <span className="flex-shrink-0 opacity-70">
                            {item.icon}
                          </span>
                          <span className="truncate">{item.title}</span>
                        </motion.div>
                      )}
                    </NavLink>
                  ) : (
                    <motion.button
                      key={index}
                      className="w-full flex items-center gap-x-2 text-[13px] font-normal
                                 text-[#B7ADA6] hover:text-white rounded-[10px] px-2 py-[7px]
                                 hover:bg-white/[0.04] active:bg-white/[0.06]
                                 transition-colors duration-150 cursor-pointer text-left"
                      whileHover={shouldReduceMotion ? {} : { x: 2 }}
                      transition={{ duration: 0.15 }}
                    >
                      <span className="flex-shrink-0 opacity-70">
                        {item.icon}
                      </span>
                      <span className="truncate">{item.title}</span>
                    </motion.button>
                  )
                )}

                <motion.button
                  onClick={onAdd}
                  className="flex items-center gap-x-[6px] text-[12px] font-medium
                             text-[#F07020]/70 hover:text-[#F07020] px-2 py-[6px] mt-1
                             transition-colors duration-150 cursor-pointer"
                >
                  <Plus size={13} strokeWidth={2} />
                  {addLabel}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SideMenu() {
  const shouldReduceMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [creatingProject, setCreatingProject] = useState(false);
  const [creatingCollection, setCreatingCollection] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;
    const user = JSON.parse(raw);
    const loadProjects = () => {
      apiFetch(`/projects?user_id=${user.user_id}`, { method: "GET" })
        .then((res) => res.json())
        .then((data) => setProjects(data.projects ?? []))
        .catch(() => setProjects([]));
    };
    const loadCollections = () => {
      apiFetch(`/collections?user_id=${user.user_id}`, { method: "GET" })
        .then((res) => res.json())
        .then((data) => setCollections(data.collections ?? []))
        .catch(() => setCollections([]));
    };
    loadProjects();
    loadCollections();
    window.addEventListener("stashify-projects-changed", loadProjects);
    window.addEventListener("stashify-collections-changed", loadCollections);
    return () => {
      window.removeEventListener("stashify-projects-changed", loadProjects);
      window.removeEventListener("stashify-collections-changed", loadCollections);
    };
  }, [location.pathname]);

  const projectItems: NavItem[] = projects.map((project) => ({
    title: project.name,
    to: `/projects/${project.id}`,
    icon: <Folder size={15} strokeWidth={1} />,
  }));

  const collectionItems: NavItem[] = collections.map((collection) => ({
    title: collection.name,
    to: `/collections/${collection.id}`,
    icon: <Library size={15} strokeWidth={1} />,
  }));

  return (
    <div className="lg:h-full lg:shrink-0">
      <header
        className="flex lg:hidden fixed top-0 left-0 right-0 z-30
                   min-h-14 items-center justify-between
                   px-4 pt-[env(safe-area-inset-top)]
                   bg-[#171717]/92 backdrop-blur-md
                   border-b border-white/[0.06]"
      >
        <WordMarkLogo size="xs" />
        <motion.button
          aria-label="Open navigation"
          className="p-[7px] rounded-[10px] text-[#B7ADA6]
                     hover:text-white hover:bg-white/[0.06]
                     transition-colors duration-150 cursor-pointer"
          onClick={() => setMobileOpen(true)}
          whileTap={shouldReduceMotion ? {} : { scale: 0.92 }}
        >
          <Menu size={20} strokeWidth={1.5} />
        </motion.button>
      </header>

      <div
        className="w-[240px] h-full bg-[#171717] border-r border-[#B7ADA6]/10
                hidden lg:flex flex-col lg:px-[18px] lg:py-[28px]"
      >
        <div className="px-1 mb-8">
          <WordMarkLogo size="sm" />
        </div>

        <nav className="flex flex-col gap-y-2 flex-1 min-h-0 overflow-y-auto nav-scroll">
          <NavLink to="/">
            {({ isActive }) => (
              <motion.div
                className={`w-full flex items-center gap-x-2 text-[14px] rounded-[12px] px-3 py-2 cursor-pointer
        ${
          isActive
            ? "text-white bg-white/[0.06]"
            : "text-[#B7ADA6] hover:text-white hover:bg-white/[0.04]"
        }`}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              >
                <Boxes size={16} strokeWidth={1} />
                All Snippets
              </motion.div>
            )}
          </NavLink>
          <CollapsibleSection
            label="Projects"
            labelTo="/projects"
            icon={<BrainCircuit size={16} strokeWidth={1} />}
            items={projectItems}
            addLabel="Add new project"
            onAdd={() => setCreatingProject(true)}
            shouldReduceMotion={shouldReduceMotion}
          />
          <CollapsibleSection
            label="Collections"
            labelTo="/collections"
            icon={<Library size={16} strokeWidth={1} />}
            items={collectionItems}
            addLabel="Add new collection"
            onAdd={() => setCreatingCollection(true)}
            shouldReduceMotion={shouldReduceMotion}
          />
        </nav>
        <div className="flex flex-col gap-y-[2px] pt-4 border-t border-white/[0.05]">
          <NavLink to="/profile">
            <motion.button
              className="w-full flex items-center gap-x-2 text-[13px] font-normal
                       text-[#B7ADA6] hover:text-white rounded-[12px] px-3 py-2
                       hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer"
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            >
              <User size={16} strokeWidth={1} />
              Profile
            </motion.button>
          </NavLink>
          <motion.button
            className="w-full flex items-center gap-x-2 text-[13px] font-normal
                       text-[#B7ADA6] hover:text-white rounded-[12px] px-3 py-2
                       hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer"
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          >
            <Settings size={16} strokeWidth={1} />
            Settings
          </motion.button>
        </div>
      </div>
      <div className="flex lg:hidden">
        <MobileNav
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          projectItems={projectItems}
          collectionItems={collectionItems}
          onAddProject={() => {
            setMobileOpen(false);
            setCreatingProject(true);
          }}
          onAddCollection={() => {
            setMobileOpen(false);
            setCreatingCollection(true);
          }}
        />
      </div>
      <ProjectForm
        isOpen={creatingProject}
        onClose={() => setCreatingProject(false)}
        onSaved={(project) => {
          setProjects((prev) => [project, ...prev]);
          navigate(`/projects/${project.id}`);
        }}
      />
      <CollectionForm
        isOpen={creatingCollection}
        onClose={() => setCreatingCollection(false)}
        onSaved={(collection) => {
          setCollections((prev) => [collection, ...prev]);
          navigate(`/collections/${collection.id}`);
        }}
      />
    </div>
  );
}
