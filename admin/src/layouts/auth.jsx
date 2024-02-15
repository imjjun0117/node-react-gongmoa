import { Routes, Route, Navigate } from "react-router-dom";
import {routes} from "@/routes";

export function Auth() {

  return (
    <div className="relative min-h-screen w-full">
      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === "auth" &&
            pages.map(({ path, element }) => (
              <Route exact path={path} element={element} />
            ))
        )}
        <Route path="*" element={<Navigate to="/aoslwj7110" replace />} />
      </Routes>
    </div>
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
