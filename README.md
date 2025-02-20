# Guarda-Chuva Farmácias - Projeto Backend

## 1. Introdução

A **Multinacional Guarda-Chuva Farmácias** está entusiasmada com o protótipo do app desenvolvido e agora, com grande expectativa, convida você a participar da próxima fase desse projeto inovador.

Após o sucesso do protótipo do app, queremos avançar para a criação do protótipo do backend, que será fundamental para otimizar a gestão das movimentações de produtos entre as filiais da organização. Este novo passo envolve um **API Restful** que dará suporte à integração das funcionalidades do app.

O backend será responsável por processar dados e possibilitar o gerenciamento de usuários, produtos e movimentações.

Se você está pronto para contribuir com essa etapa crucial e ajudar a transformar ainda mais o nosso setor, junte-se a nós no desenvolvimento do protótipo do backend desse projeto inovador!

---

## 2. Requisitos do Projeto

### Requisito 1 - Rota de Criação de Usuário

- **Método:** `POST`
- **Path:** `/users` (PRIVADA e somente acessível para ADMIN)
- **Campos no corpo da requisição (Body):**
  - `name` (obrigatório)
  - `profile` (obrigatório)  
    Valores permitidos: `DRIVER`, `BRANCH` ou `ADMIN`
  - `email` (obrigatório e formato válido)
  - `password` (obrigatório e no mínimo 6 caracteres e no máximo 20)
  - `document` (obrigatório, com validação condicional):
    - Se o profile for `DRIVER`, o documento deve ser um CPF válido.
    - Se o profile for `BRANCH`, o documento deve ser um CNPJ válido.
  - `full_address` (opcional)

#### Estrutura da Tabela `users` (Migração necessária):

<<<<<<< HEAD
| Campo           | Tipo                     | Descrição                     |
|-----------------|--------------------------|-------------------------------|
| `id`            | PK                      | Chave primária                |
| `name`          | varchar(200) NOT NULL    | Nome do usuário               |
| `profile`       | ENUM('DRIVER', 'BRANCH', 'ADMIN') NOT NULL | Perfil do usuário |
| `email`         | varchar(150) UNIQUE NOT NULL | Email do usuário          |
| `password_hash` | varchar(150) NOT NULL    | Hash da senha                 |
| `status`        | boolean (default: TRUE)  | Status do usuário             |
| `created_at`    | Timestamp (default now())| Data de criação               |
| `updated_at`    | Timestamp (default now())| Data de atualização           |

#### Estrutura da Tabela `branches` (Migração necessária):

| Campo           | Tipo                     | Descrição                     |
|-----------------|--------------------------|-------------------------------|
| `id`            | PK                      | Chave primária                |
| `full_address`  | varchar(255)             | Endereço completo             |
| `document`      | varchar(30) NOT NULL     | CNPJ da filial                |
| `user_id`       | FK com tabela `users` NOT NULL | Relação com usuário     |
| `created_at`    | Timestamp (default now())| Data de criação               |
| `updated_at`    | Timestamp (default now())| Data de atualização           |

#### Estrutura da Tabela `drivers` (Migração necessária):

| Campo           | Tipo                     | Descrição                     |
|-----------------|--------------------------|-------------------------------|
| `id`            | PK                      | Chave primária                |
| `full_address`  | varchar(255)             | Endereço completo             |
| `document`      | varchar(30) NOT NULL     | CPF do motorista              |
| `user_id`       | FK com tabela `users` NOT NULL | Relação com usuário     |
| `created_at`    | Timestamp (default now())| Data de criação               |
| `updated_at`    | Timestamp (default now())| Data de atualização           |

#### Middleware:
Desenvolver middleware para verificar se o usuário é do perfil `ADMIN`. Apenas usuários com perfil `ADMIN` devem ter permissão para acessar esta rota.

#### Controller:
Ao salvar um novo usuário, a senha deve ser armazenada como um hash. Ao salvar o usuário, lembre-se de salvar os demais dados na tabela `branches` ou `drivers`, dependendo do perfil do usuário.

#### Retornos da Rota:
=======
| Campo           | Tipo                                       | Descrição           |
| --------------- | ------------------------------------------ | ------------------- |
| `id`            | PK                                         | Chave primária      |
| `name`          | varchar(200) NOT NULL                      | Nome do usuário     |
| `profile`       | ENUM('DRIVER', 'BRANCH', 'ADMIN') NOT NULL | Perfil do usuário   |
| `email`         | varchar(150) UNIQUE NOT NULL               | Email do usuário    |
| `password_hash` | varchar(150) NOT NULL                      | Hash da senha       |
| `status`        | boolean (default: TRUE)                    | Status do usuário   |
| `created_at`    | Timestamp (default now())                  | Data de criação     |
| `updated_at`    | Timestamp (default now())                  | Data de atualização |

