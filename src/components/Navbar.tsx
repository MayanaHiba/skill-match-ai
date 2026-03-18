import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { isLoggedIn, getCurrentUser, logout, getStoredUsers } from "@/lib/auth";
import { MoreVertical, User, LogOut } from "lucide-react";

const ROLES = ["hr", "fresher", "recruiter"] as const;

const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const user = getCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const switchRole = (newRole: string) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    localStorage.setItem("user", JSON.stringify(updated));
    setMenuOpen(false);
    window.location.reload();
  };

  const getDashboardPath = () => {
    if (!user) return "/home";
    return user.role === "hr" || user.role === "recruiter" ? "/hr-dashboard" : "/candidate-dashboard";
  };

  const allEmails = getStoredUsers().map(u => u.email);

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-card">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(loggedIn ? getDashboardPath() : "/home")} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">SM</span>
          </div>
          <span className="font-semibold text-sm sm:text-base text-foreground hidden sm:inline">Skill Match AI</span>
        </button>

        {loggedIn && user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(p => !p)}
              className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Menu"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute left-0 top-full mt-1 w-64 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in">
                <div className="p-3 border-b border-border">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">User Details</p>
                  <p className="text-sm text-foreground font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize font-medium">
                    {user.role}
                  </span>
                </div>

                <div className="p-3 border-b border-border">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">System Users ({allEmails.length})</p>
                  <div className="max-h-24 overflow-y-auto space-y-0.5">
                    {allEmails.map(email => (
                      <p key={email} className="text-xs text-foreground truncate">{email}</p>
                    ))}
                    {allEmails.length === 0 && <p className="text-xs text-muted-foreground">No users yet</p>}
                  </div>
                </div>

                <div className="p-2">
                  <p className="px-2 pt-1 pb-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Switch Role</p>
                  {ROLES.map(r => (
                    <button
                      key={r}
                      onClick={() => switchRole(r)}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors capitalize ${
                        user.role === r ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                  <div className="my-1 h-px bg-border" />
                  <button
                    onClick={() => { setMenuOpen(false); navigate(getDashboardPath()); }}
                    className="w-full text-left px-3 py-1.5 text-sm text-foreground rounded-md hover:bg-secondary transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-1.5 text-sm text-destructive rounded-md hover:bg-destructive/10 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        {loggedIn && user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="hidden sm:inline">{user.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground border border-border px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="text-xs sm:text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
