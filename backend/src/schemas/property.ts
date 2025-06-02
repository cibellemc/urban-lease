import { z } from "zod";

export const propertySchema = z.object({
  id: z.number(),
  title: z.string(),
  location: z.string(),
  price: z.number(),
  currency: z.string(),
  period: z.string().optional(), // Ex: "/mês"
  bedrooms: z.number(),
  type: z.string(),
  parking: z.number(),
  area: z.string(),
  image: z.string(),
  status: z.string(),
  featured: z.boolean(),
});

export type Property = z.infer<typeof propertySchema>;
