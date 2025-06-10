// Função para carregar e exibir os dados da API na seção de destaques
function loadFeaturedProperties() {
  const carouselContainer = document.querySelector(
    "#destaques-carousel .carousel-container"
  );

  // Mostrar loader enquanto carrega
  carouselContainer.innerHTML =
    '<div class="text-center py-8">Carregando imóveis...</div>';

  fetch("http://localhost:3000/properties/featured?page=1&limit=10")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao carregar os dados: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (data.data && data.data.length > 0) {
        displayFeaturedProperties(data.data);
      } else {
        carouselContainer.innerHTML =
          '<div class="text-center py-8">Nenhum imóvel em destaque no momento.</div>';
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar os dados:", error);
      carouselContainer.innerHTML =
        '<div class="text-center py-8 text-red-500">Erro ao carregar imóveis destacados.</div>';
    });
}

// Função para exibir os imóveis destacados no carrossel
function displayFeaturedProperties(properties) {
  const container = document.querySelector(
    "#destaques-carousel .carousel-container"
  );
  if (!container) return;

  // Limpar o conteúdo atual
  container.innerHTML = "";

  // Adicionar cada propriedade ao carrossel
  properties.forEach((property) => {
    const propertyCard = createPropertyCard(property);
    container.appendChild(propertyCard);
  });

  // ✅ Inicializar carrossel depois dos slides serem inseridos
  initCarouselScrollBy("destaques-carousel");
}

// Função para criar um card de imóvel
function createPropertyCard(property) {
  const card = document.createElement("div");
  card.className =
    "carousel-slide min-w-[300px] md:min-w-[350px] bg-white rounded-lg shadow-md overflow-hidden";
  card.setAttribute("data-property-id", property.id);

  // Formatar preço
  const formattedPrice =
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: property.moeda || "BRL",
    }).format(property.preco) + (property.periodo || "");

  card.innerHTML = `
    <div class="relative">
<img src="${
    property.images.find((image) => image.isPrimary)?.url ||
    "https://res.cloudinary.com/dzsucacly/image/upload/v1749495640/apto_pes3kp.webp"}" alt="${property.titulo}" class="w-full h-48 object-cover">
      <span class="absolute top-2 right-2 bg-white text-xs font-medium px-2 py-1 rounded">${
        property.status
      }</span>
    </div>
    <div class="p-4">
      <h3 class="font-bold text-lg mb-1">${property.titulo}</h3>
      <p class="text-sm text-gray-600 mb-3">${property.localizacao.bairro} • ${
    property.tipo
  }</p>
      <div class="flex justify-between mb-4">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-xs">${property.quartos} ${
    property.quartos === 1 ? "quarto" : "quartos"
  }</span>
        </div>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-xs">${property.tipo}</span>
        </div>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          <span class="text-xs">${property.estacionamento} ${
    property.estacionamento === 1 ? "vaga" : "vagas"
  }</span>
        </div>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
          <span class="text-xs">${property.area}</span>
        </div>
      </div>
      <p class="font-bold text-lg text-brown">${formattedPrice}</p>
    </div>
  `;

  return card;
}

// Carregar os dados quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function () {
  loadFeaturedProperties();
});
