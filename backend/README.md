# Backend da Livraria

API em Node.js e Express responsavel por autenticacao, cadastro de usuarios, favoritos, leitura e integracoes com Google.

## Funcionalidades

- cadastro e login com JWT
- persistencia de dados no MongoDB
- favoritos e estante pessoal
- controle de leitura
- integracao com Google Calendar

## Configuracao local

Crie o arquivo `.env` dentro de `backend/` com base em `.env.example`.

### Variaveis principais

- `STRING_CONEXAO_DB` ou `MONGO_URI`
- `PORT`
- `JWT_SECRET`
- `FRONTEND_URL`
- `BACKEND_URL`

Se voce usar MongoDB Atlas:

- libere o IP da sua maquina em Network Access
- confira usuario e senha da string
- veja se o cluster esta ativo

Se o driver `mongodb+srv://` estiver falhando com erro de DNS, use o Mongo local para desenvolvimento:

```env
STRING_CONEXAO_DB=mongodb://127.0.0.1:27017/livraria
```

Nesse caso, o MongoDB precisa estar instalado e rodando na sua maquina.

## Como rodar

```bash
cd backend
npm install
npm run dev
```

A API sobe em `http://localhost:8001` por padrao.

## Observacao para GitHub

Nao publique o `.env` real. Use apenas `.env.example` com valores ficticios.
