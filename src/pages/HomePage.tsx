import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { isLoggedIn } from "@/lib/auth";
import { Upload, Search, BarChart3, FileText, CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const SAMPLE_RESULTS = [
  {
    role: "Frontend Developer",
    match: 85,
    matching: ["React", "JavaScript", "CSS", "HTML"],
    missing: ["TypeScript", "GraphQL"],
  },
  {
    role: "Full Stack Engineer",
    match: 68,
    matching: ["React", "JavaScript", "Node.js"],
    missing: ["Docker", "AWS", "PostgreSQL"],
  },
  {
    role: "UI/UX Designer",
    match: 52,
    matching: ["CSS", "Figma"],
    missing: ["Sketch", "User Research", "Prototyping"],
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const [skills, setSkills] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleGetStarted = () => {
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    document.getElementById("skills-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUploadResume = () => {
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    navigate("/analyzer");
  };

  const handleAnalyze = () => {
    if (!skills.trim()) return;
    setShowResults(true);
    setTimeout(() => {
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-2xl w-full text-center animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Match Your Skills with the Right Career
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-lg mx-auto">
            Discover suitable career roles based on your skills.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
            <button
              onClick={handleUploadResume}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:bg-secondary transition-colors"
            >
              Upload Resume
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 bg-card border-y border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">How It Works</h2>
          <p className="mt-2 text-sm text-muted-foreground">Three simple steps to find your ideal career match.</p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: FileText, title: "Enter Skills", desc: "Type your skills or upload a resume." },
              { icon: Search, title: "AI Analysis", desc: "We match your skills to career roles." },
              { icon: BarChart3, title: "Get Results", desc: "View match scores and skill gaps." },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-4">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Input */}
      <section id="skills-section" className="px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground text-center">Enter Your Skills</h2>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            Separate skills with commas (e.g., React, Python, SQL)
          </p>
          <div className="mt-6">
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, JavaScript, CSS, Node.js..."
              className="w-full min-h-[100px] rounded-lg border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <button
              onClick={handleAnalyze}
              disabled={!skills.trim()}
              className="mt-4 w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Analyze Skills
            </button>
          </div>
        </div>
      </section>

      {/* Resume Upload */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 bg-card border-y border-border">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Upload Your Resume</h2>
          <p className="mt-2 text-sm text-muted-foreground">Let AI extract and analyze your skills automatically.</p>
          <button
            onClick={handleUploadResume}
            className="mt-6 w-full border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Click to upload resume</span>
            <span className="text-xs text-muted-foreground">PDF, DOC, or paste text</span>
          </button>
        </div>
      </section>

      {/* Results */}
      {showResults && (
        <section id="results-section" className="px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground text-center">Your Career Matches</h2>
            <p className="mt-2 text-sm text-muted-foreground text-center">Based on the skills you entered.</p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SAMPLE_RESULTS.map((result, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-card p-5 shadow-sm animate-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <h3 className="font-semibold text-foreground text-sm">{result.role}</h3>
                  <div className="mt-3 flex items-center gap-3">
                    <Progress value={result.match} className="h-2 flex-1" />
                    <span className="text-xs font-semibold text-foreground">{result.match}%</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-primary" /> Matching Skills
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {result.matching.map((s) => (
                          <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-destructive" /> Missing Skills
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {result.missing.map((s) => (
                          <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-6 text-center border-t border-border">
        <p className="text-xs text-muted-foreground">Skill Match AI — Built by Hiba Fathima & Farhin Khanam</p>
        <p className="text-xs text-muted-foreground mt-1">B.Tech CSE | 2026</p>
      </footer>
    </div>
  );
};

export default HomePage;
