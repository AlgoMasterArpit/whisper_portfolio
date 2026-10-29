import react from '@vitejs/plugin-react';
import { loadEnv, type Plugin } from 'vite';
import { configDefaults, defineConfig } from 'vitest/config';

function localApi(): Plugin {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const route = req.url?.match(/^\/api\/(ask|speak|hit|go|stats)(?:\?|$)/)?.[1];
        if (!route) return next();
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const handler = (await server.ssrLoadModule(`/api/${route}.ts`))[req.method ?? 'GET'];
        if (!handler) {
          res.statusCode = 405;
          return res.end();
        }
        const response: Response = await handler(
          new Request(`http://localhost${req.url}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
          }),
        );
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(Buffer.from(await response.arrayBuffer()));
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ['LLM_', 'TTS_', 'KV_', 'UPSTASH_', 'STATS_', 'WISPR_']));
  return {
    plugins: [react(), localApi()],
    test: {
      environment: 'node',
      testTimeout: 15_000,
      exclude: [...configDefaults.exclude, 'e2e/**'],
    },
  };
});
