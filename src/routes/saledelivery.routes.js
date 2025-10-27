import {Router} from 'express'
import SaleDelivery from '../controllers/saledelivery.controller.js'

const router = Router()

router.get('/salesdeliveries/:saleid',SaleDelivery.getSalesDeliveries);

router.get('/saledelivery/:id',SaleDelivery.getSaleDelivery);

router.post('/salesdeliverys', SaleDelivery.createSalesDeliveries);

router.patch('/saledelivery/:id', SaleDelivery.updateSaleDelivery);

router.delete('/saledelivery/:id', SaleDelivery.deleteSaleDelivery);



export default router