import {Router} from 'express'
import OpeReturn from '../controllers/opereturn.controller.js'

const router = Router()

router.get('/operationreturn/:id', OpeReturn.getOperationReturn);

//router.get('/weekpercentage/:customergroupid', OpeReturn.getWeekReturnsPercentage);

router.get('/totalreturns', OpeReturn.getTotalReturnsByName);

router.post('/operationreturn', OpeReturn.createOperationReturn);

router.patch('/operationreturn/:id', OpeReturn.updateOperationReturn);

router.delete('/operationreturn/:id', OpeReturn.deleteOperationReturn);

export default router