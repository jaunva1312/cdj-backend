import {Router} from 'express'
import OpeInput from '../controllers/opeinput.controller.js'

const router = Router()

router.get('/operationinput/:id', OpeInput.getOperationInput);

router.post('/operationinput', OpeInput.createOperationInput);

router.patch('/operationinput/:id', OpeInput.updateOperationInput);

router.delete('/operationinput/:id', OpeInput.deleteOperationInput);

export default router