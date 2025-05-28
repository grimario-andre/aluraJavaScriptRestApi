# Dockerfile
FROM node:14

# Cria e define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante da aplicação
COPY . .

# Expõe a porta (não obrigatória, só informativa)
EXPOSE 3000

# Comando padrão
CMD ["node", "index.js"]
