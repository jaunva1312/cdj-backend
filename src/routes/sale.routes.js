import {Router} from 'express'
import Sale from '../controllers/sale.controller.js'

const router = Router()

router.get('/sale/:id',Sale.getSale);

router.post('/sale', Sale.createSale);

router.patch('/sale/:id', Sale.updateSale);

router.delete('/sale/:id', Sale.deleteSale);

router.get('/salesbyproduct/', Sale.getSalesByProduct);

router.get('/salesbycustomergroup/', Sale.getSalesSumaryByCustomerGroup);

router.get('/salesdetailsbycustomergroup/', Sale.getSalesDetailsByCustomerGroup);

router.get('/salesbyweek/', Sale.getSalesByWeek);



export default router