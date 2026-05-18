import express from 'express';
import cors from 'cors';
import { prisma } from './lib/prisma';
import routes from './routes';

const app = express();
app.use(cors());
app.use(express.json());

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



const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
