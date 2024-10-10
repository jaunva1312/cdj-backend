import {Router} from 'express'
import Sale from '../controllers/sale.controller.js'

const router = Router()

router.get('/salesbyproduct/', Sale.getSalesByProduct);

router.get('/salesbycustomergroup/', Sale.getSalesSumaryByCustomerGroup);



export default router