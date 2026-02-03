# 🚀 DevControl

> **Central de Gerenciamento de Suporte (SaaS)**  
> Plataforma completa para controle de chamados e gestão de clientes, com foco em performance, segurança e excelente UX.

---

## 🔥 Badges

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-green)
![License](https://img.shields.io/badge/license-MIT-green)

---

# 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Destaques Técnicos](#-destaques-técnicos)
- [Arquitetura de Dados](#-arquitetura-de-dados)
- [Demonstração](#-demonstração)
- [Como Rodar o Projeto](#-como-rodar-o-projeto)
- [Roadmap](#-roadmap)
- [Contribuição](#-contribuição)
- [Licença](#-licença)
- [Contato](#-contato)

---

# 📖 Sobre o Projeto

O **DevControl** é uma solução SaaS voltada para empresas de suporte técnico que precisam gerenciar chamados, clientes e históricos de atendimento em um único sistema.

O projeto foi construído com foco em:

- ⚡ Alta performance
- 🔐 Segurança
- 📈 Escalabilidade
- 🎯 Experiência do usuário

Ideal para equipes de suporte, help desks e operações de atendimento técnico.

---

# ✨ Funcionalidades

- 🔐 **Autenticação Segura**
  - Login social via Google com NextAuth.js

- 📊 **Dashboard Estratégico**
  - Visão geral de chamados em tempo real

- 🎫 **Gestão de Tickets**
  - Criação, acompanhamento e finalização

- 👥 **Controle de Clientes**
  - Cadastro e vínculo com chamados

- 🔍 **Filtros Avançados**
  - Status
  - Período (hoje, semana, mês, ano)
  - Busca textual

- 📝 **Linha do Tempo de Andamentos**
  - Histórico completo com notas internas

- 📱 **Interface Responsiva**
  - Experiência otimizada para desktop e mobile

---

# 🛠 Tecnologias

## Core

- **Next.js 15 (App Router)**
- **React 19**
- **TypeScript**
- **Tailwind CSS**

## Backend & Dados

- **PostgreSQL (Neon.tech)**
- **Prisma ORM**
- **NextAuth.js**

## UI & Utilidades

- Lucide React
- React Icons
- date-fns
- React Hot Toast

---

# 🏗 Destaques Técnicos

### ✅ React Server Components (RSC)
Redução de JS no cliente e melhor performance.

### ✅ Server Actions
Manipulação segura de dados no servidor.

### ✅ Optimistic UI
Feedback imediato ao usuário.

### ✅ Arquitetura Escalável
- Componentes reutilizáveis  
- Hooks customizados  
- Separação clara de responsabilidades

### ✅ Preparado para o Futuro
Uso de APIs modernas como `useTransition`.

---

# 🗄 Arquitetura de Dados

### Users
Gerencia os atendentes.

### Customers
Armazena dados dos clientes.

### Tickets
Relaciona clientes, atendentes e status.

### Comments
Histórico de andamento dos chamados.

---

# 🎨 Demonstração

> ⚠️ Adicione aqui prints ou GIFs para aumentar impacto do projeto.

Exemplos:

- Tela de Login  
- Dashboard  
- Modal de Ticket  
- Linha do Tempo  

---

# 🚀 Como Rodar o Projeto

## Pré-requisitos

- Node.js **v20+**
- Conta Google Cloud (OAuth)
- Banco PostgreSQL (Neon recomendado)

---

## 1️⃣ Clone o repositório

```bash
git clone https://github.com/vitorVier/devControl.git
cd devControl
```

## 2️⃣ Instale dependências

```bash
npm install
```

## 3️⃣ Variáveis de Ambiente

Crie .env na raiz:

```bash
DATABASE_URL="sua_url_do_neon"
NEXTAUTH_SECRET="seu_secret"
GOOGLE_CLIENT_ID="seu_google_id"
GOOGLE_CLIENT_SECRET="seu_google_secret"
NEXTAUTH_URL="http://localhost:3000"
```

## 4️⃣ Setup do Banco

```bash
npx prisma generate
npx prisma db push
```

## 5️⃣ Rodar projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

---

# 👨‍💻 Contato

Vitor Vier

### LinkedIn: www.linkedin.com/in/vítor-vier
### Email: vierrvitor@gmail.com
### Instagram: vitor_vier
