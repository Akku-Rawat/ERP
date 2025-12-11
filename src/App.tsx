import React from "react";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { LayoutWithTheme } from "./layoutwiththeme";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LayoutWithTheme>
      <AppRoutes />
      </LayoutWithTheme>
    </AuthProvider>
  );
};

export default App;
