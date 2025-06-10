# Urban Lease - Documentação

![Demonstração](./images/animacao.gif)

## 📌 Visão Geral

**Urban Lease** é um site para uma imobiliária que apresenta uma **landing page moderna e responsiva** com carrosséis interativos, formulários e listagem dinâmica de imóveis. O projeto utiliza um **frontend com HTML, Tailwind CSS e JavaScript puro**, integrado a um **backend em Node.js com Fastify** que serve dados via API.

---

## 📁 Estrutura do Projeto

```
urban-lease/
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   ├── property.json
│   │   │   └── property-images.json
│   │   ├── plugins/
│   │   │   └── swagger.ts
│   │   ├── routes/
│   │   │   └── property.route.ts
│   │   ├── schemas/
│   │   │   ├── property.ts
│   │   │   └── property-image.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── css/
│   ├── data/
│   ├── images/
│   ├── js/
│   │   ├── main.js
│   │   ├── property-data.js
│   │   ├── propertyService.js
│   │   └── search-results.js
│   ├── index.html
│   └── search-results.html
└── converter-webp.py
```

---

## 🚀 Tecnologias Utilizadas

### Frontend:
- **HTML5 Semântico**
- **Tailwind CSS** (via CDN)
- **JavaScript Vanilla**
- **Google Fonts** – DM Sans

### Backend:
- **Node.js + Fastify**
- **Swagger** – documentação acessível em `/docs`
- **Cloudinary** – hospedagem de imagens
- **TypeScript**
- **JSON mock data** com 100 imóveis (51 em destaque)

---

## 🧪 API REST

- **Endpoint principal**: [`http://localhost:3000/properties`](http://localhost:3000/properties)
- **Swagger UI**: [`http://localhost:3000/docs`](http://localhost:3000/docs)

A API disponibiliza os dados dos imóveis em formato JSON. Imagens são hospedadas na Cloudinary e associadas por `propertyId`.

---

## ⚙️ Como Rodar o Projeto

### 📦 Backend

```bash
# Instalar dependências
npm install

# Iniciar servidor backend
npm run dev
```

O servidor será iniciado em `http://localhost:3000/`.

---

### 🌐 Frontend

Use a extensão **Live Server** (VSCode) ou servidor local para abrir o `index.html`.

---

## 🎨 Cores Principais

- **Marrom:** `#58381a`
- **Creme:** `#f4ebd7`

---

## ✅ Funcionalidades Implementadas

### 🖼️ Carrosséis
- Hero principal
- Imóveis em destaque (51 itens)
- Depoimentos de clientes

### 🔍 Busca de Imóveis
- Formulário dinâmico com filtragem
- Redirecionamento para `search-results.html` com resultados

### 💬 Formulários
- Contato
- Busca

### 📱 Responsividade
Site 100% responsivo com abordagem *mobile-first*:
- Dispositivos móveis (< 768px)
- Tablets (768px - 1024px)
- Desktops (> 1024px)

---

## 🛠️ Melhorias Futuras

- Página de detalhes do imóvel
- Página de busca 
- Formulário para compra/aluguel consumindo dados da API