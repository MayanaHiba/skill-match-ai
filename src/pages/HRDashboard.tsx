import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { extractSkillsFromText } from "@/lib/skill-database";
import { VIRTUAL_CANDIDATES, JOB_ROLES_DB, rankCandidates } from "@/lib/dummy-data";

const HRDashboard = () => {
  const navigate = useNavigate();
  const [jdText, setJdText] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("");
  const [results, setResults] = useState<ReturnType<typeof rankCandidates> | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);

  const session = JSON.parse(sessionStorage.getItem("userSession") || "{}");

  const handlePresetSelect = (val: string) => {
    setSelectedPreset(val);
    const found = JOB_ROLES_DB.find(j => `${j.role} – ${j.company}` === val);
    if (found) {
      setJdText(found.description);
    }
  };

  const handleScreen = () => {
    if (!jdText.trim()) return;
    setLoading(true);

    setTimeout(() => {
      // Extract skills from JD using dictionary
      let skills: string[];
      const preset = JOB_ROLES_DB.find(j => `${j.role} – ${j.company}` === selectedPreset);
      if (preset) {
        skills = preset.skills;
      } else {
        skills = extractSkillsFromText(jdText);
      }

      setExtractedSkills(skills);
      const ranked = rankCandidates(skills, VIRTUAL_CANDIDATES);
      setResults(ranked);
      setLoading(false);
    }, 1200);
  };

  const top10 = results?.slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              HR Dashboard
            </h1>
            {session.companyName && (
              <span className="text-sm text-muted-foreground">{session.companyName}</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-8">
            Paste a job description to screen {VIRTUAL_CANDIDATES.length} candidates and see top matches
          </p>

          {/* JD Input */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <label className="block text-sm font-semibold text-foreground">Job Description</label>

            <select
              value={selectedPreset}
              onChange={e => handlePresetSelect(e.target.value)}
              className="w-full border border-input rounded-lg px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Or select a sample role...</option>
              {JOB_ROLES_DB.map(j => (
                <option key={`${j.role}-${j.company}`} value={`${j.role} – ${j.company}`}>
                  {j.role} – {j.company}
                </option>
              ))}
            </select>

            <textarea
              value={jdText}
              onChange={e => { setJdText(e.target.value); setSelectedPreset(""); }}
              placeholder="Paste the job description from Google, LinkedIn, or company career page..."
              rows={5}
              className="w-full border border-input rounded-lg px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />

            <div className="text-center">
              <button
                onClick={handleScreen}
                disabled={!jdText.trim() || loading}
                className="inline-flex items-center gap-2 bg-gold-gradient text-primary-foreground font-semibold px-10 py-3 rounded-lg shadow-gold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-40 disabled:hover:scale-100"
              >
                {loading ? "Screening..." : `Screen ${VIRTUAL_CANDIDATES.length} Candidates`}
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="mt-10 flex justify-center">
              <div className="text-center animate-fade-in">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                <p className="mt-4 text-sm text-muted-foreground">Screening {VIRTUAL_CANDIDATES.length} resumes...</p>
              </div>
            </div>
          )}

          {/* Results */}
          {results && !loading && (
            <div className="mt-8 animate-fade-in space-y-6">
              {/* Extracted Skills */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-display font-semibold text-foreground mb-3">Extracted JD Skills ({extractedSkills.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.map(s => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-md font-medium bg-accent/15 text-accent-foreground capitalize">
                      {s}
                    </span>
                  ))}
                  {extractedSkills.length === 0 && (
                    <p className="text-sm text-muted-foreground">No recognized skills found in job description.</p>
                  )}
                </div>
              </div>

              {/* Top 10 */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-display font-semibold text-foreground mb-1">
                  Top 10 Candidates
                </h3>
                <p className="text-xs text-muted-foreground mb-5">
                  Ranked by skill match percentage out of {VIRTUAL_CANDIDATES.length} screened
                </p>

                <div className="space-y-4">
                  {top10.map((r, i) => {
                    const levelColor = r.percentage >= 75 ? "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800"
                      : r.percentage >= 50 ? "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800"
                      : "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800";
                    
                    return (
                      <div key={r.candidate.id} className="p-4 bg-secondary rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{r.candidate.name}</p>
                              <p className="text-xs text-muted-foreground">{r.candidate.education} · {r.candidate.experience}yr exp</p>
                            </div>
                          </div>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${levelColor}`}>
                            {r.percentage}%
                          </span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden mb-3">
                          <div className="h-full bg-gold-gradient rounded-full transition-all duration-1000"
                            style={{ width: `${r.percentage}%` }} />
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {r.candidate.skills.map(s => {
                            const isMatched = r.matched.includes(s);
                            return (
                              <span key={s}
                                className={`text-xs px-2 py-0.5 rounded capitalize ${isMatched
                                  ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                  : "bg-background text-muted-foreground"}`}>
                                {s}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Eliminated */}
              {results.length > 10 && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    Eliminated Candidates ({results.length - 10})
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Candidates ranked below top 10 — lower skill alignment
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {results.slice(10).map(r => (
                      <div key={r.candidate.id} className="text-xs p-2 bg-secondary rounded">
                        <span className="text-foreground">{r.candidate.name}</span>
                        <span className="text-muted-foreground ml-1">({r.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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

export default HRDashboard;
