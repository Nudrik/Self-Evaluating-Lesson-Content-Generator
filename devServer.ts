import app from './server.js';
import { createServer as createViteServer } from 'vite';

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
    },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(port, '0.0.0.0', () => {
    console.log(`Frontend and backend running at http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start development server:', error);
  process.exit(1);
});