// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { extractSkillsFromText, matchSkills, getMatchRecommendation } from "@/lib/skill-database";
import { JOB_ROLES_DB, recommendAlternativeRoles } from "@/lib/dummy-data";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [inputMode, setInputMode] = useState<"paste" | "upload">("paste");
  const [resumeText, setResumeText] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [resumePreview, setResumePreview] = useState<{ name: string; skills: string[]; raw: string } | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [result, setResult] = useState<{
    matched: string[];
    missing: string[];
    percentage: number;
    rec: ReturnType<typeof getMatchRecommendation>;
    alternatives: { role: string; company: string; percentage: number }[];
    jobSkills: string[];
    roleName: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmitResume = () => {
    setError("");
    if (inputMode === "paste" && !resumeText.trim()) {
      setError("Please paste your resume content.");
      return;
    }
    if (inputMode === "upload" && !uploadedImage) {
      setError("Please upload your resume file.");
      return;
    }

    const text = inputMode === "paste" ? resumeText : "";
    const skills = extractSkillsFromText(text);
    setResumePreview({
      name: "You",
      skills,
      raw: text,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    if (!resumePreview) return;
    if (!selectedRole) {
      setError("Please select a target role.");
      return;
    }
    setError("");
    setLoading(true);

    setTimeout(() => {
      const job = JOB_ROLES_DB.find(j => `${j.role} – ${j.company}` === selectedRole);
      if (!job) return;

      const { matched, missing, percentage } = matchSkills(job.skills, resumePreview.raw);
      const rec = getMatchRecommendation(percentage);

      let alternatives: { role: string; company: string; percentage: number }[] = [];
      if (percentage < 70) {
        alternatives = recommendAlternativeRoles(resumePreview.skills, job.role);
      }

      setResult({
        matched,
        missing,
        percentage,
        rec,
        alternatives,
        jobSkills: job.skills,
        roleName: `${job.role} – ${job.company}`,
      });
      setLoading(false);
    }, 1200);
  };

  const levelColors: Record<string, string> = {
    strong: "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800",
    moderate: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800",
    weak: "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Candidate Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1 mb-8">
            Submit your resume and check compatibility with job roles
          </p>

          {/* Step 1: Resume Input */}
          {!resumePreview && (
            <div className="bg-card rounded-xl border border-border p-6 animate-fade-in space-y-5">
              <h2 className="font-display font-semibold text-foreground">Step 1: Submit Resume</h2>

              {/* Radio toggle */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={inputMode === "paste"} onChange={() => setInputMode("paste")}
                    className="accent-[hsl(43,74%,49%)]" />
                  <span className="text-sm text-foreground">Paste Resume</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={inputMode === "upload"} onChange={() => setInputMode("upload")}
                    className="accent-[hsl(43,74%,49%)]" />
                  <span className="text-sm text-foreground">Upload Resume File</span>
                </label>
              </div>

              {inputMode === "paste" ? (
                <textarea
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste your complete resume text here — include skills, experience, projects, certifications..."
                  rows={8}
                  className="w-full border border-input rounded-lg px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              ) : (
                <div className="border-2 border-dashed border-input rounded-lg p-8 text-center">
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-muted-foreground">Upload Resume (PDF, DOCX, JPG, PNG)</p>
                      <p className="text-xs text-muted-foreground">Click to browse files</p>
                    </div>
                    <input type="file" accept=".pdf,.docx,.doc,.jpg,.jpeg,.png" className="hidden" onChange={handleFileUpload} />
                  </label>
                  {uploadedImage && (
                    <div className="mt-4">
                      <img src={uploadedImage} alt="Uploaded resume" className="max-h-40 mx-auto rounded-lg border border-border" />
                      <p className="text-xs text-muted-foreground mt-2">File uploaded. For best analysis, also paste text content.</p>
                      <textarea
                        value={resumeText}
                        onChange={e => setResumeText(e.target.value)}
                        placeholder="Paste resume text for analysis..."
                        rows={4}
                        className="mt-3 w-full border border-input rounded-lg px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {error && <p className="text-sm text-destructive font-medium">{error}</p>}

              <button
                onClick={handleSubmitResume}
                className="w-full bg-gold-gradient text-primary-foreground font-semibold py-3 rounded-lg shadow-gold hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
              >
                Submit Resume
              </button>
            </div>
          )}

          {/* Resume Preview */}
          {resumePreview && !result && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display font-semibold text-foreground">Resume Preview</h2>
                  <button onClick={() => { setResumePreview(null); setResult(null); }}
                    className="text-xs text-muted-foreground hover:text-foreground">Change Resume</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Detected Skills ({resumePreview.skills.length})</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {resumePreview.skills.map(s => (
                        <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-accent/15 text-accent-foreground capitalize">{s}</span>
                      ))}
                      {resumePreview.skills.length === 0 && (
                        <p className="text-xs text-muted-foreground">No recognized skills detected. Try pasting more content.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Select Role */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display font-semibold text-foreground mb-3">Step 2: Select Target Role</h2>
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  className="w-full border border-input rounded-lg px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Choose a role...</option>
                  {JOB_ROLES_DB.map(j => (
                    <option key={`${j.role}-${j.company}`} value={`${j.role} – ${j.company}`}>
                      {j.role} – {j.company}
                    </option>
                  ))}
                </select>

                {error && <p className="text-sm text-destructive font-medium mt-3">{error}</p>}

                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="mt-4 w-full bg-gold-gradient text-primary-foreground font-semibold py-3 rounded-lg shadow-gold hover:shadow-lg hover:scale-[1.01] transition-all duration-300 disabled:opacity-40"
                >
                  {loading ? "Analyzing..." : "Analyze Match"}
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="mt-10 flex justify-center">
              <div className="text-center animate-fade-in">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                <p className="mt-4 text-sm text-muted-foreground">Analyzing compatibility...</p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div className="mt-8 space-y-6 animate-fade-in">
              {/* Score */}
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Compatibility Score for {result.roleName}</p>
                <div className="flex justify-center">
                  <div className="relative w-[140px] h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[
                          { name: "Matched", value: result.percentage },
                          { name: "Gap", value: 100 - result.percentage },
                        ]} cx="50%" cy="50%" innerRadius={45} outerRadius={65} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                          <Cell fill="hsl(43, 74%, 49%)" />
                          <Cell fill="hsl(0, 0%, 92%)" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-display font-bold text-foreground">{result.percentage}%</span>
                    </div>
                  </div>
                </div>
                <span className={`mt-4 inline-block text-xs font-semibold px-3 py-1.5 rounded-full border ${levelColors[result.rec.level]}`}>
                  {result.rec.label}
                </span>
              </div>

              {/* Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">Skills Matched</h3>
                  <div className="space-y-2">
                    {result.matched.map(s => (
                      <div key={s} className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center text-green-600 dark:text-green-400 text-xs">✓</span>
                        <span className="text-foreground capitalize">{s}</span>
                      </div>
                    ))}
                    {result.matched.length === 0 && <p className="text-sm text-muted-foreground">No skills matched</p>}
                  </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">Skills Missing</h3>
                  <div className="space-y-2">
                    {result.missing.map(s => (
                      <div key={s} className="flex items-center gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-red-600 dark:text-red-400 text-xs">✗</span>
                        <span className="text-foreground capitalize">{s}</span>
                      </div>
                    ))}
                    {result.missing.length === 0 && <p className="text-sm text-muted-foreground">No missing skills!</p>}
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-display font-semibold text-foreground mb-2">Skills Alignment</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={[
                    { name: "Required", value: result.jobSkills.length, fill: "hsl(0, 0%, 80%)" },
                    { name: "Matched", value: result.matched.length, fill: "hsl(43, 74%, 49%)" },
                    { name: "Missing", value: result.missing.length, fill: "hsl(0, 0%, 60%)" },
                  ]} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 92%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(0, 0%, 45%)" }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "hsl(0, 0%, 45%)" }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {[0, 1, 2].map(i => (
                        <Cell key={i} fill={["hsl(0,0%,80%)", "hsl(43,74%,49%)", "hsl(0,0%,60%)"][i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Alternative Role Recommendations */}
              {result.alternatives.length > 0 && (
                <div className="bg-card rounded-xl border-2 border-primary/30 p-6 animate-slide-up">
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    🎯 Recommended Alternative Roles
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Since your match is below 70%, here are better-fitting roles for your skills:
                  </p>
                  <div className="space-y-3">
                    {result.alternatives.map(alt => (
                      <div key={`${alt.role}-${alt.company}`} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{alt.role}</p>
                          <p className="text-xs text-muted-foreground">{alt.company}</p>
                        </div>
                        <span className="text-sm font-bold text-foreground">{alt.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-display font-semibold text-foreground mb-3">Recommendation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.rec.text}</p>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-4">
                <button onClick={() => { setResult(null); setResumePreview(null); setResumeText(""); setSelectedRole(""); setUploadedImage(null); }}
                  className="border border-border text-foreground font-medium px-6 py-3 rounded-lg hover:bg-secondary transition-colors">
                  New Analysis
                </button>
              </div>
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

export default CandidateDashboard;
