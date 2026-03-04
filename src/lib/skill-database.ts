// Predefined skill dictionary — only these terms are recognized as "skills"
export const SKILL_DATABASE: string[] = [
  // Programming Languages
  "python", "java", "javascript", "typescript", "c++", "c#", "c", "ruby", "go", "rust",
  "php", "swift", "kotlin", "scala", "r", "matlab", "perl", "dart", "lua",
  
  // Web & Frontend
  "react", "angular", "vue", "svelte", "next.js", "nuxt.js", "html", "css", "sass",
  "tailwind", "bootstrap", "jquery", "webpack", "vite", "responsive design", "ui/ux",
  
  // Backend & Frameworks
  "node.js", "express", "django", "flask", "spring boot", "spring", "fastapi",
  "asp.net", "rails", "laravel", "nest.js",
  
  // Databases
  "sql", "mysql", "postgresql", "mongodb", "redis", "cassandra", "dynamodb",
  "firebase", "sqlite", "oracle", "elasticsearch",
  
  // Cloud & DevOps
  "aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "jenkins", "terraform",
  "ansible", "linux", "devops", "nginx", "heroku", "vercel", "netlify",
  "infrastructure", "networking",
  
  // Data Science & ML
  "machine learning", "deep learning", "data analysis", "data visualization",
  "data structures", "algorithms", "statistics", "pandas", "numpy", "scipy",
  "tensorflow", "pytorch", "keras", "scikit-learn", "nlp", "computer vision",
  "model deployment", "data engineering", "big data", "spark", "hadoop",
  "tableau", "power bi", "excel",
  
  // APIs & Architecture
  "rest api", "graphql", "microservices", "system design", "scalability",
  "api design", "grpc", "websockets", "oauth",
  
  // Tools & Practices
  "git", "github", "gitlab", "jira", "agile", "scrum", "oop",
  "problem solving", "testing", "unit testing", "tdd", "bdd",
  
  // Other
  "blockchain", "cybersecurity", "iot", "embedded systems", "figma", "photoshop",
];

// Multi-word skills that need phrase matching
const MULTI_WORD_SKILLS = SKILL_DATABASE.filter(s => s.includes(" ") || s.includes("/") || s.includes("."));
const SINGLE_WORD_SKILLS = new Set(SKILL_DATABASE.filter(s => !s.includes(" ") && !s.includes("/") && !s.includes(".")));

/**
 * Extract only recognized skills from text using dictionary matching
 */
export function extractSkillsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();

  // Check multi-word skills first
  for (const skill of MULTI_WORD_SKILLS) {
    if (lower.includes(skill)) {
      found.add(skill);
    }
  }

  // Check single-word skills
  const words = lower.split(/[\s,;.()|\-–—:]+/).map(w => w.trim()).filter(Boolean);
  for (const word of words) {
    if (SINGLE_WORD_SKILLS.has(word)) {
      found.add(word);
    }
  }

  return Array.from(found);
}

/**
 * Match resume skills against job skills, return matched/missing/percentage
 */
export function matchSkills(
  jobSkills: string[],
  resumeText: string
): { matched: string[]; missing: string[]; percentage: number } {
  const resumeLower = resumeText.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];

  for (const skill of jobSkills) {
    if (resumeLower.includes(skill.toLowerCase())) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  const percentage = jobSkills.length > 0
    ? Math.round((matched.length / jobSkills.length) * 100)
    : 0;

  return { matched, missing, percentage };
}

/**
 * Get recommendation text + level from match percentage
 */
export function getMatchRecommendation(pct: number): {
  text: string;
  level: "strong" | "moderate" | "weak";
  label: string;
} {
  if (pct >= 75) {
    return {
      text: "Based on the analysis, the candidate demonstrates strong alignment with the required technical and domain skills. Suggested to proceed to the next stage of evaluation.",
      level: "strong",
      label: "Strong Fit",
    };
  } else if (pct >= 50) {
    return {
      text: "The candidate shows moderate alignment with the job requirements. Consider for interview with focus on skill gaps identified.",
      level: "moderate",
      label: "Moderate Fit",
    };
  }
  return {
    text: "The candidate needs significant improvement in key areas required for this role. Consider additional training or alternative positions.",
    level: "weak",
    label: "Needs Improvement",
  };
}
