import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { JOB_ROLES, CANDIDATES } from "@/lib/analysis-data";
import { extractSkillsFromText, matchSkills, getMatchRecommendation } from "@/lib/skill-database";

interface ResumeEntry {
  id: number;
  name: string;
  text: string;
}

const AnalyzerPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'example' | 'custom'>('example');

  // Example mode
  const [selectedRole, setSelectedRole] = useState("");

  // Custom mode
  const [jobDescText, setJobDescText] = useState("");
  const [resumes, setResumes] = useState<ResumeEntry[]>([{ id: 1, name: "", text: "" }]);
  const [nextId, setNextId] = useState(2);

  // Resume image
  const [resumeImage, setResumeImage] = useState<string | null>(null);

  const selectedJobRole = JOB_ROLES.find(
    r => `${r.role} – ${r.company}` === selectedRole
  );

  const addResume = () => {
    setResumes(prev => [...prev, { id: nextId, name: "", text: "" }]);
    setNextId(prev => prev + 1);
  };

  const removeResume = (id: number) => {
    if (resumes.length <= 1) return;
    setResumes(prev => prev.filter(r => r.id !== id));
  };

  const updateResume = (id: number, field: 'name' | 'text', value: string) => {
    setResumes(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, resumeId: number) => {
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
    let role = "";
    let company = "";
    let allCandidates: { name: string; resumeText: string }[] = [];

    if (mode === 'example') {
      if (!selectedJobRole) return;
      jobKw = selectedJobRole.keywords;
      role = selectedJobRole.role;
      company = selectedJobRole.company;
      allCandidates = CANDIDATES.map(c => ({ name: c.name, resumeText: c.resumeText }));
    } else {
      if (!jobDescText.trim()) return;
      const validResumes = resumes.filter(r => r.text.trim());
      if (validResumes.length === 0) return;
      jobKw = extractSkillsFromText(jobDescText);
      role = "Custom Role";
      company = "Custom";
      allCandidates = validResumes.map(r => ({
        name: r.name || `Candidate ${r.id}`,
        resumeText: r.text,
      }));
    }

    // Analyze all candidates and find the best
    const rankings = allCandidates.map(c => {
      const result = matchSkills(jobKw, c.resumeText);
      return { ...c, matchPercentage: result.percentage, ...result };
    });
    rankings.sort((a, b) => b.matchPercentage - a.matchPercentage);

    const best = rankings[0];
    const rec = getMatchRecommendation(best.matchPercentage);

    const data = {
      jobKeywords: jobKw,
      resumeText: best.resumeText,
      role,
      company,
      candidateName: best.name,
      allCandidates,
    };

    sessionStorage.setItem('analysisData', JSON.stringify(data));
    navigate('/results');
  };

  const canAnalyze = mode === 'example'
    ? !!selectedRole
    : jobDescText.trim() !== '' && resumes.some(r => r.text.trim() !== '');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center">
            ATS Resume Screening
          </h1>
          <p className="text-center text-muted-foreground mt-2 text-sm">
            Add a job description and multiple resumes — unmatched candidates are eliminated automatically
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
                        <span key={k} className="text-xs px-2 py-1 rounded-md font-medium bg-accent/15 text-accent-foreground">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Candidates Preview */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-foreground">
                    Candidates to Screen ({CANDIDATES.length})
                  </label>
                  <span className="text-xs text-muted-foreground">All candidates will be ranked</span>
                </div>
                <div className="space-y-3">
                  {CANDIDATES.map(c => (
                    <div key={c.name} className="p-3 bg-secondary rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">{c.name}</span>
                        <span className="text-xs text-muted-foreground">{c.label}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {c.skills.slice(0, 5).map(s => (
                          <span key={s} className="text-xs bg-background px-1.5 py-0.5 rounded text-muted-foreground">{s}</span>
                        ))}
                        {c.skills.length > 5 && (
                          <span className="text-xs text-muted-foreground">+{c.skills.length - 5} more</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-6 animate-fade-in">
              {/* Job Description */}
              <div className="bg-card rounded-xl border border-border p-6">
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Job Description
                </label>
                <textarea
                  value={jobDescText}
                  onChange={e => setJobDescText(e.target.value)}
                  placeholder="Paste the job description copied from Google, LinkedIn, or company website..."
                  rows={5}
                  className="w-full border border-input rounded-lg px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Multiple Resumes */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-foreground">
                    Candidate Resumes ({resumes.length})
                  </label>
                  <button
                    onClick={addResume}
                    className="text-xs font-medium px-3 py-1.5 rounded-md bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                  >
                    + Add Candidate
                  </button>
                </div>
                <div className="space-y-4">
                  {resumes.map((r, i) => (
                    <div key={r.id} className="p-4 bg-secondary rounded-lg relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Resume #{i + 1}
                        </span>
                        {resumes.length > 1 && (
                          <button
                            onClick={() => removeResume(r.id)}
                            className="text-xs text-destructive hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={r.name}
                        onChange={e => updateResume(r.id, 'name', e.target.value)}
                        placeholder="Candidate name..."
                        className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-2"
                      />
                      <textarea
                        value={r.text}
                        onChange={e => updateResume(r.id, 'text', e.target.value)}
                        placeholder="Paste resume content — skills, experience, projects, certifications..."
                        rows={4}
                        className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      />
                      <div className="mt-2 flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">— OR —</span>
                        <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Upload Image
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, r.id)} />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                {resumeImage && (
                  <div className="mt-4 border border-border rounded-lg overflow-hidden">
                    <img src={resumeImage} alt="Uploaded resume" className="max-w-full max-h-48 object-contain mx-auto" />
                    <p className="text-xs text-muted-foreground text-center py-2">
                      Image uploaded. Please also paste text content for analysis.
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
              disabled={!canAnalyze}
              className="inline-flex items-center gap-2 bg-gold-gradient text-primary-foreground font-semibold px-10 py-3.5 rounded-lg shadow-gold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              Screen & Rank Candidates
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