#### Estrutura da Tabela `branches` (Migração necessária):

| Campo          | Tipo                           | Descrição           |
| -------------- | ------------------------------ | ------------------- |
| `id`           | PK                             | Chave primária      |
| `full_address` | varchar(255)                   | Endereço completo   |
| `document`     | varchar(30) NOT NULL           | CNPJ da filial      |
| `user_id`      | FK com tabela `users` NOT NULL | Relação com usuário |
| `created_at`   | Timestamp (default now())      | Data de criação     |
| `updated_at`   | Timestamp (default now())      | Data de atualização |

#### Estrutura da Tabela `drivers` (Migração necessária):

| Campo          | Tipo                           | Descrição           |
| -------------- | ------------------------------ | ------------------- |
| `id`           | PK                             | Chave primária      |
| `full_address` | varchar(255)                   | Endereço completo   |
| `document`     | varchar(30) NOT NULL           | CPF do motorista    |
| `user_id`      | FK com tabela `users` NOT NULL | Relação com usuário |
| `created_at`   | Timestamp (default now())      | Data de criação     |
| `updated_at`   | Timestamp (default now())      | Data de atualização |

#### Middleware:

Desenvolver middleware para verificar se o usuário é do perfil `ADMIN`. Apenas usuários com perfil `ADMIN` devem ter permissão para acessar esta rota.

#### Controller:

Ao salvar um novo usuário, a senha deve ser armazenada como um hash. Ao salvar o usuário, lembre-se de salvar os demais dados na tabela `branches` ou `drivers`, dependendo do perfil do usuário.

#### Retornos da Rota:

>>>>>>> feature/terceiroRequisito
- **Sucesso (201):** Retornar o nome do usuário criado e o perfil na resposta da requisição.
- **Conflito (409):** Retornar quando o email já está cadastrado.
- **Erro (400):** Retornar quando dados incorretos são enviados no corpo da requisição.

---

### Requisito 2 - Rota de Login

- **Método:** `POST`
- **Path:** `/login` (Pública)
- **Campos no corpo da requisição (Body):**
  - `email`: Obrigatório
  - `password`: Obrigatório
- **Retornos da Rota:**
  - **Sucesso (200):** Retornar o token JWT, nome do usuário e perfil.
  - **Erro (400):** Retornar quando dados incorretos são enviados no corpo da requisição.
  - **Erro (401):** Retornar quando usuário não é encontrado (email ou senha incorretos).

---

### Requisito 3 - Rota de Listagem de Todos os Usuários

- **Método:** `GET`
- **Path:** `/users` (Privada, acessível somente por ADMIN)
- **Parâmetros de Consulta (QUERY PARAMS):**
  - `profile`: Opcional, deve filtrar pelo perfil do usuário.
- **Retornos da Rota:**
  - **Sucesso (200):** Retorna `id`, `name`, `status` e `profile` dos usuários listados.

---

### Requisito 4 - Rota de Listagem de um Usuário por ID

- **Método:** `GET`
- **Path:** `/users/:id` (Privada, acessível somente por ADMIN ou o MOTORISTA correspondente ao id)
- **Retornos da Rota:**
  - **Sucesso (200):** Retorna `id`, `name`, `status`, `full_address` e `profile` do usuário com base no id.
  - **Não Autorizado (401):** Retorna quando o usuário que fez a requisição não tem permissão para acessar os dados (caso o id não corresponda ao MOTORISTA logado ou o usuário não seja ADMIN).

---

### Requisito 5 - Rota de Atualizar um Usuário

- **Método:** `PUT`
- **Path:** `/users/:id` (Privada, acessível somente por ADMIN ou o MOTORISTA correspondente ao id)
- **Campos no corpo da requisição (Body):**
  - `name`: Opcional
  - `email`: Opcional
  - `password`: Opcional
  - `full_address`: Opcional
- **Retornos da Rota:**
  - **Forbidden (401):** Retorna quando a tentativa de atualização envolve os campos `id`, `created_at`, `updated_at`, `status` ou `profile`.
  - **Sucesso (200):** Retorna em caso de sucesso, com o usuário atualizado.

