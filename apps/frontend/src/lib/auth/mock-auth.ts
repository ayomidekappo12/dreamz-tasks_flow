export type User = {
  id: string;
  email: string;
  password: string;
};

const USERS_KEY = "mock_users";
const CURRENT_USER_KEY = "mock_current_user";

const defaultUsers: User[] = [
  {
    id: "1",
    email: "alice@gmail.com",
    password: "password123",
  },
];

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export function getUsers(): User[] {
  const users = read<User[]>(USERS_KEY);
  if (users) return users;

  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

export function getCurrentUser(): User | null {
  return read<User>(CURRENT_USER_KEY);
}

export function login(email: string, password: string): User | null {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) return null;

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
}

export function signup(email: string, password: string): User {
  const users = getUsers();

  if (users.some((u) => u.email === email)) {
    throw new Error("User already exists");
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password,
  };

  const updated = [...users, newUser];
  localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

  return newUser;
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}
