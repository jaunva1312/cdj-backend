import {Router} from 'express'
import CustomersGroup from '../controllers/customergroups.controller.js'

const router = Router()

router.get('/customersgroups',CustomersGroup.getCustomersGroups);

router.get('/customersgroup',CustomersGroup.getCustomersGroup);

router.post('/customersgroup', CustomersGroup.createCustomersGroup);

router.put('/customersgroup', CustomersGroup.updateCustomersGroup);

router.delete('/customersgroup', CustomersGroup.deleteCustomersGroup);

export default router
