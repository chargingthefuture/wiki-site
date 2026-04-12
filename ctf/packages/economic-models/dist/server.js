import Fastify from 'fastify';
import { economicModelsRoutes } from './api';
const app = Fastify();
economicModelsRoutes(app);
const port = process.env.PORT || 4000;
app.listen({ port: Number(port), host: '0.0.0.0' }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    console.log(`Economic Models API listening at ${address}`);
});
