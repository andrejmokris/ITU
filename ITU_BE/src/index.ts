import express from 'express';
import router from './routes/user-routes';
import shopRouter from './routes/shop-routes';
import errorMiddleware from './middleware/errorMiddleware';
import cors from 'cors';
import follow_router from './routes/follow-routes';
import review_router from './routes/review-routes';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Allow requests from 'http://localhost:5173'
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  // Set credentials to true
  credentials: true
};

app.use(cors(corsOptions));

app.use('/api/users', router);
app.use('/api/shops', shopRouter);
app.use('/api/follows', follow_router);
app.use('/api/reviews', review_router);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
