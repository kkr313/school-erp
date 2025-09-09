import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { MdHome, MdChevronRight } from "react-icons/md";

const CustomBreadcrumb = ({ 
  title, 
  links = [], 
  showHome = true, 
  variant = "default", // default, compact, minimal
  animated = true 
}) => {
  const location = useLocation();

  // Auto-generate breadcrumbs based on current path if no links provided
  const generateBreadcrumbs = () => {
    if (links.length > 0) return links;
    
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [];
    
    if (showHome) {
      breadcrumbs.push({ label: "Dashboard", href: "/dashboard" });
    }
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segment.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      if (index < pathSegments.length - 1) {
        breadcrumbs.push({ label, href: currentPath });
      }
    });
    
    return breadcrumbs;
  };

  const breadcrumbLinks = generateBreadcrumbs();

  // Variant styles
  const getContainerClasses = () => {
    const baseClasses = "backdrop-blur-xl border shadow-lg bg-gradient-to-r";
    
    switch (variant) {
      case "compact":
        return `${baseClasses} border-white/10 rounded-xl p-2 from-white/70 to-white/50 mb-3`;
      case "minimal":
        return `${baseClasses} border-transparent rounded-lg p-2 from-transparent to-transparent mb-2`;
      default:
        return `${baseClasses} glass border-white/20 rounded-2xl p-4 from-white/80 to-white/60 mb-6`;
    }
  };

  const getAnimationClasses = () => {
    return animated ? "transition-all duration-300 hover:scale-[1.02]" : "";
  };

  return (
    <div className={variant === "minimal" ? "mb-4" : "mb-6"}>
      {/* Modern Breadcrumb Container */}
      <div className={`${getContainerClasses()} ${getAnimationClasses()} sm:text-sm text-xs sm:p-4 p-2 overflow-x-auto`} style={{ WebkitOverflowScrolling: 'touch' }}> {/* Responsive font and padding, scrollable on mobile */}
        <nav className="flex items-center space-x-2" aria-label="Breadcrumb">
          <ol className={`flex items-center space-x-2 sm:text-sm text-xs whitespace-nowrap`} style={{ scrollbarWidth: 'none' }}> {/* Responsive font size, prevent wrap */}
            {/* Home Icon */}
            {showHome && (
              <li className="flex items-center">
                <RouterLink
                  to="/dashboard"
                  className="group flex items-center text-gray-500 hover:text-blue-600 transition-all duration-300 hover:scale-110"
                >
                  <MdHome className={`${variant === "compact" ? "w-4 h-4" : "w-5 h-5"} mr-1 group-hover:text-blue-600 transition-colors duration-300 sm:w-5 sm:h-5 w-4 h-4`} />
                  <span className={`${variant === "minimal" ? "inline" : "hidden sm:inline"} font-medium group-hover:text-blue-600 sm:text-base text-xs`}>
                    {variant === "compact" ? "Home" : "Home"}
                  </span>
                </RouterLink>
                {breadcrumbLinks.length > 0 && (
                  <MdChevronRight className={`${variant === "compact" ? "w-3 h-3 mx-1" : "w-4 h-4 mx-2"} text-gray-400 sm:w-4 sm:h-4 w-3 h-3 sm:mx-2 mx-1`} />
                )}
              </li>
            )}

            {/* Breadcrumb Links */}
            {breadcrumbLinks.map((link, index) => (
              <li key={index} className="flex items-center">
                <RouterLink
                  to={link.href || "#"}
                  className={`group relative sm:px-3 px-2 sm:py-1.5 py-1 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300 font-medium sm:text-base text-xs`}
                >
                  {link.label}
                  {variant !== "minimal" && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                  )}
                </RouterLink>
                {index < breadcrumbLinks.length - 1 && (
                  <MdChevronRight className={`${variant === "compact" ? "w-3 h-3 mx-1" : "w-4 h-4 mx-2"} text-gray-400 sm:w-4 sm:h-4 w-3 h-3 sm:mx-2 mx-1`} />
                )}
                {index === breadcrumbLinks.length - 1 && title && (
                  <MdChevronRight className={`${variant === "compact" ? "w-3 h-3 mx-1" : "w-4 h-4 mx-2"} text-gray-400 sm:w-4 sm:h-4 w-3 h-3 sm:mx-2 mx-1`} />
                )}
              </li>
            ))}

            {/* Current Page Title */}
            {title && (
              <li className="flex items-center">
                <div className="relative group">
                  {variant !== "minimal" && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                  )}
                  <span className={`relative sm:px-4 px-2 sm:py-2 py-1 font-bold sm:text-base text-xs bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${variant !== "minimal" ? "glass rounded-xl border border-white/20 backdrop-blur-sm" : ""}`}>
                    {title}
                  </span>
                </div>
              </li>
            )}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default CustomBreadcrumb;
