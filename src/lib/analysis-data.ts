export interface JobRole {
  company: string;
  role: string;
  keywords: string[];
  description: string;
}

export interface CandidateProfile {
  name: string;
  label: string;
  skills: string[];
  experience: string;
  resumeText: string;
}

export interface AnalysisResult {
  candidateName: string;
  role: string;
  company: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  totalRequired: number;
  recommendation: string;
  recommendationLevel: 'strong' | 'moderate' | 'weak';
}

export const JOB_ROLES: JobRole[] = [
  {
    company: "Microsoft",
    role: "Software Engineer",
    keywords: ["C++", "Data Structures", "Algorithms", "System Design", "Azure", "Git", "OOP", "Problem Solving"],
    description: "Looking for a Software Engineer skilled in C++, Data Structures, Algorithms, System Design, Azure, Git, OOP, and Problem Solving. Must have experience building scalable software systems."
  },
  {
    company: "Microsoft",
    role: "Data Scientist",
    keywords: ["Python", "Machine Learning", "Statistics", "SQL", "Pandas", "Data Visualization", "Deep Learning"],
    description: "Seeking a Data Scientist proficient in Python, Machine Learning, Statistics, SQL, Pandas, Data Visualization, and Deep Learning. Experience with large datasets required."
  },
  {
    company: "Amazon",
    role: "Backend Developer",
    keywords: ["Java", "Spring Boot", "REST API", "Microservices", "AWS", "SQL", "Scalability", "System Design"],
    description: "Hiring a Backend Developer with expertise in Java, Spring Boot, REST API, Microservices, AWS, SQL, Scalability, and System Design."
  },
  {
    company: "Amazon",
    role: "Cloud Engineer",
    keywords: ["AWS", "Docker", "Kubernetes", "CI/CD", "DevOps", "Linux", "Networking", "Infrastructure"],
    description: "Looking for a Cloud Engineer skilled in AWS, Docker, Kubernetes, CI/CD, DevOps, Linux, Networking, and Infrastructure management."
  },
  {
    company: "Google",
    role: "Machine Learning Engineer",
    keywords: ["Python", "TensorFlow", "PyTorch", "Deep Learning", "NLP", "Model Deployment", "Statistics"],
    description: "Seeking a Machine Learning Engineer proficient in Python, TensorFlow, PyTorch, Deep Learning, NLP, Model Deployment, and Statistics."
  },
  {
    company: "Google",
    role: "Frontend Engineer",
    keywords: ["JavaScript", "React", "HTML", "CSS", "TypeScript", "UI/UX", "Responsive Design"],
    description: "Hiring a Frontend Engineer with expertise in JavaScript, React, HTML, CSS, TypeScript, UI/UX, and Responsive Design."
  },
  {
    company: "Cognizant",
    role: "Full Stack Developer",
    keywords: ["JavaScript", "Node.js", "React", "MongoDB", "REST API", "Git", "Agile"],
    description: "Looking for a Full Stack Developer skilled in JavaScript, Node.js, React, MongoDB, REST API, Git, and Agile methodologies."
  },
  {
    company: "Cognizant",
    role: "Data Analyst",
    keywords: ["SQL", "Excel", "Power BI", "Data Visualization", "Python", "Statistics"],
    description: "Seeking a Data Analyst proficient in SQL, Excel, Power BI, Data Visualization, Python, and Statistics."
  },
];

