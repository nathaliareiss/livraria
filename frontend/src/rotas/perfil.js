import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";


const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-image: linear-gradient(90deg, #002F52 35%, #326589 165%);
  padding: 40px 20px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;
  color: #fff;
`;

const Titulo = styled.h2`
  color: #FFF;
  font-size: 36px;
  text-align: center;
  margin-bottom: 30px;
`;

const Info = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const Label = styled.strong`
  display: block;
  font-size: 14px;
  color: #ddd;
  margin-bottom: 5px;
`;

const Valor = styled.p`
  font-size: 18px;
  color: #fff;
  margin: 0;
`;

const Botao = styled.button`
  background-color: #cd76cc;
  color: #111011;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 20px;
  
  &:hover {
    background-color: #d14ccf;
  }
`;

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Pega os dados do usuário do localStorage
    const userData = localStorage.getItem("user");
    
    if (userData) {
      // Se tem dados salvos, usa eles
      setUser(JSON.parse(userData));
      setLoading(false);
    } else {
      // Se não tem token/dados, redireciona para login
      navigate("/login");
    }
  }, [navigate]);

  function formatarData(data) {
    if (!data) return "Não informado";
    
    // Se for string ISO do backend, converte
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString("pt-BR");
  }

  function calcularIdade(dataNascimento) {
    if (!dataNascimento) return "Não informado";
    
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return `${idade} anos`;
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  if (loading) {
    return (
      <AppContainer>
        <Titulo>Carregando...</Titulo>
      </AppContainer>
    );
  }

  if (!user) {
    return null; // ou redireciona
  }

  return (
    <AppContainer>
      <Titulo>👤 Meu Perfil</Titulo>

      <Card>
        <Info>
          <Label>Nome:</Label>
          <Valor>{user.nome}</Valor>
        </Info>

        <Info>
          <Label>Email:</Label>
          <Valor>{user.email}</Valor>
        </Info>

        <Info>
          <Label>Data de Nascimento:</Label>
          <Valor>{formatarData(user.dataNascimento)}</Valor>
        </Info>

        <Info>
          <Label>Idade:</Label>
          <Valor>{calcularIdade(user.dataNascimento)}</Valor>
        </Info>

        <Info>
          <Label>ID do Usuário:</Label>
          <Valor style={{ fontSize: "12px", color: "#aaa" }}>{user.id}</Valor>
        </Info>

        <Botao onClick={handleLogout}>Sair</Botao>
      </Card>
    </AppContainer>
  );
}