import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpeg";
import { analyzeMatch, getRecommendation, type AnalysisResult } from "@/lib/analysis-data";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ResultsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [candidateRanking, setCandidateRanking] = useState<{ name: string; score: number }[]>([]);

  useEffect(() => {
    const raw = sessionStorage.getItem('analysisData');
    if (!raw) {
      navigate('/analyzer');
      return;
    }

    const timer = setTimeout(() => {
      const data = JSON.parse(raw);
      const { matchedSkills, missingSkills, matchPercentage } = analyzeMatch(
        data.jobKeywords,
        data.resumeText
      );
      const rec = getRecommendation(matchPercentage);

      setResult({
        candidateName: data.candidateName,
        role: data.role,
        company: data.company,
        matchPercentage,
        matchedSkills,
        missingSkills,
        totalRequired: data.jobKeywords.length,
        recommendation: rec.text,
        recommendationLevel: rec.level,
      });

      // Rank all candidates if example mode
      if (data.allCandidates) {
        const rankings = data.allCandidates.map((c: { name: string; resumeText: string }) => {
          const r = analyzeMatch(data.jobKeywords, c.resumeText);
          return { name: c.name, score: r.matchPercentage };
        });
        rankings.sort((a: { score: number }, b: { score: number }) => b.score - a.score);
        setCandidateRanking(rankings);
      }

      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="mt-6 text-foreground font-display font-semibold text-lg">Analyzing Resume...</p>
          <p className="mt-2 text-muted-foreground text-sm">AI processing in progress</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const pieData = [
    { name: "Matched", value: result.matchPercentage },
    { name: "Gap", value: 100 - result.matchPercentage },
  ];

  const barData = [
    { name: "Required", value: result.totalRequired, fill: "hsl(0 0% 80%)" },
    { name: "Matched", value: result.matchedSkills.length, fill: "hsl(43 74% 49%)" },
    { name: "Missing", value: result.missingSkills.length, fill: "hsl(0 0% 60%)" },
  ];

  const levelColors = {
    strong: 'text-green-700 bg-green-50 border-green-200',
    moderate: 'text-amber-700 bg-amber-50 border-amber-200',
    weak: 'text-red-700 bg-red-50 border-red-200',
  };

  const levelLabels = {
    strong: 'Strong Fit',
    moderate: 'Moderate Fit',
    weak: 'Needs Improvement',
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button onClick={() => navigate('/home')} className="flex items-center gap-3 group">
          <img src={logo} alt="HF" className="w-10 h-10 rounded-full object-cover transition-shadow group-hover:shadow-gold" />
          <span className="font-display font-bold text-lg text-foreground">Intelli-Hire</span>
        </button>
        <img src={logo} alt="HF" className="w-8 h-8 rounded-full object-cover opacity-60" />
      </nav>

      <main className="flex-1 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center">
            Match Analysis Report
          </h1>

          {/* Candidate Info */}
          <div className="mt-8 bg-card rounded-xl border border-border p-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider">Candidate</p>
                <p className="font-semibold text-foreground mt-1">{result.candidateName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider">Role</p>
                <p className="font-semibold text-foreground mt-1">{result.role}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider">Company</p>
                <p className="font-semibold text-foreground mt-1">{result.company}</p>
              </div>
            </div>
          </div>

          {/* Score Card */}
          <div className="mt-6 bg-card rounded-xl border border-border p-8 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Overall Compatibility Score</p>
            <div className="flex justify-center">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    <Cell fill="hsl(43, 74%, 49%)" />
                    <Cell fill="hsl(0, 0%, 92%)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="-mt-[130px] mb-[60px]">
              <span className="text-4xl font-display font-bold text-foreground">{result.matchPercentage}%</span>
            </div>
            <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full border ${levelColors[result.recommendationLevel]}`}>
              {levelLabels[result.recommendationLevel]} – Recommended for Technical Interview
            </span>
            <p className="text-xs text-muted-foreground mt-3 max-w-md mx-auto">
              This score represents the percentage alignment between required job skills and the candidate's resume.
            </p>
          </div>

          {/* Skills */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl border border-border p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="font-display font-semibold text-foreground mb-4">Skills Matched</h3>
              <div className="space-y-2">
                {result.matchedSkills.map(s => (
                  <div key={s} className="flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">✓</span>
                    <span className="text-foreground">{s}</span>
                  </div>
                ))}
                {result.matchedSkills.length === 0 && (
                  <p className="text-sm text-muted-foreground">No skills matched</p>
                )}
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="font-display font-semibold text-foreground mb-4">Skills Missing</h3>
              <div className="space-y-2">
                {result.missingSkills.map(s => (
                  <div key={s} className="flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs">✗</span>
                    <span className="text-foreground">{s}</span>
                  </div>
                ))}
                {result.missingSkills.length === 0 && (
                  <p className="text-sm text-muted-foreground">No missing skills!</p>
                )}
              </div>
            </div>
          </div>

          {/* Analysis Visualization */}
          <div className="mt-8 bg-card rounded-xl border border-border p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="font-display font-semibold text-foreground mb-2">Analysis Visualization</h3>
            <p className="text-xs text-muted-foreground mb-6">Skills Alignment Breakdown</p>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 92%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(0, 0%, 45%)' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'hsl(0, 0%, 45%)' }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Candidate Ranking */}
          {candidateRanking.length > 0 && (
            <div className="mt-6 bg-card rounded-xl border border-border p-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <h3 className="font-display font-semibold text-foreground mb-4">Candidate Ranking</h3>
              <div className="space-y-3">
                {candidateRanking.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-4">
                    <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-foreground">{c.name}</span>
                        <span className="text-muted-foreground">{c.score}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold-gradient rounded-full transition-all duration-1000"
                          style={{ width: `${c.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final Recommendation */}
          <div className="mt-6 bg-card rounded-xl border border-border p-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <h3 className="font-display font-semibold text-foreground mb-3">Final Recommendation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{result.recommendation}</p>
          </div>

          {/* Back Button */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigate('/analyzer')}
              className="inline-flex items-center gap-2 border border-border text-foreground font-medium px-6 py-3 rounded-lg hover:bg-secondary transition-colors"
            >
              ← Back to Analyzer
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem('analysisData');
                navigate('/analyzer');
              }}
              className="inline-flex items-center gap-2 bg-gold-gradient text-primary-foreground font-medium px-6 py-3 rounded-lg shadow-gold hover:shadow-lg transition-all"
            >
              New Analysis
            </button>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center border-t border-border">
        <p className="text-xs text-muted-foreground">
          Developed by Hiba Fathima & Farhin Khanam · B.Tech CSE | 2026
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          © 2026 Intelli-Hire. Academic Prototype for AI-Assisted Recruitment.
        </p>
      </footer>
    </div>
  );
};

export default ResultsPage;
