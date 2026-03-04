import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpeg";
import ThemeToggle from "@/components/ThemeToggle";

type Role = "" | "hr" | "recruiter" | "candidate" | "admin";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!role) {
      setError("Please select a role.");
      return;
    }
    if ((role === "hr" || role === "recruiter") && !companyName.trim()) {
      setError("Please enter your company name.");
      return;
    }

    // Store session info
    const session = { email, role, companyName: companyName.trim() || undefined };
    sessionStorage.setItem("userSession", JSON.stringify(session));

    if (role === "hr" || role === "recruiter" || role === "admin") {
      navigate("/hr-dashboard");
    } else {
      navigate("/candidate-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button onClick={() => navigate("/home")} className="flex items-center gap-3 group">
          <img src={logo} alt="HF" className="w-10 h-10 rounded-full object-cover transition-shadow group-hover:shadow-gold" />
          <span className="font-display font-bold text-lg text-foreground">Intelli-Hire</span>
        </button>
        <ThemeToggle />
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
            <h1 className="font-display text-2xl font-bold text-foreground text-center">Sign In</h1>
            <p className="text-sm text-muted-foreground text-center mt-2">Access the Intelli-Hire platform</p>

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
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

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as Role)}
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select your role...</option>
                  <option value="hr">HR</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="candidate">Candidate</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {(role === "hr" || role === "recruiter") && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="Enter your company name"
                    className="w-full border border-input rounded-lg px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}

              {error && (
                <p className="text-sm text-destructive font-medium">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-gold-gradient text-primary-foreground font-semibold py-3 rounded-lg shadow-gold hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
              >
                Sign In
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
