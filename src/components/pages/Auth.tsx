import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../functionalElements/Input";
import PasswordInput from "../functionalElements/PasswordInput";
import PrimaryButton from "../buttons/PrimaryButton";
import WordMarkLogo from "../WordmarkLogo";
import AnimatedBackground from "../AnimatedBackground";
import { useNavigate, Navigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { CircleX } from "lucide-react";
import ToastContainer from "../functionalElements/ToastContainer";
import { ApiError, messageForError } from "../../utils/apiFetch";
import { getSession, setSession } from "../../utils/session";

function useIsMobile() {
  return typeof window != "undefined" && window.innerWidth < 768;
}

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isLogin = mode === "login";
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  if (getSession()) {
    return <Navigate to="/" replace />;
  }

  const fieldVariants = isMobile
    ? {
        hidden: { opacity: 0, scaleY: 0 },
        visible: { opacity: 1, scaleY: 1 },
      }
    : {
        hidden: { opacity: 0, height: 0, marginBottom: 0 },
        visible: { opacity: 1, height: "auto", marginBottom: 12 },
      };

  const logIn = async (email: string, password: string) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        let message = "";
        try {
          const error = await res.json();
          message = error.message ?? "";
        } catch {
          // ignore
        }
        throw new ApiError(message, res.status);
      }
      const data = await res.json();
      setSession(data.token, {
        user_id: data.user.id,
        userEmail: data.user.email,
        userName: data.user.name,
      });
      navigate("/");
    } catch (error) {
      addToast({
        type: "error",
        Icon: CircleX,
        text: messageForError(error, "Error logging you in."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        let message = "";
        try {
          const error = await res.json();
          message = error.message ?? "";
        } catch {
          // ignore
        }
        throw new ApiError(message, res.status);
      }
      const data = await res.json();
      setSession(data.token, {
        user_id: data.user.id,
        userEmail: data.user.email,
        userName: data.user.name,
      });
      navigate("/");
    } catch (error) {
      addToast({
        type: "error",
        Icon: CircleX,
        text: messageForError(error, "Error signing you up."),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const isValidPassword = (value: string) =>
    value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);

  const handleSubmit = () => {
    if (submitting) return;
    if (isLogin) {
      logIn(email, password);
      return;
    }
    if (!isValidEmail(email)) {
      addToast({
        type: "error",
        Icon: CircleX,
        text: "Email must be a valid format",
      });
      return;
    }
    if (!isValidPassword(password)) {
      addToast({
        type: "error",
        Icon: CircleX,
        text: "Password must be at least 8 characters and include a letter and a number",
      });
      return;
    }
    register(name, email, password);
  };

  return (
    <div className="w-full h-svh flex justify-center items-center bg-[#0a0a0a] overflow-y-auto relative px-4 py-8">
      <AnimatedBackground />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#F07020]/5 blur-[100px] pointer-events-none" />
      <div className="relative z-10 w-full max-w-[420px] my-auto bg-[#141414] rounded-2xl p-6 sm:p-8 border border-white/5 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
        <div className="flex justify-center mb-6">
          <WordMarkLogo size="sm" />
        </div>

        <AnimatePresence mode="wait">
          <motion.h2
            key={mode}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-white text-center text-2xl font-semibold mb-6"
          >
            {isLogin ? "Welcome back" : "Create your account"}
          </motion.h2>
        </AnimatePresence>

        <div className="flex flex-col mb-6">
          <AnimatePresence initial={false}>
            {!isLogin && (
              <motion.div
                key="name"
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                style={{
                  overflow: "hidden",
                  ...(isMobile && { transformOrigin: "top" }),
                }}
                className={isMobile ? "mb-3" : ""}
              >
                <Input
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-3">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <PrimaryButton
              text={submitting ? (isLogin ? "Logging in..." : "Signing up...") : (isLogin ? "Log in" : "Sign up")}
              onClick={handleSubmit}
              size="sm"
              fullWidth
              disabled={submitting}
            />
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-xs text-white/30 mt-5">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setMode(isLogin ? "signup" : "login")}
            className="cursor-pointer text-[#F07020]/70 hover:text-[#F07020] transition-colors duration-150 underline underline-offset-2"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
