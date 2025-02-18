import express from 'express'
import userRoutes from './routers/users.routers.js'
import categoriesRoutes from './routers/categories.routers.js'
import productRoutes from './routers/products.routers.js'
import orderRoutes from './routers/orders.routers.js'
import cartRoutes from './routers/cart.routers.js'
import cors from 'cors'
import ratingRouter from './routers/ratings.routers.js'
import 'dotenv/config'

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.json("Hello World");
})

app.use('/api', userRoutes);
app.use('/api', categoriesRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', cartRoutes);
app.use('/api', ratingRouter);

app.listen(PORT, () => {
    console.log(`The server is running on https://localhost:${PORT}`)
})