import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  X,
  Boxes,
  BrainCircuit,
  Library,
  User,
  Settings,
} from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: "All Snippets", icon: <Boxes size={18} strokeWidth={1} />, to: "/", end: true },
  { label: "Projects",     icon: <BrainCircuit size={18} strokeWidth={1} />, to: "/projects" },
  { label: "Collections",  icon: <Library size={18} strokeWidth={1} />, to: "/collections" },
];

const bottomItems = [
  { label: "Profile",  icon: <User size={18} strokeWidth={1} />,     to: "/profile" },
  { label: "Settings", icon: <Settings size={18} strokeWidth={1} />, to: "/settings" },
];

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-0 left-0 z-50 h-full w-[280px]
                       bg-[#171717] border-r border-[#B7ADA6]/10
                       flex flex-col px-[20px] py-[20px] lg:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 320, damping: 32 }
            }
          >
            <div className="flex items-center justify-between mb-8 px-1">
              <span className="text-white text-[15px] font-medium tracking-tight">
                Navigation
              </span>
              <motion.button
                onClick={onClose}
                className="p-[6px] rounded-[8px] text-[#B7ADA6]/50
                           hover:text-white hover:bg-white/[0.06]
                           transition-colors duration-150 cursor-pointer"
                whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
              >
                <X size={16} strokeWidth={1.5} />
              </motion.button>
            </div>

            <motion.nav
              className="flex flex-col gap-y-[4px] flex-1"
              variants={shouldReduceMotion ? {} : listVariants}
              initial="hidden"
              animate="visible"
            >
              {navItems.map(({ label, icon, to, end }) => (
                <motion.div key={to}>
                  <NavLink to={to} end={end} onClick={onClose}>
                    {({ isActive }) => (
                      <motion.div
                        className={`flex items-center gap-x-3 text-[14px] rounded-[12px] px-3 py-[10px]
                                    transition-colors duration-150 cursor-pointer
                                    ${isActive
                                      ? "text-white bg-white/[0.06]"
                                      : "text-[#B7ADA6] hover:text-white hover:bg-white/[0.04]"
                                    }`}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                      >
                        {icon}
                        <span>{label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="mobile-active-pill"
                            className="ml-auto w-[5px] h-[5px] rounded-full bg-[#F07020]"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                      </motion.div>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </motion.nav>

            <div className="flex flex-col gap-y-[4px] pt-4 border-t border-white/[0.05]">
              {bottomItems.map(({ label, icon, to }) => (
                <NavLink key={to} to={to} onClick={onClose}>
                  {({ isActive }) => (
                    <motion.div
                      className={`flex items-center gap-x-3 text-[13px] rounded-[12px] px-3 py-[10px]
                                  transition-colors duration-150 cursor-pointer
                                  ${isActive
                                    ? "text-white bg-white/[0.06]"
                                    : "text-[#B7ADA6] hover:text-white hover:bg-white/[0.04]"
                                  }`}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                    >
                      {icon}
                      <span>{label}</span>
                    </motion.div>
                  )}
                </NavLink>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}