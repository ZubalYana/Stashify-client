import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../functionalElements/Input";
import PasswordInput from "../functionalElements/PasswordInput";
import PrimaryButton from "../buttons/PrimaryButton";
import WordMarkLogo from "../WordmarkLogo";

const fieldVariants = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: { opacity: 1, height: "auto", marginBottom: 12 },
}

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const isLogin = mode === "login";

  const handleSubmit = () => {
    if (isLogin) {
      console.log(email, password, "logged in");
    } else {
      console.log(name, email, password, "signed up");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#0a0a0a]">
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#F07020]/5 blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-[420px] mx-4 bg-[#141414] rounded-2xl p-8 border border-white/5 shadow-[0_0_60px_rgba(0,0,0,0.5)]">

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
                style={{ overflow: "hidden" }}
              >
                <Input label="Name" value={name} onChange={e => setName(e.target.value)} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-3">
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <PasswordInput label="Password" value={password} onChange={e => setPassword(e.target.value)} />
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
              text={isLogin ? "Log in" : "Sign up"}
              onClick={handleSubmit}
              size="sm"
              fullWidth
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
    </div>
  );
}