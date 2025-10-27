import {Router} from 'express'
import ProductGroup from '../controllers/productgroup.controller.js'
import  {authJwt}  from '../middlewares/index.js'

const router = Router()

router.get('/productgroups', ProductGroup.getProductGroups);

router.get('/productgroup/:id', ProductGroup.getProductGroup);

router.post('/productgroup', ProductGroup.createProductGroup);

router.patch('/productgroup/:id', ProductGroup.updateProductGroup);

router.delete('/productgroup/:id', ProductGroup.deleteProductGroup);





export default router