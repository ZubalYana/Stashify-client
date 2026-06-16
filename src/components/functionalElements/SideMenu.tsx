import WordMarkLogo from "../WordmarkLogo";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Menu,
  Boxes,
  BrainCircuit,
  Library,
  ChevronRight,
  CircuitBoard,
  Radiation,
  ChartBarIncreasing,
  Plus,
  User,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import MobileNav from "../popups/MobileNav";

interface NavItem {
  title: string;
  icon: React.ReactNode;
}

const chevronVariants = {
  closed: { rotate: 0 },
  open: { rotate: 90 },
};

interface CollapsibleSectionProps {
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
  addLabel: string;
  shouldReduceMotion: boolean | null;
  disabled?: boolean;
}

function CollapsibleSection({
  label,
  icon,
  items,
  addLabel,
  shouldReduceMotion,
  disabled,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <motion.button
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-[14px] font-normal
                   text-[#B7ADA6] hover:text-white rounded-[12px] px-3 py-2
                   hover:bg-white/[0.04] active:bg-white/[0.06]
                   transition-colors duration-150 cursor-pointer
                   ${
                     disabled
                       ? "opacity-40 cursor-not-allowed pointer-events-none"
                       : ""
                   }`}
        whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
      >
        <div className="flex items-center gap-x-2">
          {icon}
          <span>{label}</span>
        </div>
        {disabled ? (
          <span className="text-[10px] font-medium text-[#F07020] bg-[#F07020]/10 border border-[#F07020]/20 rounded-md px-1.5 py-0.5">
            Soon
          </span>
        ) : (
          <motion.span
            variants={chevronVariants}
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="text-[#B7ADA6]"
          >
            <ChevronRight strokeWidth={1} size={16} />
          </motion.span>
        )}
      </motion.button>

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
                {items.map((item, index) => (
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
                ))}

                <motion.button
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

  const placeholderProjects: NavItem[] = [
    { title: "Project 1", icon: <CircuitBoard size={15} strokeWidth={1} /> },
    { title: "Project 2", icon: <Radiation size={15} strokeWidth={1} /> },
    {
      title: "Project 3",
      icon: <ChartBarIncreasing size={15} strokeWidth={1} />,
    },
  ];

  const placeholderCollections: NavItem[] = [
    { title: "Auth snippets", icon: <Library size={15} strokeWidth={1} /> },
    { title: "Risky features", icon: <Radiation size={15} strokeWidth={1} /> },
    {
      title: "Custom loaders",
      icon: <CircuitBoard size={15} strokeWidth={1} />,
    },
  ];

  return (
    <div>
      <div
        className="w-[240px] h-screen bg-[#171717] border-r border-[#B7ADA6]/10
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
          <NavLink to="/projects">
            <CollapsibleSection
              label="Projects"
              icon={<BrainCircuit size={16} strokeWidth={1} />}
              items={placeholderProjects}
              addLabel="Add new project"
              shouldReduceMotion={shouldReduceMotion}
              disabled
            />
          </NavLink>
          <NavLink to="/collections">
            <CollapsibleSection
              label="Collections"
              icon={<Library size={16} strokeWidth={1} />}
              items={placeholderCollections}
              addLabel="Add new collection"
              shouldReduceMotion={shouldReduceMotion}
              disabled
            />
          </NavLink>
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
        <motion.button
          className="flex lg:hidden absolute top-[18px] right-[18px] z-30
               p-[7px] rounded-[10px] text-[#B7ADA6]
               hover:text-white hover:bg-white/[0.06]
               transition-colors duration-150 cursor-pointer"
          onClick={() => setMobileOpen(true)}
          whileTap={shouldReduceMotion ? {} : { scale: 0.92 }}
        >
          <Menu size={20} strokeWidth={1.5} />
        </motion.button>

        <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      </div>
    </div>
  );
}
