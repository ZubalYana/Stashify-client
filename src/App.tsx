import "./App.css";
import { Route, Routes } from "react-router-dom";
import MenuLayout from "./components/functionalElements/MenuLayout";
import AllSnippets from "./components/pages/AllSnippets";
import Collections from "./components/pages/Collections";
import Projects from "./components/pages/Projects";
import Auth from "./components/pages/Auth";
import ProtectedRoute from "./components/functionalElements/ProtectedRoute";
import UserProfile from "./components/pages/UserProfile";

function App() {
  return (
    <div className="w-full">
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MenuLayout>
                <AllSnippets />
              </MenuLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/collections"
          element={
            <ProtectedRoute>
              <MenuLayout>
                <Collections />
              </MenuLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <MenuLayout>
                <Projects />
              </MenuLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MenuLayout>
                <UserProfile />
              </MenuLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
