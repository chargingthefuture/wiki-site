import { FastifyInstance } from 'fastify';
import { extractAnonymizedTransactions, extractAnonymizedRegionalFlows, extractAnonymizedInputOutput } from './etl';
import { computeNetworkInterdependence } from './module-network';
import { computeGeopoliticalInterdependence } from './module-geopolitical';
import { computeInputOutputInterdependence } from './module-inputoutput';

// --- API Routes ---
export async function economicModelsRoutes(app: FastifyInstance) {
  // POST /api/economic-models/network/scores
  app.post('/api/economic-models/network/scores', async (req, reply) => {
    const { rawRecords } = req.body as { rawRecords: any[] };
    const transactions = extractAnonymizedTransactions(rawRecords);
    const result = computeNetworkInterdependence(transactions);
    reply.send(result);
  });

  // POST /api/economic-models/geopolitical/scores
  app.post('/api/economic-models/geopolitical/scores', async (req, reply) => {
    const { rawRecords } = req.body as { rawRecords: any[] };
    const flows = extractAnonymizedRegionalFlows(rawRecords);
    const result = computeGeopoliticalInterdependence(flows);
    reply.send(result);
  });

  // POST /api/economic-models/input-output/scores
  app.post('/api/economic-models/input-output/scores', async (req, reply) => {
    const { rawRecords } = req.body as { rawRecords: any[] };
    const ioRecords = extractAnonymizedInputOutput(rawRecords);
    const result = computeInputOutputInterdependence(ioRecords);
    reply.send(result);
  });
}
