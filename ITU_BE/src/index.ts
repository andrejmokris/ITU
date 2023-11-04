import express from 'express';
import router from './routes/user-routes';
import errorMiddleware from './middleware/errorMiddleware';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', router);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
