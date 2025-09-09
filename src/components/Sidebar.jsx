import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdSchool,
  MdExpandMore,
  MdSettings,
  MdReport,
  MdClose,
  MdMenu,
  MdLibraryBooks,
  MdClass,
  MdEvent,
} from "react-icons/md";
import {
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
  FiBarChart,
  FiFileText,
  FiDollarSign,
} from "react-icons/fi";
import {
  FaUserGraduate,
  FaUserTie,
  FaRupeeSign,
  FaWallet,
  FaFileAlt,
  FaCog,
  FaGraduationCap,
  FaClipboardCheck,
} from "react-icons/fa";
import { BsPersonLinesFill, BsCalendarCheck, BsCollection } from "react-icons/bs";
import { IoStatsChartSharp } from "react-icons/io5";
import logo from "../assets/Logo.png";
import {
  menuItems,
  masterItems,
  attendanceItems,
  examItems,
  collectionItems,
  reportItems,
  configItems,
} from "../utils/globalMenuItems";

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const [masterOpen, setMasterOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [examOpen, setExamOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);  const [configOpen, setConfigOpen] = useState(false);

  // Auto-expand submenu if current path matches
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/master/")) setMasterOpen(true);
    if (path.startsWith("/report/")) setReportOpen(true);
    if (path.startsWith("/attendance/")) setAttendanceOpen(true);
    if (path.startsWith("/exam/")) setExamOpen(true);
    if (path.startsWith("/collection/") || path === "/dues-collection" || path === "/demand-bill") setCollectionOpen(true);
    if (path.startsWith("/configuration/")) setConfigOpen(true);
  }, [location.pathname]);

  // Disable background scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  const isActive = (path) => location.pathname === path;

  const MenuItem = ({ item, onClick, isSubmenu = false }) => {
    const active = isActive(item.path);
    
    return (
      <div
        className={`
          group relative flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-xl cursor-pointer
          transition-all duration-300 ease-out transform hover:scale-[1.02]
          ${collapsed && !mobileOpen ? "justify-center px-3" : ""}
          ${isSubmenu ? "ml-4 py-2 text-sm" : ""}          ${active 
            ? "glass-active text-blue-700 shadow-lg border-l-4 border-blue-500" 
            : "text-gray-600 hover:bg-white/10 hover:text-blue-600 hover:shadow-md hover:border-l-4 hover:border-blue-300"
          }
        `}
        onClick={onClick}
        title={collapsed && !mobileOpen ? item.title : ""}
      >
        {/* Icon with animation */}
        <div className={`
          flex-shrink-0 transition-all duration-300 
          ${active ? "text-blue-600 scale-110" : "text-gray-500 group-hover:text-blue-500 group-hover:scale-110"}
        `}>
          {item.icon && React.createElement(item.icon, { className: "text-lg" })}
        </div>

        {/* Text with slide animation */}
        {(!collapsed || mobileOpen) && (
          <span className={`
            font-medium truncate transition-all duration-300
            ${active ? "text-blue-700" : "text-gray-700 group-hover:text-blue-600"}
          `}>
            {item.title}
          </span>
        )}

        {/* Collapsed state tooltip */}
        {collapsed && !mobileOpen && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {item.title}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
          </div>
        )}

        {/* Active indicator */}
        {active && (
          <div className="absolute right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        )}
      </div>
    );
  };

  const ExpandableMenuItem = ({ title, icon, items, isOpen, setIsOpen }) => {
    const hasActiveChild = items.some(item => isActive(item.path));

    return (
      <div className="mb-2">        {/* Expandable Header */}
        <div
          className={`
            group relative flex items-center gap-3 px-4 py-3 mx-2 rounded-xl cursor-pointer
            transition-all duration-300 ease-out
            ${collapsed && !mobileOpen ? "justify-center px-3" : ""}            ${hasActiveChild 
              ? "glass-active text-blue-700 shadow-lg" 
              : "text-gray-600 hover:bg-white/10 hover:text-blue-600 hover:shadow-md"
            }
          `}
          onClick={() => setIsOpen(!isOpen)}
          title={collapsed && !mobileOpen ? title : ""}
        >
          {/* Icon */}
          <div className={`
            flex-shrink-0 transition-all duration-300 
            ${hasActiveChild ? "text-blue-600 scale-110" : "text-gray-500 group-hover:text-blue-500 group-hover:scale-110"}
          `}>
            {icon}
          </div>

          {/* Title */}
          {(!collapsed || mobileOpen) && (
            <>
              <span className={`
                font-medium flex-1 transition-all duration-300
                ${hasActiveChild ? "text-blue-700" : "text-gray-700 group-hover:text-blue-600"}
              `}>
                {title}
              </span>
              
              {/* Expand/Collapse Icon */}
              <MdExpandMore 
                className={`
                  text-lg transition-transform duration-300
                  ${isOpen ? "rotate-180" : ""}
                  ${hasActiveChild ? "text-blue-600" : "text-gray-500 group-hover:text-blue-500"}
                `} 
              />
            </>
          )}          {/* Collapsed state tooltip */}
          {collapsed && !mobileOpen && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {title}
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>
          )}

          {/* Active indicator for collapsed state */}
          {collapsed && hasActiveChild && (
            <div className="absolute right-1 top-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          )}
        </div>

        {/* Expandable Items */}
        {(!collapsed || mobileOpen) && isOpen && (
          <div className="space-y-1 animate-fadeIn">
            {items.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                <MenuItem item={item} isSubmenu={true} />
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>      {/* Desktop Sidebar */}      <div
        className={`
          fixed top-2 left-2 bottom-2 z-40 transition-all duration-500 rounded-2xl
          glass backdrop-blur-xl border border-white/20 shadow-2xl
          ${collapsed ? "w-16" : "w-72"} 
          hidden md:block overflow-hidden flex flex-col
        `}
        style={{ height: 'calc(100vh - 16px)' }}
      >{/* Header Section */}
        <div className={`border-b border-white/10 ${collapsed ? "p-2" : "p-4"}`}>
          {!collapsed && (
            <div className="flex items-center gap-3 animate-fadeIn">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-2 border border-white/20 shadow-lg">
                  <img src={logo} alt="School Logo" className="h-10 w-10 object-contain animate-float" />
                </div>
              </div>
              <div>
                <h2 className="font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  School ERP
                </h2>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </div>
          )}          {collapsed && (
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-lg p-1.5 border border-white/20 shadow-lg">
                  <img src={logo} alt="School Logo" className="h-9 w-9 object-contain animate-float" />
                </div>
              </div>
            </div>
          )}
        </div>        {/* Menu Items */}
        <div className={`flex-1 overflow-y-auto py-4 min-h-0 ${collapsed ? 'no-scrollbar' : 'custom-scrollbar'} max-h-[calc(100vh-200px)]`}>
          {/* Main Menu Items */}
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                <MenuItem item={item} />
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-4 my-4 border-t border-gray-200/50"></div>

          {/* Expandable Sections */}
          <ExpandableMenuItem
            title="Administration"
            icon={<MdSettings className="text-lg" />}
            items={masterItems}
            isOpen={masterOpen}
            setIsOpen={setMasterOpen}
          />

          <ExpandableMenuItem
            title="Attendance"
            icon={<BsCalendarCheck className="text-lg" />}
            items={attendanceItems}
            isOpen={attendanceOpen}
            setIsOpen={setAttendanceOpen}
          />

          <ExpandableMenuItem
            title="Examinations"
            icon={<FaGraduationCap className="text-lg" />}
            items={examItems}
            isOpen={examOpen}
            setIsOpen={setExamOpen}
          />

          <ExpandableMenuItem
            title="Collections"
            icon={<BsCollection className="text-lg" />}
            items={collectionItems}
            isOpen={collectionOpen}
            setIsOpen={setCollectionOpen}
          />

          <ExpandableMenuItem
            title="Reports & Analytics"
            icon={<MdReport className="text-lg" />}
            items={reportItems}
            isOpen={reportOpen}
            setIsOpen={setReportOpen}
          />

          <ExpandableMenuItem
            title="Configuration"
            icon={<FaCog className="text-lg" />}
            items={configItems}
            isOpen={configOpen}
            setIsOpen={setConfigOpen}
          />
        </div>        {/* Footer */}
        {!collapsed && (
          <div className="px-4 py-3 pb-4 border-t border-white/10 bg-gradient-to-t from-white/5 to-transparent mt-auto">
            <div className="text-xs text-gray-500 text-center font-medium mb-4">
             © {new Date().getFullYear()} School ERP System
            </div>
          </div>
        )}
        {/* Enhanced Toggle Button - bottom attached, arrow always visible and prominent */}        <div className="hidden md:flex absolute bottom-4 right-0 z-50">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-xl border-2 border-white/30 cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-2xl"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            style={{ marginRight: '-24px' }} // overlap border for perfect attachment
          >
            <div className="flex items-center justify-center">
              {collapsed ? (
                <FiChevronRight className="text-white" size={32} />
              ) : (
                <FiChevronLeft className="text-white" size={32} />
              )}
            </div>
          </button>
        </div>
      </div>      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-80 z-50 transform transition-transform duration-300 md:hidden
          glass backdrop-blur-xl border-r border-white/20
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-2 border border-white/20 shadow-lg">
                <img src={logo} alt="School Logo" className="h-10 w-10 object-contain animate-float" />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                School ERP
              </h2>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-full glass-hover transition-colors duration-200"
          >
            <MdClose className="text-xl text-gray-600" />
          </button>
        </div>        {/* Mobile Menu Items */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar max-h-[calc(100vh-120px)]">
          {/* Main Menu Items */}
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                <MenuItem item={item} />
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-4 my-4 border-t border-gray-200/50"></div>

          {/* Expandable Sections */}
          <ExpandableMenuItem
            title="Administration"
            icon={<MdSettings className="text-lg" />}
            items={masterItems}
            isOpen={masterOpen}
            setIsOpen={setMasterOpen}
          />

          <ExpandableMenuItem
            title="Attendance"
            icon={<BsCalendarCheck className="text-lg" />}
            items={attendanceItems}
            isOpen={attendanceOpen}
            setIsOpen={setAttendanceOpen}
          />

          <ExpandableMenuItem
            title="Examinations"
            icon={<FaGraduationCap className="text-lg" />}
            items={examItems}
            isOpen={examOpen}
            setIsOpen={setExamOpen}
          />

          <ExpandableMenuItem
            title="Collections"
            icon={<BsCollection className="text-lg" />}
            items={collectionItems}
            isOpen={collectionOpen}
            setIsOpen={setCollectionOpen}
          />

          <ExpandableMenuItem
            title="Reports & Analytics"
            icon={<MdReport className="text-lg" />}
            items={reportItems}
            isOpen={reportOpen}
            setIsOpen={setReportOpen}
          />

          <ExpandableMenuItem
            title="Configuration"
            icon={<FaCog className="text-lg" />}
            items={configItems}
            isOpen={configOpen}
            setIsOpen={setConfigOpen}
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
