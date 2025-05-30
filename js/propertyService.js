class PropertyService {
  constructor() {
    this.properties = [];
  }

  async loadProperties() {
    try {
      const response = await fetch("data/mockProperties.json");
      this.properties = await response.json();
    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
    }
  }

  getFeaturedProperties() {
    return this.properties.filter((property) => property.featured);
  }

  searchProperties(filters = {}) {
    return this.properties.filter((property) => {
      return (
        (!filters.location ||
          property.location
            .toLowerCase()
            .includes(filters.location.toLowerCase())) &&
        (!filters.type ||
          property.type.toLowerCase() === filters.type.toLowerCase()) &&
        (!filters.status ||
          property.status.toLowerCase() === filters.status.toLowerCase())
      );
    });
  }

  formatPrice(property) {
    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return property.priceType === "mês"
      ? `${formatter.format(property.price)}/mês`
      : formatter.format(property.price);
  }
}

window.propertyService = new PropertyService();
