import express from 'express';
import router from './routes/index';
import { PORT } from './config/index';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(express.json());

app.use('/api/v1', router);

app.get('/', (req, res) => res.send('Hello World'));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default app;