**Observação:**
Atenção à distribuição dos dados entre as tabelas de usuários e filial/motoristas. Se o usuário enviar, no corpo da requisição, os campos `name` e `full_address`, o campo `full_address` deve ser atualizado na tabela de motoristas, enquanto o campo `name` deve ser atualizado na tabela de usuários, caso o perfil seja `DRIVER`, por exemplo.

---

### Requisito 6 - Rota de Atualizar Status do Usuário

- **Método:** `PATCH`
- **Path:** `/users/:id/status` (Privada, acessível somente por ADMIN)
- **Retornos da Rota:**
  - **Sucesso (200):** Retorna em caso de sucesso, indicando que o status do usuário foi atualizado.

---

### Requisito 7 - Cadastro de Produto

- **Método:** `POST`
- **Path:** `/products` (Privada e somente FILIAL)
- **Campos no corpo da requisição (Body):**
  - `name`: Obrigatório
<<<<<<< HEAD
  - `amount`: Obrigatório 
  - `description`: Obrigatório 
  - `url_cover`: Opcional
- **Estrutura da Tabela `products` (Migração necessária):**

| Campo           | Tipo                     | Descrição                     |
|-----------------|--------------------------|-------------------------------|
| `id`            | PK                      | Chave primária                |
| `name`          | VARCHAR(200) NOT NULL    | Nome do produto               |
| `amount`        | INT NOT NULL             | Quantidade do produto         |
| `description`   | VARCHAR(200) NOT NULL    | Descrição do produto          |
| `url_cover`     | VARCHAR(200)             | URL da imagem do produto      |
| `branch_id`     | FK com tabela `branches` NOT NULL | Relação com filial |
| `created_at`    | TIMESTAMP                | Data de criação               |
| `updated_at`    | TIMESTAMP                | Data de atualização           |

#### Controller:
Antes de salvar o produto, obtenha o ID da filial a partir do ID do usuário e associe-o ao campo `branch_id`. Lembre-se de que o usuário está vinculado a uma filial, portanto, o ID que deve ser vinculado é o da filial, e não o do usuário. O ID do usuário serve apenas como uma referência para localizar o ID da filial.

#### Retornos da Rota:
=======
  - `amount`: Obrigatório
  - `description`: Obrigatório
  - `url_cover`: Opcional
- **Estrutura da Tabela `products` (Migração necessária):**

| Campo         | Tipo                              | Descrição                |
| ------------- | --------------------------------- | ------------------------ |
| `id`          | PK                                | Chave primária           |
| `name`        | VARCHAR(200) NOT NULL             | Nome do produto          |
| `amount`      | INT NOT NULL                      | Quantidade do produto    |
| `description` | VARCHAR(200) NOT NULL             | Descrição do produto     |
| `url_cover`   | VARCHAR(200)                      | URL da imagem do produto |
| `branch_id`   | FK com tabela `branches` NOT NULL | Relação com filial       |
| `created_at`  | TIMESTAMP                         | Data de criação          |
| `updated_at`  | TIMESTAMP                         | Data de atualização      |

#### Controller:

Antes de salvar o produto, obtenha o ID da filial a partir do ID do usuário e associe-o ao campo `branch_id`. Lembre-se de que o usuário está vinculado a uma filial, portanto, o ID que deve ser vinculado é o da filial, e não o do usuário. O ID do usuário serve apenas como uma referência para localizar o ID da filial.

#### Retornos da Rota:

>>>>>>> feature/terceiroRequisito
- **Sucesso (201):** Retornar o produto criado.
- **Erro (400):** Retornar quando dados incorretos são enviados no corpo da requisição.

---

### Requisito 8 - Listagem de Produtos

- **Método:** `GET`
- **Path:** `/products` (Privada, acessível somente por FILIAL)
- **Retornos da Rota:**
  - **Sucesso (200):** Retorna os produtos cadastrados com os dados da filial relacionada.

---

### Requisito 9 - Cadastro de Movimentação (FILIAL)

- **Método:** `POST`
- **Path:** `/movements/` (Privada, acessível somente por FILIAL)
- **Campos no corpo da requisição (Body):**
  - `destination_branch_id`: Obrigatório
<<<<<<< HEAD
  - `product_id`: Obrigatório 
  - `quantity`: Obrigatório (Deve ser superior a 0 e não ultrapassar o máximo disponível na coluna `amount` do produto)
- **Estrutura da Tabela `movements` (Migração necessária):**

