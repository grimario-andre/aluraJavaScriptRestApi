# Projeto Node.js com Docker + MySQL

Este projeto é uma aplicação Node.js configurada para rodar em containers Docker, utilizando o banco de dados MySQL 8.0.

---

## ✅ Pré-requisitos

Antes de iniciar, você precisa ter instalado:

* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)
* Git (para clonar o repositório)

---

## 📦 Clonando o Projeto

```bash
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# JWT
JWT_SECRET=sua_chave_secreta

comando para gerar JWT 
openssl rand -hex 32

# Configurações do MySQL
DB_HOST=db
DB_PORT=3306
DB_NAME=nome_do_banco
DB_USER=usuario
DB_PASSWORD=senha
DB_ROOT_PASSWORD=senha_root
```

Você pode modificar esses valores conforme necessário.

---

## 🐳 Subindo a Aplicação com Docker

No terminal, execute:

```bash
docker-compose up --build
```

A aplicação estará rodando em: [http://localhost:3000](http://localhost:3000)

---

## 🔄 Desenvolvimento

Este projeto usa `nodemon`, então qualquer mudança no código será recarregada automaticamente.

Usar comando docker-compose logs -f nome_container para visualizar logs em tempo real.
`docker-compose logs -f app`

---

## 🛠 Estrutura do Projeto

```bash
.
├── Dockerfile
├── docker-compose.yml
├── .env
├── package.json
├── package-lock.json
├── src/
│   └── dataBase/
│       └── db.js
├── index.js
```

---

## 🔪 Testando Conexão com o Banco

A conexão está definida em `src/dataBase/db.js`. A aplicação tentará conectar ao banco MySQL automaticamente ao iniciar. Verifique o terminal para ver se a conexão foi bem-sucedida.

---

## 📄 Finalizando

Para parar os containers:

```bash
docker-compose down
```

Para parar e remover tudo, incluindo volumes do banco de dados:

```bash
docker-compose down -v
```

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
