import {Router} from 'express'
import Customer from '../controllers/customer.controller.js'

import  {authJwt}  from '../middlewares/index.js'

const router = Router()

router.get('/customers', [authJwt.verifyToken, authJwt.isAdmin], Customer.getCustomers);

router.get('/customer/:id', [authJwt.verifyToken, authJwt.isDeliveryMan, authJwt.isSalesSupervisor, authJwt.isAdmin], Customer.getCustomer);

router.get('/customersByGroup/:id', [authJwt.verifyToken, authJwt.isDeliveryMan, authJwt.isSalesSupervisor, authJwt.isAdmin], Customer.getCustomersByGroup);

router.post('/customer', [authJwt.verifyToken, authJwt.isSalesSupervisor, authJwt.isAdmin], Customer.createCustomer);

router.patch('/customer/:id', [authJwt.isDeliveryMan, authJwt.isSalesSupervisor, authJwt.isAdmin], Customer.updateCustomer);

router.delete('/customer/:id', [authJwt.verifyToken, authJwt.isAdmin], Customer.deleteCustomer);

export default router