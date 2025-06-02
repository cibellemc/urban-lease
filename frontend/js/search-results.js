// JavaScript para a página de resultados de busca

// Função para obter parâmetros da URL
function getUrlParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split("&");

  for (let i = 0; i < pairs.length; i++) {
    if (!pairs[i]) continue;

    const pair = pairs[i].split("=");
    params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
  }

  return params;
}

// Função para carregar os dados mockados e aplicar filtros
function loadAndFilterProperties() {
  // Obter parâmetros da URL
  const urlParams = getUrlParams();

  // Preencher os filtros com os valores da URL
  if (urlParams.transaction_type) {
    document.getElementById("filter-transaction").value =
      urlParams.transaction_type;
  }

  if (urlParams.bedrooms) {
    document.getElementById("filter-bedrooms").value = urlParams.bedrooms;
  }

  if (urlParams.price_range) {
    document.getElementById("filter-price").value = urlParams.price_range;
  }

  // Carregar os dados mockados
  fetch("data/mock-data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao carregar os dados: " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      // Aplicar filtros
      const filteredData = filterProperties(data, urlParams);

      // Exibir os resultados
      displayResults(filteredData);
    })
    .catch((error) => {
      console.error("Erro ao carregar os dados mockados:", error);
      document.getElementById("results-count").textContent =
        "Erro ao carregar os imóveis.";
    });
}

// Função para filtrar propriedades com base nos parâmetros
function filterProperties(properties, filters) {
  return properties.filter((property) => {
    // Filtrar por tipo de transação
    if (filters.transaction_type && filters.transaction_type !== "all") {
      const isRent = property.status === "Para alugar";
      if (
        (filters.transaction_type === "rent" && !isRent) ||
        (filters.transaction_type === "buy" && isRent)
      ) {
        return false;
      }
    }

    // Filtrar por tipo de propriedade
    if (filters.property_type && filters.property_type !== "all") {
      if (!property.type.includes(filters.property_type)) {
        return false;
      }
    }

    // Filtrar por número de quartos
    if (filters.bedrooms && filters.bedrooms !== "all") {
      if (filters.bedrooms === "4+") {
        if (property.bedrooms < 4) return false;
      } else if (property.bedrooms != parseInt(filters.bedrooms)) {
        return false;
      }
    }

    // Filtrar por faixa de preço
    if (filters.price_range && filters.price_range !== "all") {
      const [minPrice, maxPrice] = filters.price_range.split("-").map(Number);

      // Extrair o valor numérico do preço (removendo R$, /mês, etc.)
      let propertyPrice = property.price.replace(/[^\d,]/g, "");
      propertyPrice = parseFloat(propertyPrice.replace(",", "."));

      if (propertyPrice < minPrice || propertyPrice > maxPrice) {
        return false;
      }
    }

    // Filtrar por cidade
    if (filters.city && filters.city !== "" && filters.city !== "all") {
      // Aqui assumimos que a cidade está no campo location
      if (
        !property.location.toLowerCase().includes(filters.city.toLowerCase())
      ) {
        return false;
      }
    }

    // Filtrar por bairro
    if (
      filters.neighborhood &&
      filters.neighborhood !== "" &&
      filters.neighborhood !== "all"
    ) {
      // Aqui assumimos que o bairro está no campo location
      if (
        !property.location
          .toLowerCase()
          .includes(filters.neighborhood.toLowerCase())
      ) {
        return false;
      }
    }

    return true;
  });
}

// Função para exibir os resultados filtrados
function displayResults(properties) {
  const resultsGrid = document.getElementById("results-grid");
  const noResults = document.getElementById("no-results");
  const resultsCount = document.getElementById("results-count");

  // Limpar o grid de resultados
  resultsGrid.innerHTML = "";

  // Atualizar a contagem de resultados
  resultsCount.textContent = `${properties.length} imóveis encontrados`;

  // Verificar se há resultados
  if (properties.length === 0) {
    resultsGrid.classList.add("hidden");
    noResults.classList.remove("hidden");
    return;
  }

  // Exibir os resultados
  resultsGrid.classList.remove("hidden");
  noResults.classList.add("hidden");

  // Adicionar cada propriedade ao grid
  properties.forEach((property) => {
    const propertyCard = createPropertyCard(property);
    resultsGrid.appendChild(propertyCard);
  });
}

// Função para criar um card de imóvel
function createPropertyCard(property) {
  const card = document.createElement("div");
  card.className = "bg-white rounded-lg shadow-md overflow-hidden";
  card.setAttribute("data-property-id", property.id);

  card.innerHTML = `
    <div class="relative">
      <img src="${property.image}" alt="${
    property.title
  }" class="w-full h-48 object-cover">
      <span class="absolute top-2 left-2 bg-white text-xs font-medium px-2 py-1 rounded">#${
        property.id
      } - ${property.status}</span>
    </div>
    <div class="p-4">
      <h3 class="font-bold text-lg mb-1">${property.title}</h3>
      <p class="text-sm text-gray-600 mb-3">${property.location}</p>
      <div class="flex justify-between mb-4">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="text-xs">${property.bedrooms} ${
    property.bedrooms > 1 ? "quartos" : "quarto"
  }</span>
        </div>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-xs">${property.type}</span>
        </div>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          <span class="text-xs">${property.parking} ${
    property.parking !== 1 ? "vagas" : "vaga"
  }</span>
        </div>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
          <span class="text-xs">${property.area}</span>
        </div>
      </div>
      <p class="font-bold text-lg text-brown">${property.price}</p>
    </div>
  `;

  return card;
}

// Configurar o formulário de filtro
function setupFilterForm() {
  const filterForm = document.getElementById("filter-form");

  filterForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Construir a URL com os filtros
    const transaction = document.getElementById("filter-transaction").value;
    const propertyType = document.getElementById("filter-type").value;
    const bedrooms = document.getElementById("filter-bedrooms").value;
    const price = document.getElementById("filter-price").value;

    let url = "search-results.html?";
    if (transaction !== "all") url += `transaction_type=${transaction}&`;
    if (propertyType !== "all") url += `property_type=${propertyType}&`;
    if (bedrooms !== "all") url += `bedrooms=${bedrooms}&`;
    if (price !== "all") url += `price_range=${price}&`;

    // Remover o último & se existir
    if (url.endsWith("&")) {
      url = url.slice(0, -1);
    }

    // Redirecionar para a URL com os filtros
    window.location.href = url;
  });
}

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function () {
  loadAndFilterProperties();
  setupFilterForm();
});
