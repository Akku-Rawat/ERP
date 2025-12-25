import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div
        className={`flex-1 transition-all duration-300 bg-pink-500 ${
          sidebarOpen ? "md:ml-64" : "md:ml-16"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
