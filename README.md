# 🕷️ Praying Mantis - Backend da Guarda-Chuva Farmácias

## 1. Introdução

A **Multinacional Guarda-Chuva Farmácias** está avançando para a próxima fase do desenvolvimento de seu sistema interno de logística. Para isso, está implementando o **Praying Mantis**, uma API RESTful de backend projetada para otimizar a gestão de usuários, produtos e movimentações entre suas filiais.

Com uma arquitetura robusta e escalável, essa solução aprimora a eficiência operacional, garantindo maior controle, rastreabilidade e agilidade no transporte de medicamentos.

---

## 2. Tecnologias Utilizadas

O projeto utiliza as seguintes tecnologias e ferramentas:

- **Linguagem**: TypeScript
- **Framework**: Node.js com NestJS
- **Banco de Dados**: PostgreSQL
- **ORM**: TypeORM
- **Autenticação**: JWT (JSON Web Token)
- **Gerenciamento de Pacotes**: npm
- **Controle de Versionamento**: Git e GitHub
- **Ambiente Virtualizado**: Docker (Opcional)

---

## 3. Diagrama de Banco de Dados

> **Sugestão**: Inserir um diagrama entidade-relacionamento (ERD) para facilitar a compreensão da estrutura do banco de dados.

---

## 4. Funcionalidades da API

### 🔹 **Gestão de Usuários**

✅ Cadastro de usuários com perfis `ADMIN`, `BRANCH` (Filial) e `DRIVER` (Motorista).  
✅ Login com geração de token JWT.  
✅ Listagem, atualização e ativação/inativação de usuários.

### 🔹 **Gestão de Produtos**

✅ Cadastro e listagem de produtos por filial.

### 🔹 **Gestão de Movimentações**

✅ Transferência de produtos entre filiais.  
✅ Acompanhamento do status das movimentações: `PENDING`, `IN_PROGRESS`, `FINISHED`.  
✅ Atualização de status por motoristas.

---

## 5. Como Executar o Projeto

### **Pré-requisitos**

Antes de iniciar, certifique-se de ter instalado:

- **Node.js** (versão recomendada: `>=16.x`)
- **PostgreSQL** (ou utilizar o Docker para subir o banco)

### **Passo a Passo**

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/DEVinHouse-Clamed-V3/Projeto_GuardaChuva__BackEnd.git
   cd Projeto_GuardaChuva__BackEnd
   ```
2. **Instale as dependências**

```bash
npm install
```

3. **Configure o ambiente**

- Crie um arquivo `.env` na raiz do projeto e defina as variáveis necessárias, como:

```bash
  DATABASE_URL=postgres://user:password@localhost:5432/praying_mantis
  JWT_SECRET=seu_segredo_aqui
```

4. **Execute as migrações do banco de dados:**

```bash
  npm run migration:run
```

5. **Inicie o servidor:**

```bash
  npm run start:dev
```

6. **Testando a API:**

- Crie um arquivo `.env` na raiz do projeto e defina as variáveis necessárias, como:

## 6. Melhorias Futuras

🔹 Implementação de Cache: Utilizar Redis para otimizar as requisições mais frequentes.
🔹 Monitoramento e Logs: Integrar ferramentas como Logstash e Kibana para melhor rastreamento.
🔹 Testes Automatizados: Expandir cobertura com Jest e Supertest.
🔹 Documentação com Swagger: Gerar documentação interativa para facilitar a integração com outras equipes.

# Observação:

Eu tinha feito repositorio com a no devinhouse Clamed, porém tive que deletar e criei nesse particular.
Então o requisito 1 e o requisito 2 já foram finalizados e irá ser a partir do terceiro requisito.
