import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpeg";

const SplashPage = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'reveal' | 'shrink' | 'done'>('reveal');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('shrink'), 2500);
    const t2 = setTimeout(() => navigate('/home'), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center overflow-hidden">
      <div
        className={`flex flex-col items-center transition-all duration-700 ease-in-out ${
          phase === 'reveal' ? 'opacity-100 scale-100' : 
          phase === 'shrink' ? 'opacity-0 scale-75 -translate-y-20' : 'opacity-0'
        }`}
      >
        <div className="animate-fade-in">
          <img
            src={logo}
            alt="Intelli-Hire Logo"
            className="w-44 h-44 md:w-52 md:h-52 rounded-full shadow-gold object-cover"
          />
        </div>
        <h1
          className="mt-8 text-3xl md:text-4xl font-display font-bold text-gradient-gold animate-slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          Intelli-Hire
        </h1>
        <p
          className="mt-2 text-dark-foreground/70 text-sm md:text-base tracking-wide animate-slide-up"
          style={{ animationDelay: '0.6s' }}
        >
          AI-Powered Resume Screening System
        </p>
        <p
          className="mt-6 text-dark-foreground/40 text-xs tracking-widest uppercase animate-slide-up"
          style={{ animationDelay: '0.9s' }}
        >
          Smart Hiring · Faster Decisions · Smarter Future
        </p>
      </div>
    </div>
  );
};

export default SplashPage;
