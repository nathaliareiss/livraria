# Livraria Frontend

Interface web da plataforma Livraria, feita em React, para organizar livros, favoritos, leitura e integracoes com a API do projeto.

## Visao geral

Este frontend foi criado para oferecer uma experiencia visual mais limpa e moderna para o usuario, com foco nas principais tarefas do app:

- criar conta e fazer login
- buscar livros na API externa
- salvar livros na estante pessoal
- marcar favoritos e livros que quer ler
- acompanhar o progresso de leitura
- acessar o calendario e a integracao com Google

O frontend depende do backend para autenticao, persistencia e integracoes. Sem a API ativa, as telas carregam, mas as operacoes que salvam dados nao funcionam.

## Tecnologias

- React 19
- React Router DOM
- Styled Components
- Axios

## Estrutura de pastas

- `src/componentes/` - componentes reutilizaveis da interface
- `src/contextos/` - contexto global de autenticacao
- `src/rotas/` - paginas principais da aplicacao
- `src/servicos/` - cliente HTTP e servicos de API
- `src/styles/` - tema, cores e tipografia

## Paginas disponiveis

- `/` - home
- `/cadastre-se` - cadastro de usuario
- `/login` - login
- `/perfil` - perfil do usuario
- `/favoritos` - livros favoritos
- `/calendario` - agenda e eventos de leitura
- `/estante` - biblioteca pessoal

## Como rodar localmente

1. Instale as dependencias:

```bash
cd frontend
npm install
```

2. Configure a URL da API em um arquivo `.env` dentro de `frontend/`:

```bash
REACT_APP_API_URL=http://localhost:8000
```

3. Inicie o frontend:

```bash
npm start
```

Por padrao, a aplicacao roda em `http://localhost:3000`.

## Backend necessario

Para o frontend funcionar de ponta a ponta, o backend tambem precisa estar ativo. O projeto espera a API em `http://localhost:8000`, a nao ser que `REACT_APP_API_URL` aponte para outro endereco.

Se voce estiver publicando o projeto, ajuste estas variaveis:

- `REACT_APP_API_URL` no frontend
- `FRONTEND_URL` e `BACKEND_URL` no backend

## Scripts disponiveis

- `npm start` - executa a aplicacao em modo desenvolvimento
- `npm run build` - gera a versao de producao
- `npm test` - executa os testes
- `npm run eject` - expulsa a configuracao do Create React App

## Fluxo principal

1. O usuario acessa a tela de cadastro ou login.
2. O frontend envia os dados para a API.
3. O backend valida e retorna o token JWT.
4. O token fica salvo no navegador e passa a ser usado nas requisicoes seguintes.
5. As telas de estante, favoritos, leitura e calendario passam a refletir os dados do usuario logado.

## Observacoes para deploy

- Se o frontend for publicado separado do backend, configure `REACT_APP_API_URL` com a URL publica da API.
- Garanta que o backend aceite a origem do frontend em `FRONTEND_URL`.
- Nao versionar arquivos `.env` reais no GitHub. Use sempre exemplos com valores de referencia.
