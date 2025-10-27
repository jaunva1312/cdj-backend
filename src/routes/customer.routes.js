import {Router} from 'express'
import Customer from '../controllers/customer.controller.js'

import  {authJwt}  from '../middlewares/index.js'

const router = Router()

router.get('/customers', [authJwt.verifyToken, authJwt.isAdmin], Customer.getCustomers);

router.get('/customer/:id', [authJwt.verifyToken, authJwt.isDeliveryMan], Customer.getCustomer);

router.get('/customersByGroup/:id', [authJwt.verifyToken, authJwt.isDeliveryMan], Customer.getCustomersByGroup);

router.get('/customers/nearest-customer/:lat/:long', Customer.getNearestSellPoint);

router.get('/customers/customers-without-sales-today', Customer.getCustomersWithoutTodaysSale);

router.post('/customer', [authJwt.verifyToken, authJwt.isDeliveryMan], Customer.createCustomer);

router.patch('/customer/:id', authJwt.verifyToken, Customer.updateCustomer);

router.delete('/customer/:id', [authJwt.verifyToken, authJwt.isAdmin], Customer.deleteCustomer);



export default router