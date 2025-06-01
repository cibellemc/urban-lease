# Urban Lease - Documentação

![Demonstração](./images/animacao.gif)

## Visão Geral

Este é um site para a imobiliária Urban Lease, desenvolvido com HTML, Tailwind CSS e JavaScript. O site apresenta uma landing page moderna e responsiva com várias seções, incluindo carrosséis interativos.

## Estrutura do Projeto

```
urban-lease/
├── css/
│   └── (arquivos de estilo)
├── data/
│   └── mock-data.json
├── images/
│   └── (arquivos de imagem)
├── js/
│   ├── main.js
│   ├── property-data.js
│   ├── propertyService.js
│   └── search-results.js
├── converter-webp.py
├── index.html
└── search-results.html
```

## Tecnologias Utilizadas

- HTML5 semântico
- Tailwind CSS (via CDN)
- JavaScript vanilla
- Fonte DM Sans (Google Fonts)

## Cores Principais

- Marrom: #58381a
- Creme: #f4ebd7

## Funcionalidades Implementadas

1. **Carrosséis Interativos**

   - Carrossel principal na seção hero
   - Carrossel de imóveis em destaque
   - Carrossel de depoimentos de clientes

2. **Formulários**

   - Formulário de busca de imóveis
   - Formulário de contato

3. **Menu Responsivo**

   - Menu de navegação adaptável para dispositivos móveis

4. **Elementos Interativos**
   - Botões de navegação nos carrosséis
   - Botão de WhatsApp flutuante
   - Tabs na seção "Para você"

## Responsividade

O site foi desenvolvido seguindo o princípio "mobile-first" e é totalmente responsivo, adaptando-se a diferentes tamanhos de tela:

- Dispositivos móveis (< 768px)
- Tablets (768px - 1024px)
- Desktops (> 1024px)

## Como Usar

1. Abra o arquivo `index.html` em um navegador web moderno
2. Para desenvolvimento, você pode modificar os arquivos CSS e JavaScript conforme necessário
3. Para adicionar novas imagens, coloque-as na pasta `images/`
4. Para conversão de imagens para WebP, utilize o script `converter-webp.py`.

## Notas de Implementação

- Os carrosséis são implementados com JavaScript puro, sem dependências externas
- O Tailwind CSS é carregado via CDN para facilitar a implementação
- A fonte DM Sans é carregada do Google Fonts
- O site utiliza HTML semântico para melhor acessibilidade e SEO

## Melhorias Futuras

- Implementar backend para os formulários
- Adicionar páginas internas para detalhes dos imóveis
- Implementar sistema de filtragem avançada
- Adicionar autenticação de usuários
