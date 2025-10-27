import {Router} from 'express'
import * as Auth from '../controllers/auth.controller.js'
import  {verifySignUp}  from '../middlewares/index.js'

const router = Router()

router.post('/signup', verifySignUp.checkDuplicateUsernameOrEmail, Auth.signUp);
router.post('/login', Auth.login);
router.patch('/user/:id', Auth.updateUser);




export default router