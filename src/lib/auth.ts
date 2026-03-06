export interface UserData {
  name: string;
  email: string;
  password: string;
  role: "hr" | "fresher" | "recruiter";
}

export function getStoredUsers(): UserData[] {
  try {
    return JSON.parse(localStorage.getItem("users") || "[]");
  } catch {
    return [];
  }
}

export function signup(name: string, email: string, password: string, role: UserData["role"]): string | null {
  const users = getStoredUsers();
  if (users.find(u => u.email === email)) return "Email already registered.";
  users.push({ name, email, password, role });
  localStorage.setItem("users", JSON.stringify(users));
  const userData = { name, email, role };
  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("isLoggedIn", "true");
  return null;
}

export function login(email: string, password: string): string | null {
  const users = getStoredUsers();
  const user = users.find(u => u.email === email);
  if (!user) return "Email not found. Please sign up first.";
  if (user.password !== password) return "Incorrect password.";
  localStorage.setItem("user", JSON.stringify({ name: user.name, email: user.email, role: user.role }));
  localStorage.setItem("isLoggedIn", "true");
  return null;
}

export function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
}

export function isLoggedIn(): boolean {
  return localStorage.getItem("isLoggedIn") === "true";
}

export function getCurrentUser(): { name: string; email: string; role: string } | null {
  try {
    if (!isLoggedIn()) return null;
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}
