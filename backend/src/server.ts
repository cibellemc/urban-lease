import Fastify from "fastify";
import fastifyCors from '@fastify/cors'
import swagger from "./plugins/swagger";
import propertyRoutes from "./routes/property.route";

const fastify = Fastify({ logger: true });

// Plugins
fastify.register(swagger);
// fastify.register(require('fastify-pagination'))

fastify.register(fastifyCors, {
  origin: true,
  methods: ['GET'],
  allowedHeaders: [
    'content-type',
    'accept',
    'content-type',
    'authorization'
  ],
})
// Routes
fastify.register(propertyRoutes, { prefix: "/properties" });

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});
