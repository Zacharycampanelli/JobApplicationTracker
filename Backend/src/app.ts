import cors from "cors";
import express from "express";
import path from "node:path";

import { prisma } from "./lib/prisma";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  '/uploads/avatars',
  express.static(path.join(process.cwd(), 'uploads', 'avatars'))
);
app.use(routes);

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$connect();

    res.json({
      status: 'ok',
      database: 'connected',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      database: 'not connected',
    });
  }
});

export default app;
