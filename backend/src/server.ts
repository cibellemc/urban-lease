import Fastify from "fastify";
import swagger from "./plugins/swagger";
import propertyRoutes from "./routes/property.route";

const fastify = Fastify({ logger: true });

// Plugins
fastify.register(swagger);
// fastify.register(require('fastify-pagination'))

// Routes
fastify.register(propertyRoutes, { prefix: "/properties" });

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});
