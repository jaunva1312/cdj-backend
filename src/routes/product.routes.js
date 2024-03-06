import {Router} from 'express'
import Product from '../controllers/product.controller.js'
import  {authJwt}  from '../middlewares/index.js'

const router = Router()

router.get('/products', Product.getProducts);

router.get('/product/:id', Product.getProduct);

router.post('/product', Product.createProduct);

router.patch('/product/:id', Product.updateProduct);

router.delete('/product/:id', Product.deleteProduct);





export default router