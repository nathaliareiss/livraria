import { createContext, useContext, useEffect, useState } from "react";

function normalizeStoredUser(userData) {
  if (!userData) {
    return null;
  }

  return {
    ...userData,
    id: userData.id || userData._id || null,
    email: userData.email || "",
    nome: userData.nome || "",
    dataNascimento: userData.dataNascimento || null,
  };
}

function getInitialAuthState() {
  if (typeof window === "undefined") {
    return {
      isLoggedIn: false,
      user: null,
    };
  }

  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (!token || !userData) {
    return {
      isLoggedIn: false,
      user: null,
    };
  }

  try {
    return {
      isLoggedIn: true,
      user: normalizeStoredUser(JSON.parse(userData)),
    };
  } catch {
    return {
      isLoggedIn: false,
      user: null,
    };
  }
}

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}

export function AuthProvider({ children }) {
  const initialAuthState = getInitialAuthState();
  const [isLoggedIn, setIsLoggedIn] = useState(initialAuthState.isLoggedIn);
  const [user, setUser] = useState(initialAuthState.user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(normalizeStoredUser(JSON.parse(userData)));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  function login(token, userData) {
    const normalizedUser = normalizeStoredUser(userData);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setIsLoggedIn(true);
    setUser(normalizedUser);
  }

  function updateUser(userData) {
    if (!userData) {
      localStorage.removeItem("user");
      setUser(null);
      setIsLoggedIn(false);
      return;
    }

    const normalizedUser = normalizeStoredUser(userData);

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
    setIsLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  }

  const value = {
    isLoggedIn,
    user,
    login,
    updateUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
