import {Router} from 'express'
import Order from '../controllers/orders.controller.js'

const router = Router()

router.get('/order/:customerID/:productID/:date', Order.getCustomerOrderByProduct);


export default router