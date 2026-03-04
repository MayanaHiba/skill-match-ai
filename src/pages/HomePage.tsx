import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpeg";
import ThemeToggle from "@/components/ThemeToggle";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
          <img src={logo} alt="HF" className="w-10 h-10 rounded-full object-cover transition-shadow group-hover:shadow-gold" />
          <span className="font-display font-bold text-lg text-foreground">Intelli-Hire</span>
        </button>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-medium bg-gold-gradient text-primary-foreground px-4 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center animate-fade-in">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Intelli-Hire
          </h1>
          <p className="mt-3 text-lg md:text-xl text-muted-foreground font-medium">
            AI Resume Screening & Matching Platform
          </p>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Intelli-Hire is an AI-driven recruitment assistant that analyzes job descriptions and resumes to calculate compatibility scores, identify skill gaps, and provide data-driven hiring insights.
          </p>
          <button
            onClick={() => navigate('/analyzer')}
            className="mt-10 inline-flex items-center gap-2 bg-gold-gradient text-primary-foreground font-semibold px-8 py-3.5 rounded-lg shadow-gold hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            Start Analysis
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-border">
        <p className="text-xs text-muted-foreground">
          Developed by Hiba Fathima & Farhin Khanam
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          B.Tech CSE | 2026
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
