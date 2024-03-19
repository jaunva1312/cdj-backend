import {Router} from 'express'
import Warehouse from '../controllers/warehouse.controller.js'
import  {authJwt}  from '../middlewares/index.js'

const router = Router()

router.get('/warehouses', Warehouse.getWarehouses);

router.get('/warehouse/:id', Warehouse.getWarehouse);

router.post('/warehouse', Warehouse.createWarehouse);

router.patch('/warehouse/:id', Warehouse.updateWarehouse);

router.delete('/warehouse/:id', Warehouse.deleteWarehouse);





export default router