import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import logo from "@/assets/logo.jpeg";
import ThemeToggle from "@/components/ThemeToggle";
import { signup, login, isLoggedIn } from "@/lib/auth";

type Role = "" | "hr" | "fresher" | "recruiter";
type Tab = "login" | "signup";

const LoginPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("");
  const [error, setError] = useState("");

  if (isLoggedIn()) return <Navigate to="/home" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (tab === "signup") {
      if (!name.trim()) { setError("Please enter your name."); return; }
      if (!role) { setError("Please select a role."); return; }
      const err = signup(name.trim(), email.trim(), password, role as "hr" | "fresher" | "recruiter");
      if (err) { setError(err); return; }
    } else {
      const err = login(email.trim(), password);
      if (err) { setError(err); return; }
    }

    const user = JSON.parse(localStorage.getItem("user")!);
    if (user.role === "hr" || user.role === "recruiter") {
      navigate("/hr-dashboard");
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button onClick={() => navigate("/")} className="flex items-center gap-3 group">
          <img src={logo} alt="HF" className="w-10 h-10 rounded-full object-cover transition-shadow group-hover:shadow-gold" />
          <span className="font-display font-bold text-lg text-foreground">Intelli-Hire</span>
        </button>
        <ThemeToggle />
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
            {/* Tabs */}
            <div className="flex rounded-lg border border-border overflow-hidden mb-6">
              <button
                onClick={() => { setTab("login"); setError(""); }}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${tab === "login" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setTab("signup"); setError(""); }}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${tab === "signup" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
              >
                Sign Up
              </button>
            </div>

            <h1 className="font-display text-2xl font-bold text-foreground text-center">
              {tab === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-sm text-muted-foreground text-center mt-2">
              {tab === "login" ? "Sign in to continue" : "Join the Intelli-Hire platform"}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {tab === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full border border-input rounded-lg px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {tab === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as Role)}
                    className="w-full border border-input rounded-lg px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select your role...</option>
                    <option value="hr">HR</option>
                    <option value="fresher">Fresher</option>
                    <option value="recruiter">Recruiter</option>
                  </select>
                </div>
              )}

              {error && <p className="text-sm text-destructive font-medium">{error}</p>}

              <button
                type="submit"
                className="w-full bg-gold-gradient text-primary-foreground font-semibold py-3 rounded-lg shadow-gold hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
              >
                {tab === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center border-t border-border">
        <p className="text-xs text-muted-foreground">
          Developed by Hiba Fathima & Farhin Khanam · B.Tech CSE | 2026
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
