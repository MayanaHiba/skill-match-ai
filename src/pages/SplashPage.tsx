import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate("/home"), 2000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto">
          <span className="text-primary-foreground font-bold text-xl">SM</span>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Skill Match AI</h1>
        <p className="mt-1 text-sm text-muted-foreground">AI-Powered Career Matching</p>
      </div>
    </div>
  );
};

export default SplashPage;
