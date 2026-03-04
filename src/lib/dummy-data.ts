// ============ 50 Virtual Candidate Profiles ============

export interface VirtualCandidate {
  id: number;
  name: string;
  skills: string[];
  experience: number;
  education: string;
}

export interface JobRoleEntry {
  role: string;
  company: string;
  skills: string[];
  description: string;
}

const firstNames = [
  "Aarav", "Zoya", "Rohan", "Ishita", "Arjun", "Sneha", "Vikram", "Priya", "Karthik", "Ananya",
  "Rahul", "Meera", "Aditya", "Divya", "Siddharth", "Nisha", "Varun", "Kavya", "Harsh", "Pooja",
  "Nikhil", "Riya", "Amit", "Sana", "Devansh", "Aisha", "Pranav", "Tanvi", "Yash", "Isha",
  "Manav", "Simran", "Kunal", "Neha", "Dhruv", "Anjali", "Rishabh", "Sakshi", "Akash", "Tanya",
  "Gaurav", "Shreya", "Mayank", "Parul", "Vivek", "Komal", "Sahil", "Deepika", "Mohit", "Swati",
];

const lastNames = [
  "Sharma", "Khan", "Mehta", "Verma", "Patel", "Gupta", "Reddy", "Iyer", "Singh", "Nair",
  "Das", "Joshi", "Rao", "Chopra", "Malhotra", "Banerjee", "Mishra", "Kapoor", "Agarwal", "Bhat",
  "Chauhan", "Desai", "Kumar", "Shah", "Pandey", "Saxena", "Tiwari", "Jain", "Thakur", "Yadav",
  "Pillai", "Menon", "Sinha", "Kulkarni", "Dutta", "Roy", "Sen", "Ghosh", "Mukherjee", "Bose",
  "Hegde", "Kamath", "Shetty", "Naik", "Rane", "Patil", "Garg", "Bajaj", "Sethi", "Arora",
];

const skillPool = [
  "python", "java", "c++", "sql", "machine learning", "deep learning",
  "react", "node.js", "html", "css", "javascript", "typescript",
  "aws", "docker", "kubernetes", "linux", "data analysis",
  "power bi", "tableau", "excel", "nlp", "tensorflow", "pytorch",
  "spring boot", "mongodb", "firebase", "git", "agile",
  "rest api", "microservices", "system design", "data structures",
  "algorithms", "statistics", "pandas", "numpy", "data visualization",
  "ci/cd", "devops", "angular", "vue", "flask", "django",
  "graphql", "redis", "postgresql", "oop", "problem solving",
  "responsive design", "ui/ux", "scala", "r", "scikit-learn",
];

