import { z } from "zod";

export const propertySchema = z.object({
  id: z.string(),
  cod: z.string(),
  titulo: z.string(),
  localizacao: z.object({
    logradouro: z.string(),
    numero: z.string(),
    complemento: z.string(),
    bairro: z.string(),
    cidade: z.string(),
    estado: z.string(),
    cep: z.string(),
  }),
  preco: z.number(),
  moeda: z.string(),
  periodo: z.string().optional(), // Ex: "/mês"
  quartos: z.number(),
  tipo: z.string(),
  estacionamento: z.number(),
  area: z.string(),
  images: z.array(z.string()),
  status: z.string(),
  destaque: z.boolean(),
});

export type Property = z.infer<typeof propertySchema>;
