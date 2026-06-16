import { Mail, Hash } from "lucide-react";

export default function UserProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="flex-1 p-[20px] lg:p-[40px]">
      <h3 className="text-[20px] font-semibold text-white mb-6">User Profile</h3>

      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-[#F07020]/10 border border-[#F07020]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[#F07020] text-lg font-semibold">
              {user.userName?.charAt(0).toUpperCase() ?? "?"}
            </span>
          </div>
          <div>
            <p className="text-white font-semibold text-[16px]">{user.userName}</p>
            <p className="text-white/40 text-[13px]">Personal account</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { icon: <Mail size={15} strokeWidth={1.5} />, label: "Email", value: user.userEmail },
            { icon: <Hash size={15} strokeWidth={1.5} />, label: "User ID", value: user.user_id },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 bg-[#0d0d0d] border border-white/5 rounded-xl px-4 py-3">
              <span className="text-white/30">{icon}</span>
              <span className="text-white/30 text-[12px] w-14 flex-shrink-0">{label}</span>
              <span className="text-white/70 text-[13px] font-mono truncate">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}