import {Router} from 'express'
import CustomersGroup from '../controllers/customergroups.controller.js'

const router = Router()

router.get('/customersgroups',CustomersGroup.getCustomersGroups);

router.get('/customergroup/:id',CustomersGroup.getCustomerGroup);

router.post('/customergroup', CustomersGroup.createCustomerGroup);

router.patch('/customergroup/:id', CustomersGroup.updateCustomerGroup);

router.delete('/customergroup/:id', CustomersGroup.deleteCustomerGroup);


export default router
