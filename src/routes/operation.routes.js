import {Router} from 'express'
import Operation from '../controllers/operation.controller.js'

const router = Router()

router.get('/operation/:id', Operation.getOperation);

router.post('/operation', Operation.createOperation);

router.patch('/operation/:id', Operation.updateOperation);

router.delete('/operation/:id', Operation.deleteOperation);


export default router