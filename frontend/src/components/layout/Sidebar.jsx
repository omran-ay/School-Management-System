import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Building2,
  BookOpen,
  Notebook,
  ClipboardList,
  GraduationCap,
  CalendarDays,
  LogOut,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AthContext"; // Assuming you have an auth context

const iconMap = {
  Dashboard: LayoutDashboard,
  Students: Users,
  Teachers: UserCog,
  Classrooms: Building2,
  Courses: BookOpen,
  Subjects: Notebook,
  Enrollment: ClipboardList,
  Grades: GraduationCap,
  Timetable: CalendarDays,
  Logout: LogOut,
};

const Sidebar = ({ menuItems }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); // Assuming you have an auth context with logout
  const [expandedItems, setExpandedItems] = useState({});
  const [collapsed, setCollapsed] = useState(false);

  const toggleSubmenu = (label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <motion.aside
      className={`h-screen bg-gradient-to-b from-green-400 to-green-800 shadow-lg flex flex-col justify-between ${
        collapsed ? "w-20" : "w-64"
      }`}
      initial={{ width: 256 }}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div>
        <motion.div
          className="flex  bg-gradient-to-b from-white to-green-400 items-center justify-between p-4 border-b border-green-700"
          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        >
          {!collapsed && (
            <Link
              to="/adminDashboard"
              className="flex flex-col items-center gap-2 group "
              aria-label="Home"
            >
              <div className="bg-white rounded-full">
                <img
                  className=" transition-colors"
                  src="/images/image3.png"
                  alt=""
                  width={80}
                  height={80}
                />
              </div>
              {/* <School
                className="text-green-600 group-hover:text-green-700 transition-colors"
                size={28}
              /> */}
              <span
                className="
    font-extrabold 
    text-2xl 
    text-gray-800 
    group-hover:text-green-700 
    transition-colors 
    duration-300 
    ease-in-out 
    hidden 
    sm:block
    tracking-wide
    drop-shadow-sm
  "
              >
                Admin Dashboard
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white hover:bg-green-600 p-1 rounded"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronDown size={18} className="rotate-90" />
            )}
          </button>
        </motion.div>

        {/* Menu */}
        <nav className="flex flex-col mt-4 px-2 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = iconMap[item.label] || LayoutDashboard;
            const hasSubmenu = item.subItems && item.subItems.length > 0;
            const isItemActive =
              isActive(item.path) ||
              (item.subItems &&
                item.subItems.some((subItem) => isActive(subItem.path)));

            return (
              <div key={index} className="relative">
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 
                    ${
                      isItemActive
                        ? "bg-white text-green-600 shadow-md"
                        : "text-white hover:bg-green-600/50"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `}
                  onClick={(e) => {
                    if (hasSubmenu) {
                      e.preventDefault();
                      toggleSubmenu(item.label);
                    }
                  }}
                >
                  <Icon className="w-5 h-5" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {hasSubmenu && (
                        <motion.span
                          animate={{
                            rotate: expandedItems[item.label] ? 90 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight size={16} />
                        </motion.span>
                      )}
                    </>
                  )}
                </Link>

                {!collapsed && hasSubmenu && (
                  <AnimatePresence>
                    {expandedItems[item.label] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-8 pt-1 space-y-1"
                      >
                        {item.subItems.map((subItem, subIndex) => {
                          const SubIcon =
                            iconMap[subItem.label] || ChevronRight;
                          return (
                            <Link
                              key={subIndex}
                              to={subItem.path}
                              className={`flex items-center gap-2 p-2 text-sm rounded transition-all 
                                ${
                                  isActive(subItem.path)
                                    ? "bg-green-500/20 text-white"
                                    : "text-white/80 hover:text-white hover:bg-green-600/30"
                                }
                              `}
                            >
                              <SubIcon className="w-4 h-4" />
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-green-400">
        <motion.button
          onClick={handleLogout}
          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          className={`flex items-center gap-3 w-full p-3 rounded-lg text-white transition ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && "Logout"}
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
