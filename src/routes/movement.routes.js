import {Router} from 'express'
import Movement from '../controllers/movement.controller.js'
import  {authJwt}  from '../middlewares/index.js'

const router = Router()

//router.get('/movements', Movement.get);

router.get('/movement/:id', Movement.getMovement);

router.post('/movement', Movement.createMovement);

router.patch('/movement/:id', Movement.updateMovement);

router.delete('/movement/:id', Movement.deleteMovement);





export default router