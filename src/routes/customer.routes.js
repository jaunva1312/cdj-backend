import {Router} from 'express'
import Customer from '../controllers/customer.controller.js'

const router = Router()

router.get('/customers', Customer.getCustomers);

router.get('/customer/:id', Customer.getCustomer);

router.get('/customersByGroup/:id', Customer.getCustomersByGroup);

router.post('/customer', Customer.createCustomer);

router.patch('/customer/:id', Customer.updateCustomer);

router.delete('/customer/:id', Customer.deleteCustomer);

export default router