import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setMobileOpen(!mobileOpen)} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Main Content */}
        <main
          className="flex-1 transition-all duration-300"
          style={{
            marginLeft: collapsed ? "4rem" : "16rem", // Adjust based on sidebar width
          }}
        >
          {/* Add padding to avoid overlapping Navbar */}
          <div className="pt-20 px-3 md:px-6 pb-4">
            <Outlet /> {/* React Router pages will be rendered here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
