import { FastifyInstance } from "fastify";
import { Property } from "../schemas/property";

async function getData(): Promise<Property[]> {
  try {
    const json = await import("../data/imoveis-json.json"); // pra isso, ativar "resolveJsonModule" no tsconfig
    return json.imoveis;
  } catch (error) {
    console.error("Erro ao importar arquivo:", error);
    throw error;
  }
}

export default async function propertyRoutes(fastify: FastifyInstance) {
  // Rota para listar todos os imóveis
  fastify.get("/", async () => {
    return await getData();
  });

  // Rota para listar apenas imóveis em destaque
  fastify.get("/featured", async () => {
    const properties = await getData(); 
    return properties.filter((p) => p.destaque); 
  });

  // Rota para buscar por cod
  fastify.get("/:cod", async (request) => {
    const { cod } = request.params as { cod: string };
    const properties = await getData();
    const property = properties.find((p) => p.cod === cod);
    
    if (!property) {
      throw new Error("Imóvel não encontrado");
    }
    
    return property;
  });

  // Rota para filtrar por cidade
  // fastify.get("/city/:cidade", async (request) => {
  //   const { cidade } = request.params as { cidade: string };
  //   const properties = await getData();
  //   return properties.filter((p) => 
  //     p.localizacao.cidade.toLowerCase() === cidade.toLowerCase()
  //   );
  // });

  // Rota para filtrar por estado
  // fastify.get("/state/:estado", async (request) => {
  //   const { estado } = request.params as { estado: string };
  //   const properties = await getData();
  //   return properties.filter((p) => 
  //     p.localizacao.estado.toUpperCase() === estado.toUpperCase()
  //   );
  // });
}