const educations = [
  "B.Tech CSE", "B.Tech IT", "B.Tech ECE", "M.Tech AI", "M.Tech CSE",
  "BCA", "MCA", "B.Sc CS", "M.Sc Data Science", "MBA IT",
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateCandidates(): VirtualCandidate[] {
  const rand = seededRandom(42);
  const candidates: VirtualCandidate[] = [];

  for (let i = 0; i < 50; i++) {
    const numSkills = 4 + Math.floor(rand() * 6); // 4-9 skills
    const shuffled = [...skillPool].sort(() => rand() - 0.5);
    const skills = shuffled.slice(0, numSkills);
    
    candidates.push({
      id: i + 1,
      name: `${firstNames[i]} ${lastNames[i]}`,
      skills,
      experience: 1 + Math.floor(rand() * 5),
      education: educations[Math.floor(rand() * educations.length)],
    });
  }

  return candidates;
}

export const VIRTUAL_CANDIDATES: VirtualCandidate[] = generateCandidates();

// ============ Job Role Skill Database ============

export const JOB_ROLES_DB: JobRoleEntry[] = [
  {
    role: "Software Engineer",
    company: "Google",
    skills: ["python", "java", "data structures", "algorithms", "system design"],
    description: "Design and develop scalable software solutions. Strong foundation in algorithms, data structures, and system design required.",
  },
  {
    role: "Research Engineer",
    company: "Microsoft",
    skills: ["python", "machine learning", "deep learning", "nlp", "tensorflow"],
    description: "Conduct applied research in machine learning and NLP. Experience with deep learning frameworks required.",
  },
  {
    role: "Frontend Developer",
    company: "Meta",
    skills: ["react", "javascript", "html", "css", "typescript"],
    description: "Build responsive, high-performance web interfaces using React and TypeScript.",
  },
  {
    role: "DevOps Engineer",
    company: "Amazon",
    skills: ["aws", "docker", "kubernetes", "linux", "ci/cd"],
    description: "Manage cloud infrastructure, CI/CD pipelines, and container orchestration on AWS.",
  },
  {
    role: "Data Analyst",
    company: "Deloitte",
    skills: ["sql", "excel", "power bi", "tableau", "statistics"],
    description: "Analyze business data, create dashboards, and deliver data-driven insights using BI tools.",
  },
  {
    role: "Backend Developer",
    company: "Amazon",
    skills: ["java", "spring boot", "rest api", "microservices", "aws", "sql", "system design"],
    description: "Build scalable backend services and RESTful APIs using Java and Spring Boot on AWS.",
  },
  {
    role: "Machine Learning Engineer",
    company: "Google",
    skills: ["python", "tensorflow", "pytorch", "deep learning", "nlp", "statistics"],
    description: "Develop and deploy production ML models. Experience with NLP and deep learning required.",
  },
  {
    role: "Full Stack Developer",
    company: "Cognizant",
    skills: ["javascript", "react", "node.js", "mongodb", "rest api", "git", "agile"],
    description: "Build end-to-end web applications using the MERN stack with agile practices.",
  },
  {
    role: "Cloud Engineer",
    company: "Amazon",
    skills: ["aws", "docker", "kubernetes", "ci/cd", "devops", "linux"],
    description: "Design and manage cloud infrastructure, containerization, and deployment pipelines.",
  },
  {
    role: "Data Scientist",
    company: "Microsoft",
    skills: ["python", "machine learning", "statistics", "sql", "pandas", "data visualization"],
    description: "Apply statistical modeling and machine learning to extract insights from large datasets.",
  },
  {
    role: "Mobile Developer",
    company: "Flipkart",
    skills: ["react", "javascript", "typescript", "rest api", "git"],
    description: "Develop cross-platform mobile applications with React Native and TypeScript.",
  },
  {
    role: "AI Research Scientist",
    company: "OpenAI",
    skills: ["python", "deep learning", "pytorch", "nlp", "machine learning", "statistics"],
    description: "Conduct cutting-edge AI research in language models and generative AI.",
  },
  {
    role: "Platform Engineer",
    company: "Netflix",
    skills: ["java", "microservices", "aws", "docker", "kubernetes", "system design"],
    description: "Build and maintain platform services powering content delivery at scale.",
  },
  {
    role: "Business Intelligence Analyst",
    company: "Infosys",
    skills: ["sql", "power bi", "excel", "data visualization", "python"],
    description: "Create BI dashboards and reports to drive business strategy decisions.",
  },
  {
    role: "Security Engineer",
    company: "Cisco",
    skills: ["linux", "python", "networking", "devops", "docker"],
    description: "Implement security measures across network infrastructure and cloud deployments.",
  },
];

/**
 * Rank virtual candidates against a list of required skills
 */
export function rankCandidates(
  requiredSkills: string[],
  candidates: VirtualCandidate[]
): { candidate: VirtualCandidate; matched: string[]; missing: string[]; percentage: number }[] {
  const results = candidates.map(c => {
    const reqLower = requiredSkills.map(s => s.toLowerCase());
    const candidateSkills = c.skills.map(s => s.toLowerCase());
    
    const matched = reqLower.filter(s => candidateSkills.includes(s));
    const missing = reqLower.filter(s => !candidateSkills.includes(s));
    const percentage = reqLower.length > 0
      ? Math.round((matched.length / reqLower.length) * 100)
      : 0;

    return { candidate: c, matched, missing, percentage };
  });

  results.sort((a, b) => b.percentage - a.percentage);
  return results;
}

/**
 * Find alternative job roles for a candidate based on their skills
 */
export function recommendAlternativeRoles(
  candidateSkills: string[],
  currentRole: string
): { role: string; company: string; percentage: number }[] {
  const candLower = candidateSkills.map(s => s.toLowerCase());

  const results = JOB_ROLES_DB
    .filter(j => j.role !== currentRole)
    .map(j => {
      const matched = j.skills.filter(s => candLower.includes(s.toLowerCase()));
      const pct = Math.round((matched.length / j.skills.length) * 100);
      return { role: j.role, company: j.company, percentage: pct };
    })
    .filter(r => r.percentage >= 50)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);

  return results;
}
