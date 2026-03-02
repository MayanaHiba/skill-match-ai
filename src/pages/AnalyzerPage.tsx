import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpeg";
import { JOB_ROLES, CANDIDATES, extractKeywords } from "@/lib/analysis-data";

const AnalyzerPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'example' | 'custom'>('example');
  
  // Example mode
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  
  // Custom mode
  const [jobDescText, setJobDescText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [candidateName, setCandidateName] = useState("");
  
  // Resume image
  const [resumeImage, setResumeImage] = useState<string | null>(null);

  const selectedJobRole = JOB_ROLES.find(
    r => `${r.role} – ${r.company}` === selectedRole
  );
  const selectedCand = CANDIDATES.find(
    c => `${c.name} – ${c.label}` === selectedCandidate
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setResumeImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    let jobKw: string[] = [];
    let resume = "";
    let role = "";
    let company = "";
    let name = "";

    if (mode === 'example') {
      if (!selectedJobRole || !selectedCand) return;
      jobKw = selectedJobRole.keywords;
      resume = selectedCand.resumeText;
      role = selectedJobRole.role;
      company = selectedJobRole.company;
      name = selectedCand.name;
    } else {
      if (!jobDescText.trim() || !resumeText.trim()) return;
      jobKw = extractKeywords(jobDescText);
      resume = resumeText;
      role = "Custom Role";
      company = "Custom";
      name = candidateName || "Custom Candidate";
    }

    const data = {
      jobKeywords: jobKw,
      resumeText: resume,
      role,
      company,
      candidateName: name,
      allCandidates: mode === 'example' ? CANDIDATES.map(c => ({
        name: c.name,
        resumeText: c.resumeText,
      })) : undefined,
    };

    sessionStorage.setItem('analysisData', JSON.stringify(data));
    navigate('/results');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button onClick={() => navigate('/home')} className="flex items-center gap-3 group">
          <img src={logo} alt="HF" className="w-10 h-10 rounded-full object-cover transition-shadow group-hover:shadow-gold" />
          <span className="font-display font-bold text-lg text-foreground">Intelli-Hire</span>
        </button>
      </nav>

      <main className="flex-1 py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center">
            Resume & Job Description Analyzer
          </h1>
          <p className="text-center text-muted-foreground mt-2 text-sm">
            Select a mode to begin analysis
          </p>

          {/* Mode Toggle */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex bg-secondary rounded-lg p-1 gap-1">
              <button
                onClick={() => setMode('example')}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'example'
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Example Mode
              </button>
              <button
                onClick={() => setMode('custom')}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
                  mode === 'custom'
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Custom Mode
              </button>
            </div>
          </div>

          {mode === 'example' ? (
            <div className="mt-8 space-y-6 animate-fade-in">
              {/* Role Select */}
              <div className="bg-card rounded-xl border border-border p-6">
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Select Company & Role
                </label>
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  className="w-full border border-input rounded-lg px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Choose a role...</option>
                  {JOB_ROLES.map(r => (
                    <option key={`${r.role}-${r.company}`} value={`${r.role} – ${r.company}`}>
                      {r.role} – {r.company}
                    </option>
                  ))}
                </select>
                {selectedJobRole && (
                  <div className="mt-4 p-4 bg-secondary rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Job Description Preview</p>
                    <p className="text-sm text-foreground">{selectedJobRole.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {selectedJobRole.keywords.map(k => (
                        <span key={k} className="text-xs bg-primary/10 text-primary-foreground/80 px-2 py-1 rounded-md font-medium"
                          style={{ backgroundColor: 'hsl(43 74% 49% / 0.12)', color: 'hsl(43 74% 38%)' }}>
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Candidate Select */}
              <div className="bg-card rounded-xl border border-border p-6">
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Select Candidate Resume
                </label>
                <select
                  value={selectedCandidate}
                  onChange={e => setSelectedCandidate(e.target.value)}
                  className="w-full border border-input rounded-lg px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Choose a candidate...</option>
                  {CANDIDATES.map(c => (
                    <option key={c.name} value={`${c.name} – ${c.label}`}>
                      {c.name} – {c.label}
                    </option>
                  ))}
                </select>
                {selectedCand && (
                  <div className="mt-4 p-4 bg-secondary rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Resume Preview</p>
                    <p className="text-sm text-foreground whitespace-pre-line">{selectedCand.resumeText}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-6 animate-fade-in">
              {/* Candidate Name */}
              <div className="bg-card rounded-xl border border-border p-6">
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={e => setCandidateName(e.target.value)}
                  placeholder="Enter candidate name..."
                  className="w-full border border-input rounded-lg px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Job Description */}
              <div className="bg-card rounded-xl border border-border p-6">
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Job Description
                </label>
                <textarea
                  value={jobDescText}
                  onChange={e => setJobDescText(e.target.value)}
                  placeholder="Paste the job description copied from Google, LinkedIn, or company website..."
                  rows={6}
                  className="w-full border border-input rounded-lg px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Resume */}
              <div className="bg-card rounded-xl border border-border p-6">
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Candidate Resume
                </label>
                <textarea
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste candidate resume text here. Include skills, experience, projects, certifications..."
                  rows={6}
                  className="w-full border border-input rounded-lg px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">— OR —</span>
                  <label className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload Resume Image
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                {resumeImage && (
                  <div className="mt-4 border border-border rounded-lg overflow-hidden">
                    <img src={resumeImage} alt="Uploaded resume" className="max-w-full max-h-64 object-contain mx-auto" />
                    <p className="text-xs text-muted-foreground text-center py-2">
                      Resume image uploaded. Please also paste the text content above for analysis.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleAnalyze}
              disabled={
                mode === 'example'
                  ? !selectedRole || !selectedCandidate
                  : !jobDescText.trim() || !resumeText.trim()
              }
              className="inline-flex items-center gap-2 bg-gold-gradient text-primary-foreground font-semibold px-10 py-3.5 rounded-lg shadow-gold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              Analyze Resume
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
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

export default AnalyzerPage;