export const CANDIDATES: CandidateProfile[] = [
  {
    name: "Candidate A",
    label: "ML Focus",
    skills: ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "SQL", "Statistics", "NLP", "Pandas"],
    experience: "Developed ML models for classification and regression tasks. Worked on data preprocessing, feature engineering, and model evaluation. Experience with NLP pipelines and deep learning architectures.",
    resumeText: "Skills: Python, Machine Learning, Deep Learning, TensorFlow, PyTorch, SQL, Statistics, NLP, Pandas\n\nExperience: Developed ML models for classification and regression tasks. Worked on data preprocessing, feature engineering, and model evaluation. Experience with NLP pipelines and deep learning architectures."
  },
  {
    name: "Candidate B",
    label: "Web Development",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "REST API", "HTML", "CSS", "Git", "Agile"],
    experience: "Built responsive web applications and backend APIs. Experience with full-stack development using MERN stack. Implemented CI/CD pipelines and agile workflows.",
    resumeText: "Skills: JavaScript, React, Node.js, MongoDB, REST API, HTML, CSS, Git, Agile\n\nExperience: Built responsive web applications and backend APIs. Experience with full-stack development using MERN stack. Implemented CI/CD pipelines and agile workflows."
  },
  {
    name: "Candidate C",
    label: "Cloud/Backend",
    skills: ["Java", "Spring Boot", "AWS", "Docker", "Kubernetes", "Microservices", "CI/CD", "Linux"],
    experience: "Designed scalable backend systems and deployed cloud infrastructure. Experience with containerization, orchestration, and microservices architecture.",
    resumeText: "Skills: Java, Spring Boot, AWS, Docker, Kubernetes, Microservices, CI/CD, Linux\n\nExperience: Designed scalable backend systems and deployed cloud infrastructure. Experience with containerization, orchestration, and microservices architecture."
  },
];

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
  "by", "from", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
  "do", "does", "did", "will", "would", "could", "should", "may", "might", "can",
  "this", "that", "these", "those", "i", "you", "he", "she", "it", "we", "they",
  "me", "him", "her", "us", "them", "my", "your", "his", "its", "our", "their",
  "what", "which", "who", "whom", "where", "when", "why", "how",
  "not", "no", "nor", "as", "if", "then", "than", "too", "very", "just",
  "about", "above", "after", "again", "all", "also", "am", "any", "because",
  "before", "between", "both", "each", "few", "more", "most", "other", "some",
  "such", "into", "over", "own", "same", "so", "up", "out", "only",
  "looking", "seeking", "hiring", "must", "experience", "required", "proficient",
  "skilled", "expertise", "candidate", "work", "working", "worked", "including",
  "etc", "using", "used", "ability", "strong", "good", "knowledge", "understanding",
  "need", "needs", "needed", "role", "position", "job", "company", "team",
]);

export function extractKeywords(text: string): string[] {
  const normalized = text.toLowerCase();
  const words = normalized.split(/[\s,;.()\/\-|]+/).filter(w => w.length > 1);
  
  const multiWordSkills = [
    "machine learning", "deep learning", "data structures", "system design",
    "data visualization", "data analysis", "problem solving", "rest api",
    "spring boot", "power bi", "responsive design", "model deployment",
    "ci/cd", "ui/ux", "node.js",
  ];
  
  const found = new Set<string>();
  const lowerText = normalized;
  
  for (const skill of multiWordSkills) {
    if (lowerText.includes(skill)) {
      found.add(skill);
    }
  }
  
  for (const word of words) {
    if (!STOP_WORDS.has(word) && word.length > 1) {
      found.add(word);
    }
  }
  
  return Array.from(found);
}

export function analyzeMatch(
  jobKeywords: string[],
  resumeText: string
): { matchedSkills: string[]; missingSkills: string[]; matchPercentage: number } {
  const resumeLower = resumeText.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];
  
  for (const keyword of jobKeywords) {
    if (resumeLower.includes(keyword.toLowerCase())) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  }
  
  const percentage = jobKeywords.length > 0
    ? Math.round((matched.length / jobKeywords.length) * 100)
    : 0;
  
  return { matchedSkills: matched, missingSkills: missing, matchPercentage: percentage };
}

export function getRecommendation(percentage: number): { text: string; level: 'strong' | 'moderate' | 'weak' } {
  if (percentage >= 75) {
    return {
      text: "Based on the analysis, the candidate demonstrates strong alignment with the required technical and domain skills. Suggested to proceed to the next stage of evaluation.",
      level: 'strong'
    };
  } else if (percentage >= 50) {
    return {
      text: "The candidate shows moderate alignment with the job requirements. Consider for interview with focus on skill gaps identified.",
      level: 'moderate'
    };
  } else {
    return {
      text: "The candidate needs significant improvement in key areas required for this role. Consider additional training or alternative positions.",
      level: 'weak'
    };
  }
}
