import { FastifyInstance } from "fastify";
import { Property } from "../schemas/property";
import { PropertyImage } from "../schemas/property-image";

// Interfaces para tipagem dos query parameters
interface PaginationQuery {
  page?: number;
  limit?: number;
}

interface PropertyFilters {
  cidade?: string;
  estado?: string;
  tipo?: string;
  precoMin?: number;
  precoMax?: number;
  destaque?: boolean;
  quartos?: number;
  estacionamentos?: number;
}

interface PropertyQuery extends PaginationQuery, PropertyFilters {}

interface PropertyWithImages extends Property {
  images: PropertyImage[];
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Cache para evitar recarregar os arquivos
let propertiesCache: Property[] | null = null;
let imagesCache: PropertyImage[] | null = null;

async function getProperties(): Promise<Property[]> {
  if (propertiesCache) return propertiesCache;
  
  try {
    const json = await import("../data/imoveis-json.json");
    propertiesCache = json.imoveis;
    return propertiesCache;
  } catch (error) {
    console.error("Erro ao importar arquivo de imóveis:", error);
    throw error;
  }
}

async function getImages(): Promise<PropertyImage[]> {
  if (imagesCache) return imagesCache;
  
  try {
    const json = await import("../data/property-images.json");
    imagesCache = json.images;
    return imagesCache;
  } catch (error) {
    console.error("Erro ao importar arquivo de imagens:", error);
    throw error;
  }
}

async function getPropertiesWithImages(): Promise<PropertyWithImages[]> {
  const [properties, images] = await Promise.all([
    getProperties(),
    getImages()
  ]);
  
  // Cria um mapa de imagens por propertyId para performance
  const imagesByPropertyId = images.reduce((acc, image) => {
    if (!acc[image.propertyId]) {
      acc[image.propertyId] = [];
    }
    acc[image.propertyId].push(image);
    return acc;
  }, {} as Record<string, PropertyImage[]>);
  
  // Combina propriedades com suas imagens
  return properties.map(property => ({
    ...property,
    images: imagesByPropertyId[property.id] || []
  }));
}

function applyFilters(properties: PropertyWithImages[], filters: PropertyFilters): PropertyWithImages[] {
  return properties.filter((property) => {
    // Filtro por cidade
    if (filters.cidade && 
        !property.localizacao.cidade.toLowerCase().includes(filters.cidade.toLowerCase())) {
      return false;
    }

    // Filtro por estado
    if (filters.estado && 
        property.localizacao.estado.toUpperCase() !== filters.estado.toUpperCase()) {
      return false;
    }

    // Filtro por tipo
    if (filters.tipo && 
        !property.tipo.toLowerCase().includes(filters.tipo.toLowerCase())) {
      return false;
    }

    // Filtro por preço mínimo
    if (filters.precoMin && property.preco < filters.precoMin) {
      return false;
    }

    // Filtro por preço máximo
    if (filters.precoMax && property.preco > filters.precoMax) {
      return false;
    }

    // Filtro por destaque
    if (filters.destaque !== undefined && property.destaque !== filters.destaque) {
      return false;
    }

    // Filtro por quartos
    if (filters.quartos && property.quartos !== filters.quartos) {
      return false;
    }

    // Filtro por vagas de estacionamento
    if (filters.estacionamentos && property.estacionamento !== filters.estacionamentos) {
      return false;
    }

    return true;
  });
}

function paginate<T>(data: T[], page: number = 1, limit: number = 10): PaginatedResponse<T> {
  const offset = (page - 1) * limit;
  const paginatedData = data.slice(offset, offset + limit);
  const total = data.length;
  const totalPages = Math.ceil(total / limit);

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export default async function propertyRoutes(fastify: FastifyInstance) {
  // Schema para validação dos query parameters
  const querySchema = {
    type: 'object',
    properties: {
      page: { type: 'integer', minimum: 1, default: 1 },
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
      cidade: { type: 'string' },
      estado: { type: 'string' },
      tipo: { type: 'string' },
      precoMin: { type: 'number', minimum: 0 },
      precoMax: { type: 'number', minimum: 0 },
      destaque: { type: 'boolean' },
      quartos: { type: 'integer', minimum: 0 },
      estacionamentos: { type: 'integer', minimum: 0 }
    }
  };

  // Rota para listar imóveis com paginação, filtros e imagens
  fastify.get<{ Querystring: PropertyQuery }>("/", {
    schema: {
      querystring: querySchema,
      description: 'Lista todos os imóveis com suas imagens',
      tags: ['properties']
    }
  }, async (request) => {
    const { page = 1, limit = 10, ...filters } = request.query;
    
    const allProperties = await getPropertiesWithImages();
    const filteredProperties = applyFilters(allProperties, filters);
    
    return paginate(filteredProperties, page, limit);
  });

  // Rota para listar apenas imóveis em destaque (com paginação e imagens)
  fastify.get<{ Querystring: PaginationQuery }>("/featured", {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
        }
      },
      description: 'Lista apenas imóveis em destaque com suas imagens',
      tags: ['properties']
    }
  }, async (request) => {
    const { page = 1, limit = 10 } = request.query;
    
    const properties = await getPropertiesWithImages();
    const featuredProperties = properties.filter((p) => p.destaque);
    
    return paginate(featuredProperties, page, limit);
  });

  // Rota para buscar por código específico (com imagens)
  fastify.get<{ Params: { cod: string } }>("/:cod", {
    schema: {
      params: {
        type: 'object',
        properties: {
          cod: { type: 'string' }
        },
        required: ['cod']
      },
      description: 'Busca um imóvel específico pelo código',
      tags: ['properties']
    }
  }, async (request, reply) => {
    const { cod } = request.params;
    const properties = await getPropertiesWithImages();
    const property = properties.find((p) => p.cod === cod);
    
    if (!property) {
      reply.code(404);
      return { error: "Imóvel não encontrado" };
    }
    
    return property;
  });

  // Rota para buscar por ID específico (com imagens)
  fastify.get<{ Params: { id: string } }>("/id/:id", {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      description: 'Busca um imóvel específico pelo ID',
      tags: ['properties']
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const properties = await getPropertiesWithImages();
    const property = properties.find((p) => p.id === id);
    
    if (!property) {
      reply.code(404);
      return { error: "Imóvel não encontrado" };
    }
    
    return property;
  });

  // Rota para buscar apenas as imagens de um imóvel
  fastify.get<{ Params: { id: string } }>("/id/:id/images", {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      description: 'Busca apenas as imagens de um imóvel específico',
      tags: ['properties', 'images']
    }
  }, async (request, reply) => {
    const { id } = request.params;
    const images = await getImages();
    const propertyImages = images.filter(img => img.propertyId === id);
    
    if (propertyImages.length === 0) {
      reply.code(404);
      return { error: "Nenhuma imagem encontrada para este imóvel" };
    }
    
    return propertyImages;
  });

  // Rota para buscar valores únicos (p/ filtros)
  fastify.get("/filters/options", {
    schema: {
      description: 'Retorna opções disponíveis para filtros',
      tags: ['properties', 'filters']
    }
  }, async () => {
    const properties = await getPropertiesWithImages();
    
    const options = {
      cidades: [...new Set(properties.map(p => p.localizacao.cidade))].sort(),
      estados: [...new Set(properties.map(p => p.localizacao.estado))].sort(),
      tipos: [...new Set(properties.map(p => p.tipo))].sort(),
      quartos: [...new Set(properties.map(p => p.quartos))].sort((a, b) => a - b),
      estacionamentos: [...new Set(properties.map(p => p.estacionamento))].sort((a, b) => a - b),
      precoRange: {
        min: Math.min(...properties.map(p => p.preco)),
        max: Math.max(...properties.map(p => p.preco))
      }
    };
    
    return options;
  });

  // Rota para obter estatísticas dos imóveis
  fastify.get("/stats", {
    schema: {
      description: 'Retorna estatísticas gerais dos imóveis',
      tags: ['properties', 'statistics']
    }
  }, async () => {
    const properties = await getPropertiesWithImages();
    const images = await getImages();
    
    const stats = {
      totalImoveis: properties.length,
      totalImagens: images.length,
      imagensPorImovel: (images.length / properties.length).toFixed(2),
      destaque: properties.filter(p => p.destaque).length,
      porCidade: properties.reduce((acc, p) => {
        const cidade = p.localizacao.cidade;
        acc[cidade] = (acc[cidade] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      porEstado: properties.reduce((acc, p) => {
        const estado = p.localizacao.estado;
        acc[estado] = (acc[estado] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      porTipo: properties.reduce((acc, p) => {
        acc[p.tipo] = (acc[p.tipo] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      precos: {
        medio: properties.reduce((sum, p) => sum + p.preco, 0) / properties.length,
        minimo: Math.min(...properties.map(p => p.preco)),
        maximo: Math.max(...properties.map(p => p.preco))
      }
    };
    
    return stats;
  });

  // Rota para limpar o cache (útil durante desenvolvimento)
  fastify.delete("/cache", {
    schema: {
      description: 'Limpa o cache de dados (desenvolvimento)',
      tags: ['development']
    }
  }, async () => {
    propertiesCache = null;
    imagesCache = null;
    return { message: "Cache limpo com sucesso" };
  });
}