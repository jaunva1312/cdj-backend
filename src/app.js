import express from 'express'
import customerRoutes from './routes/customer.routes.js'
import customerGroupRoutes from './routes/customergroup.routes.js'


const app = express();



//Middleware
app.use(express.json());


//Routes
app.use('/api',customerRoutes);
app.use(customerGroupRoutes);


app.use((req,res, next) => {
    res.status(404).json({
        message: 'Endpoint not found'
    });
})

export default app;