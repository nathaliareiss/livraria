# Livraria

Aplicacao full stack para gerenciamento de livros, favoritos, estante pessoal e integracao com Google Calendar.

## Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Google APIs
- Frontend: React, React Router, styled-components, Axios

## Estrutura

- `backend/`: API, autenticacao, modelos e integracoes
- `frontend/`: interface web e consumo da API
- `livros.json` e `favoritos.json`: arquivos locais de apoio / dados de teste

## Como rodar localmente

1. Instale as dependencias do backend e do frontend.
2. Configure os arquivos de ambiente com base nos exemplos.
3. Inicie o backend em uma porta como `8000`.
4. Inicie o frontend em `3000`.

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Variaveis de ambiente

Copie os arquivos de exemplo:

- `backend/.env.example` para `backend/.env`
- `frontend/.env.example` para `frontend/.env`

## Melhorias implementadas

- Favoritos persistidos no MongoDB por usuario
- Fluxo do Google Calendar sem token na URL
- URLs configuraveis por ambiente
- Remocao de logs e caminho de teste da rota principal
- Ajustes de acessibilidade e warnings do React

## Proximos passos recomendados

- Adicionar testes automatizados
- Criar pipeline de lint e build
- Publicar screenshots e video/gif no README
- Separar melhor camadas de servico e componentes no frontend
