import express from 'express'
import customerRoutes from './routes/customer.routes.js'
import customerGroupRoutes from './routes/customergroup.routes.js'
import orderRoutes from './routes/order.routes.js'
import operationInputRoutes from './routes/opeinput.routes.js'
import operationReturnRoutes from './routes/opereturn.routes.js'
import operationRoutes from './routes/operation.routes.js'


const app = express();



//Middleware
app.use(express.json());


//Routes
app.use('/api',customerRoutes);
app.use('/api',orderRoutes);
app.use('/api',customerGroupRoutes);
app.use('/api',operationInputRoutes);
app.use('/api',operationReturnRoutes);
app.use('/api',operationRoutes);



app.use((req,res, next) => {
    res.status(404).json({
        message: 'Endpoint not found'
    });
})

export default app;