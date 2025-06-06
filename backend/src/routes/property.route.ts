import { FastifyInstance } from "fastify";
import { Property } from "../schemas/property";

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

async function getData(): Promise<Property[]> {
  try {
    const json = await import("../data/imoveis-json.json");
    return json.imoveis;
  } catch (error) {
    console.error("Erro ao importar arquivo:", error);
    throw error;
  }
}

function applyFilters(properties: Property[], filters: PropertyFilters): Property[] {
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

  // Rota para listar imóveis com paginação e filtros
  fastify.get<{ Querystring: PropertyQuery }>("/", {
    schema: {
      querystring: querySchema
    }
  }, async (request) => {
    const { page = 1, limit = 10, ...filters } = request.query;
    
    const allProperties = await getData();
    const filteredProperties = applyFilters(allProperties, filters);
    
    return paginate(filteredProperties, page, limit);
  });

  // Rota para listar apenas imóveis em destaque (com paginação)
  fastify.get<{ Querystring: PaginationQuery }>("/featured", {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', minimum: 1, default: 1 },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
        }
      }
    }
  }, async (request) => {
    const { page = 1, limit = 10 } = request.query;
    
    const properties = await getData();
    const featuredProperties = properties.filter((p) => p.destaque);
    
    return paginate(featuredProperties, page, limit);
  });

  // Rota para buscar por código específico
  fastify.get<{ Params: { cod: string } }>("/:cod", async (request, reply) => {
    const { cod } = request.params;
    const properties = await getData();
    const property = properties.find((p) => p.cod === cod);
    
    if (!property) {
      reply.code(404);
      return { error: "Imóvel não encontrado" };
    }
    
    return property;
  });

    // Rota para buscar valores únicos (p/ filtros)
  fastify.get("/filters/options", async () => {
    const properties = await getData();
    
    const options = {
      cidades: [...new Set(properties.map(p => p.localizacao.cidade))].sort(),
      estados: [...new Set(properties.map(p => p.localizacao.estado))].sort(),
      tipos: [...new Set(properties.map(p => p.tipo))].sort(),
      quartos: [...new Set(properties.map(p => p.quartos))].sort((a, b) => a - b),
      estacionamentos: [...new Set(properties.map(p => p.estacionamento))].sort((a, b) => a - b)
    };
    
    return options;
  });

  // Rota para obter estatísticas dos imóveis
  // fastify.get("/stats", async () => {
  //   const properties = await getData();
    
  //   const stats = {
  //     total: properties.length,
  //     destaque: properties.filter(p => p.destaque).length,
  //     porCidade: properties.reduce((acc, p) => {
  //       const cidade = p.localizacao.cidade;
  //       acc[cidade] = (acc[cidade] || 0) + 1;
  //       return acc;
  //     }, {} as Record<string, number>),
  //     porEstado: properties.reduce((acc, p) => {
  //       const estado = p.localizacao.estado;
  //       acc[estado] = (acc[estado] || 0) + 1;
  //       return acc;
  //     }, {} as Record<string, number>),
  //     precoMedio: properties.reduce((sum, p) => sum + p.preco, 0) / properties.length,
  //     precoMin: Math.min(...properties.map(p => p.preco)),
  //     precoMax: Math.max(...properties.map(p => p.preco))
  //   };
    
  //   return stats;
  // });
}