import {Router} from 'express'
import ProductCategory from '../controllers/productcategory.controller.js'
import  {authJwt}  from '../middlewares/index.js'

const router = Router()

router.get('/productcategories', ProductCategory.getProductCategories);

router.get('/productcategory/:id', ProductCategory.getProductCategory);

router.post('/productcategory', ProductCategory.createProductCategory);

router.patch('/productcategory/:id', ProductCategory.updateProductCategory);

router.delete('/productcategory/:id', ProductCategory.deleteProductCategory);





export default router