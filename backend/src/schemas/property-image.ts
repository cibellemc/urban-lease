import { z } from "zod";

export const propertyImageSchema = z.object({
  id: z.string(),
  propertyId: z.string(), // Referência ao imóvel
  url: z.string().url(),
  description: z.string().optional(),
  isPrimary: z.boolean(), // Imagem principal
});

export type PropertyImage = z.infer<typeof propertyImageSchema>;