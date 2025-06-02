import fp from "fastify-plugin";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export default fp(async (fastify) => {
  fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: "Urban Lease API",
        description: "API documentação da Urban Lease",
        version: "1.0.0",
      },
      host: "localhost:3000",
      schemes: ["http"],
    },
  });

  fastify.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });
});
