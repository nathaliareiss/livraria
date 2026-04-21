import { createContext, useContext, useState, useEffect } from 'react';

// 1) Cria o contexto (é como uma "caixa" que vai guardar os dados)
//vai permitir compartilhar o estado de login entre os componentes
//sem recarregar a pagina, isso para atualizar as opcoes do header
const AuthContext = createContext();

// 2) Hook customizado para usar o contexto facilmente
//    Em vez de usar useContext(AuthContext) em todo lugar,
//    você só chama useAuth()
export function useAuth() {
  const context = useContext(AuthContext);
  

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  
  return context;
}

// 3) Provider: componente que "fornece" os dados para os filhos
export function AuthProvider({ children }) {
  // Estado que guarda se o usuário está logado
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Estado que guarda os dados do usuário
  const [user, setUser] = useState(null);

  // useEffect roda quando o componente monta
  // Verifica se já tem token salvo (usuário já estava logado antes)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      // Se tem token e dados, marca como logado
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      // Se não tem, marca como não logado
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []); // array vazio = roda só uma vez quando monta

  // Função para fazer login (salva token e atualiza estado)
  function login(token, userData) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  }

  // Função para fazer logout (remove token e atualiza estado)
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  }

  // Objeto com tudo que vai ser compartilhado
  const value = {
    isLoggedIn,  // se está logado ou não
    user,        // dados do usuário
    login,       // função para fazer login
    logout,      // função para fazer logout
  };

  // Provider "fornece" o value para todos os componentes filhos
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}