import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpeg";
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
    <nav className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(loggedIn ? getDashboardPath() : "/home")} className="flex items-center gap-2.5 group">
          <img src={logo} alt="HF" className="w-9 h-9 rounded-full object-cover transition-shadow group-hover:shadow-gold" />
          <span className="font-display font-bold text-lg text-foreground">Intelli-Hire</span>
        </button>

        {/* Three dot menu */}
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
              <div className="absolute left-0 top-full mt-1 w-72 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in">
                {/* User Details */}
                <div className="p-4 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">User Details</p>
                  <p className="text-sm text-foreground font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                  <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent-foreground capitalize font-medium">
                    {user.role}
                  </span>
                </div>

                {/* System Users */}
                <div className="p-4 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">System Users ({allEmails.length})</p>
                  <div className="max-h-28 overflow-y-auto space-y-1">
                    {allEmails.map(email => (
                      <p key={email} className="text-xs text-foreground truncate">{email}</p>
                    ))}
                    {allEmails.length === 0 && <p className="text-xs text-muted-foreground">No users yet</p>}
                  </div>
                </div>

                {/* Options */}
                <div className="p-2">
                  {/* Switch Role */}
                  <p className="px-2 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Switch Role</p>
                  {ROLES.map(r => (
                    <button
                      key={r}
                      onClick={() => switchRole(r)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors capitalize ${
                        user.role === r ? "bg-accent/15 text-accent-foreground font-medium" : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                  <div className="my-1 h-px bg-border" />
                  <button
                    onClick={() => { setMenuOpen(false); navigate(getDashboardPath()); }}
                    className="w-full text-left px-3 py-2 text-sm text-foreground rounded-md hover:bg-secondary transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-destructive rounded-md hover:bg-destructive/10 transition-colors"
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
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {loggedIn && user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <User className="w-4 h-4 text-muted-foreground" />
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-medium bg-gold-gradient text-primary-foreground px-4 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
