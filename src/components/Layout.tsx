import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Users, 
  MapPin, 
  Calendar, 
  Bell, 
  LayoutDashboard, 
  Lock, 
  LogOut,
  ChevronRight,
  Search,
  Settings,
  ShieldCheck,
  BookOpen
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { label: "Insights", icon: LayoutDashboard, path: "/dashboard", roles: ["admin", "teacher", "student"] },
    { label: "Classrooms", icon: MapPin, path: "/classrooms", roles: ["admin", "teacher"] },
    { label: "Booking", icon: Calendar, path: "/booking", roles: ["admin", "teacher", "student"] },
  ];

  const portalItems = [
    { label: "Exam Seating", icon: BookOpen, path: "/seating", roles: ["admin", "student"] },
    { label: "Notifications", icon: Bell, path: "/notifications", roles: ["admin", "teacher", "student"] },
    { label: "Roll Search", icon: Search, path: "/search", roles: ["admin", "teacher"] },
    { label: "Governance", icon: ShieldCheck, path: "/admin", roles: ["admin"] },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">ClassLink</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-4 overflow-y-auto pt-4">
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Navigation</p>
            <div className="space-y-1">
              {navItems.filter(item => item.roles.includes(user?.role || "")).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group",
                    location.pathname === item.path 
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Portal Access</p>
            <div className="space-y-1">
              {portalItems.filter(item => item.roles.includes(user?.role || "")).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group",
                    location.pathname === item.path 
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
           <div className="flex flex-col gap-2">
             <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3 border border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                  {user?.displayName?.[0]}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold truncate text-slate-800 leading-none">{user?.displayName}</p>
                  <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest">{user?.role} Portal</p>
                </div>
             </div>
             <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-600 transition-colors text-[10px] font-bold uppercase tracking-widest w-full"
             >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
             </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
             <h2 className="text-sm font-semibold text-slate-800">
                {location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(1).split('/')[0].slice(1) || 'Dashboard Overview'}
             </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-slate-400">
              <button className="hover:text-slate-600 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button className="hover:text-slate-600 transition-colors relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
              </button>
            </div>
            <div className="h-4 w-[1px] bg-slate-200 mx-2" />
            <div className="flex items-center gap-3">
               <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-[10px] font-bold border border-blue-100 uppercase tracking-tight">
                  Live System
               </div>
               <span className="text-xs font-medium text-slate-500">
                 {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
               </span>
            </div>
          </div>
        </header>

        {/* Page Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