| Campo                 | Tipo                     | Descrição                     |
|-----------------------|--------------------------|-------------------------------|
| `id`                  | PK                      | Chave primária                |
| `destination_branch_id` | FK da tabela `branches` NOT NULL | Filial de destino |
| `product_id`          | FK para tabela de produtos NOT NULL | Produto movimentado |
| `quantity`            | INT NOT NULL             | Quantidade movimentada        |
| `status`              | ENUM('PENDING', 'IN_PROGRESS', 'FINISHED') DEFAULT 'PENDING' | Status da movimentação |
| `created_at`          | TIMESTAMP                | Data de criação               |
| `updated_at`          | TIMESTAMP                | Data de atualização           |

#### Controller:
=======
  - `product_id`: Obrigatório
  - `quantity`: Obrigatório (Deve ser superior a 0 e não ultrapassar o máximo disponível na coluna `amount` do produto)
- **Estrutura da Tabela `movements` (Migração necessária):**

| Campo                   | Tipo                                                         | Descrição              |
| ----------------------- | ------------------------------------------------------------ | ---------------------- |
| `id`                    | PK                                                           | Chave primária         |
| `destination_branch_id` | FK da tabela `branches` NOT NULL                             | Filial de destino      |
| `product_id`            | FK para tabela de produtos NOT NULL                          | Produto movimentado    |
| `quantity`              | INT NOT NULL                                                 | Quantidade movimentada |
| `status`                | ENUM('PENDING', 'IN_PROGRESS', 'FINISHED') DEFAULT 'PENDING' | Status da movimentação |
| `created_at`            | TIMESTAMP                                                    | Data de criação        |
| `updated_at`            | TIMESTAMP                                                    | Data de atualização    |

#### Controller:

>>>>>>> feature/terceiroRequisito
1. Verificar se a quantidade (`quantity`) solicitada é inferior ou igual ao estoque disponível da filial de origem. Se não houver estoque suficiente, retorna um erro `400` com a mensagem "Estoque insuficiente para essa movimentação".
2. O `destination_branch_id` e o `id` da filial do produto devem ser diferentes. Se forem iguais, retornar um erro `400` com a mensagem "A filial de origem não pode ser a mesma que a filial de destino".
3. Após a verificação de estoque, o produto deve ser atualizado na filial de origem, subtraindo a quantidade movimentada.
4. O status de uma nova movimentação será, por padrão, `PENDING`. Não é necessário informá-lo no corpo da requisição ao cadastrar, pois o valor será automaticamente atribuído com base no valor padrão definido na migração.

#### Retornos da Rota:
<<<<<<< HEAD
=======

>>>>>>> feature/terceiroRequisito
- **Sucesso (201):** Retorna a movimentação criada.
- **Erro (400):** Retorna quando há estoque insuficiente ou filial de origem e destino são iguais.

---

### Requisito 10 - Listagem de Movimentações

- **Método:** `GET`
- **Path:** `/movements` (Privada, acessível somente por FILIAL E MOTORISTA)
- **Retornos da Rota:**
  - **Sucesso (200):** Retorna todas as movimentações com os dados da filial de destino associado e dados do produto.

---

### Requisito 11 - Atualizar Status para "IN_PROGRESS" (MOTORISTA)

- **Método:** `PATCH`
- **Path:** `/movements/:id/start` (Privada, acessível somente por MOTORISTA)
- **Retornos da Rota:**
  - **Sucesso (200):** Dados da movimentação atualizada.

---

### Requisito 12 - Atualizar Status para "FINISHED" (MOTORISTA)

- **Método:** `PATCH`
- **Path:** `/movements/:id/end` (Privada, acessível somente por MOTORISTA que iniciou a viagem)
- **Controller:**
  - Quando o status for atualizado, crie um novo registro na tabela `products`, associando o `branch_id` ao ID da filial de destino da movimentação. Além disso, registre o novo produto com a quantidade correspondente à movimentação.
- **Retornos da Rota:**
  - **Sucesso (200):** Dados da movimentação atualizada.

---

## 3. Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/DEVinHouse-Clamed-V3/Projeto_GuardaChuva__BackEnd.git
<<<<<<< HEAD

=======
   ```
>>>>>>> feature/terceiroRequisito

# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `.env` file
3. Run `npm start:dev` command
<<<<<<< HEAD
=======

# Observação:

Eu tinha feito repositorio com a no devinhouse Clamed, porém tive que deletar e criei nesse particular.
Então o requisito 1 e o requisito 2 já foram finalizados e irá ser a partir do terceiro requisito.
>>>>>>> feature/terceiroRequisito
