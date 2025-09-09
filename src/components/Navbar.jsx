import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaCog } from "react-icons/fa";
import { MdOutlineLogout, MdCloseFullscreen, MdMenu } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { useAuth } from "../App";
import { filterMenuItems } from "../utils/globalSearchUtil";
import Sidebar from "./Sidebar";
import {
  menuItems,
  masterItems,
  attendanceItems,
  examItems,
  collectionItems,
  reportItems,
  configItems,
} from "../utils/globalMenuItems";

const Navbar = ({ mobileOpen, setMobileOpen, onVisibilityChange, isSidebarCollapsed = false }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]); const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  // Collect all sidebar menu/module items for global search
  const allMenuItems = useMemo(() => [
    ...menuItems,
    ...masterItems,
    ...attendanceItems,
    ...examItems,
    ...collectionItems,
    ...reportItems,
    ...configItems,
  ], []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
      if (!event.target.closest('.mobile-search-container')) {
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    if (searchText.trim()) {
      setSearchResults(filterMenuItems(searchText, allMenuItems));
    } else {
      setSearchResults([]);
    }
  }, [searchText, allMenuItems]);  // Handle scroll behavior for navbar visibility
  useEffect(() => {
    let ticking = false;

    const controlNavbar = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          let newVisibility = isVisible;
          if (currentScrollY < 10) {
            // Always show navbar when at top
            newVisibility = true;
          } else if (currentScrollY > lastScrollY && currentScrollY > 80 && !isHovering) {
            // Hide navbar when scrolling down after 80px (but not when hovering)
            newVisibility = false;
            // Close any open dropdowns when hiding
            setDropdownOpen(false);
            setMobileSearchOpen(false);
          } else if (currentScrollY < lastScrollY || isHovering) {
            // Show navbar when scrolling up or hovering
            newVisibility = true;
          }

          if (newVisibility !== isVisible) {
            setIsVisible(newVisibility);
            onVisibilityChange?.(newVisibility);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Show navbar when mouse moves to top of screen
    const handleMouseMove = (e) => {
      if (e.clientY <= 50 && !isVisible && window.scrollY > 80) {
        setIsVisible(true);
        onVisibilityChange?.(true);
      }
    };

    window.addEventListener('scroll', controlNavbar, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', controlNavbar);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [lastScrollY, isVisible, isHovering, onVisibilityChange]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }; const handleLogout = () => {
    console.log("Logout button clicked!"); // Debug log
    // Clear all authentication data
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("schoolMaster");
    localStorage.removeItem("schoolCode");
    sessionStorage.clear(); // This clears token, tokenExpiry, and schoolCode from session

    setIsAuthenticated(false);
    setDropdownOpen(false);
    navigate("/login");
  }; return (
    <nav
      className={`fixed top-2 left-2 right-2 z-50 transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} pointer-events-none`}
    >
      {/* Background layer behind navbar content (non-interactive). On desktop, start after sidebar width. */}
      <div
        aria-hidden
        className={`absolute inset-0 ${isSidebarCollapsed ? 'md:left-16' : 'md:left-72'} pointer-events-none z-0`}
      >
        <div className="h-full w-full rounded-2xl md:rounded-l-none bg-white/60 backdrop-blur-md"></div>
      </div>

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pointer-events-auto"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Mobile Layout: Menu | Search + Profile */}
        <div className="md:hidden flex items-center justify-between h-16 navbar-height">
          {/* Enhanced Menu Button */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative bg-white/70 backdrop-blur-sm hover:bg-white/90 p-3 rounded-full border border-white/20 shadow-lg transition-all duration-200 cursor-pointer"
              title="Toggle Menu"
            >
              <MdMenu className="text-xl text-gray-700 hover:text-blue-600 transition-colors duration-200" />
            </button>
          </div>

          {/* Right Side: Search + Profile */}
          <div className="flex items-center gap-2">
            {/* Enhanced Mobile Search Button */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="relative bg-white/70 backdrop-blur-sm hover:bg-white/90 p-3 rounded-full border border-white/20 shadow-lg transition-all duration-200 cursor-pointer"
                title="Search"
              >
                <BiSearch className="text-lg text-gray-600 hover:text-blue-500 transition-colors duration-200" />
              </button>
            </div>

            {/* Enhanced Mobile User Profile */}
            <div className="relative dropdown-container">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-20 hover:opacity-40 transition duration-300"></div>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative flex items-center bg-white/70 backdrop-blur-sm hover:bg-white/90 p-2 rounded-full border border-white/20 shadow-lg transition-all duration-200 cursor-pointer"
              >
                <div className="relative">
                  <FaUserCircle className="text-2xl text-gray-600 hover:text-purple-500 transition-colors duration-200" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
              </button>
            </div>
          </div>
        </div>        {/* Desktop/Tablet Layout */}
        <div className="hidden md:flex items-center justify-center h-16 navbar-height">
          {/* Centered Search Bar */}
          <div className="flex items-center justify-center w-full max-w-2xl">
            <div className="relative w-full max-w-md">
              <BiSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-xl text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300 cursor-pointer" />              <input
                type="text"
                placeholder="Search anything..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-transparent text-gray-700 border-b-2 border-gray-300 py-3 pl-12 pr-12 
                         focus:outline-none focus:border-b-blue-500 placeholder-gray-400 transition-all duration-300 cursor-text
                         hover:border-b-blue-400 drop-shadow-[0_2px_4px_rgba(59,130,246,0.3)]
                         focus:drop-shadow-[0_3px_6px_rgba(59,130,246,0.4)]"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 
                           p-1 rounded-full hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                >
                  <IoMdClose className="text-lg" />
                </button>
              )}
              {/* Global Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-auto">
                  {searchResults.map((item) => (
                    <div
                      key={item.path}
                      className="px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-blue-50 transition-all duration-200"
                      onClick={() => {
                        setSearchText("");
                        setMobileSearchOpen(false);
                        setDropdownOpen(false);
                        navigate(item.path);
                      }}
                    >
                      {item.icon && React.createElement(item.icon, { className: "text-lg" })}
                      <span className="font-medium text-gray-700">{item.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>          {/* Desktop Action Buttons - Positioned to the right */}
          <div className="absolute right-4 flex items-center gap-3">
            {/* Enhanced Fullscreen Toggle */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <button
                onClick={toggleFullscreen}
                className="relative bg-white/70 backdrop-blur-sm hover:bg-white/90 p-3 rounded-full border border-white/20 shadow-lg transition-all duration-200 cursor-pointer"
                title={isFullscreen ? "Exit Fullscreen" : "View full screen"}
              >
                {isFullscreen ? (
                  <MdCloseFullscreen className="text-lg text-gray-600 group-hover:text-blue-500 transition-colors duration-200" />
                ) : (
                  <HiOutlineArrowsExpand className="text-lg text-gray-600 group-hover:text-green-500 transition-colors duration-200" />
                )}
              </button>
            </div>

            {/* Enhanced Desktop User Profile Dropdown */}
            <div className="relative dropdown-container">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur opacity-20 hover:opacity-40 transition duration-300"></div>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative flex items-center gap-2 bg-white/70 backdrop-blur-sm hover:bg-white/90 px-4 py-2 rounded-full border border-white/20 shadow-lg transition-all duration-200 group cursor-pointer"
              >
                <div className="relative">
                  <FaUserCircle className="text-2xl text-gray-600 group-hover:text-purple-500 transition-colors duration-200" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full status-online"></div>
                </div>
                <IoIosArrowDown className={`text-sm text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-2 md:right-4 top-16 w-64 z-20 animate-fadeIn dropdown-container">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">

              {/* User Info Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <FaUserCircle className="text-3xl text-gray-600" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full status-online"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Welcome back!</p>
                    <p className="text-sm text-gray-500">Administrator</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/master/school");
                  }}
                  className="w-full px-6 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-all duration-200 group cursor-pointer"
                >
                  <CgProfile className="text-lg text-gray-500 group-hover:text-blue-500 transition-colors duration-200" />
                  <span className="font-medium text-gray-700 group-hover:text-gray-900">Profile Settings</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full px-6 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-all duration-200 group cursor-pointer"
                >
                  <FaCog className="text-lg text-gray-500 group-hover:text-indigo-500 transition-colors duration-200" />
                  <span className="font-medium text-gray-700 group-hover:text-gray-900">Settings</span>
                </button>

                <div className="my-2 border-t border-gray-200"></div>

                <button
                  onClick={handleLogout}
                  className="w-full px-6 py-3 flex items-center gap-3 text-left hover:bg-red-50 transition-all duration-200 group cursor-pointer"
                >
                  <MdOutlineLogout className="text-lg text-gray-500 group-hover:text-red-500 transition-colors duration-200" />
                  <span className="font-medium text-gray-700 group-hover:text-red-600">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 mobile-search-container">
          <div className="absolute top-20 left-2 right-2 bg-white border border-gray-200 rounded-2xl shadow-2xl animate-fadeIn">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="relative">
                <BiSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-xl text-gray-400 transition-colors duration-200" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  autoFocus
                  className="w-full bg-white text-gray-700 border border-gray-300 rounded-2xl py-4 pl-12 pr-16 
                           focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20
                           placeholder-gray-400 shadow-lg transition-all duration-200 text-lg"
                />
                <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center gap-2">
                  {/* Only one close button: clears search and closes overlay */}
                  <button
                    onClick={() => {
                      setSearchText("");
                      setMobileSearchOpen(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                  >
                    <IoMdClose className="text-xl" />
                  </button>
                </div>
                {/* Global Search Results Dropdown for Mobile */}
                {searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-auto">
                    {searchResults.map((item) => (
                      <div
                        key={item.path}
                        className="px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-blue-50 transition-all duration-200"
                        onClick={() => {
                          setSearchText("");
                          setMobileSearchOpen(false);
                          setDropdownOpen(false);
                          navigate(item.path);
                        }}
                      >
                        {item.icon && React.createElement(item.icon, { className: "text-lg" })}
                        <span className="font-medium text-gray-700">{item.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
