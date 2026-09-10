import { Navigate } from "react-router-dom";
import { getSession } from "../../utils/session";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!getSession()) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}
